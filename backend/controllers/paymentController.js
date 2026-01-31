const Payment = require("../models/Payment");
const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");

/**
 * @desc   Create payment for a service request
 * @route  POST /api/payment/create
 * @access Client
 */
exports.createPayment = async (req, res) => {
  try {
    const { serviceRequestId, paymentMethod } = req.body;

    const serviceRequest = await ServiceRequest.findById(serviceRequestId)
      .populate("service")
      .populate("provider");

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    if (serviceRequest.status !== "accepted") {
      return res
        .status(400)
        .json({ message: "Service request not accepted yet" });
    }

    const amount = serviceRequest.service.basePrice;

    const payment = await Payment.create({
      serviceRequest: serviceRequest._id,
      client: req.user._id,
      provider: serviceRequest.provider,
      amount,
      paymentMethod,
      paymentStatus: "success" // simulate successful payment
    });

    res.status(201).json({
      message: "Payment successful",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

/**
 * @desc   Get client payment history
 * @route  GET /api/payment/client
 * @access Client
 */
exports.getClientPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ client: req.user._id })
      .populate("serviceRequest")
      .populate("provider", "name");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/**
 * @desc   Get provider payment history
 * @route  GET /api/payment/provider
 * @access Provider
 */
exports.getProviderPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ provider: req.user._id })
      .populate("serviceRequest")
      .populate("client", "name");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
