const Payment = require("../models/Payment");
const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");
const { generateInvoice } = require("../features/invoiceGenerator");
const crypto = require("crypto");

/**
 * @desc   Create payment for a service request
 * @route  POST /api/payment/create
 * @access Client
 */
exports.  createPayment = async (req, res) => {
  try {
    const { serviceRequestId, paymentMethod } = req.body;
const serviceRequest = await ServiceRequest.findById(serviceRequestId)
  .populate("service")
  .populate("provider");

if (!serviceRequest) {
  return res.status(404).json({ message: "Service request not found" });
}

if (!serviceRequest.service) {
  return res.status(400).json({ 
    message: "Service not found for this request" 
  });
}

if (serviceRequest.status !== "accepted") {
  return res.status(400).json({ 
    message: "Service request not accepted yet" 
  });
}

const amount = serviceRequest.service.basePrice;



    // create a pending payment and return a mock payment session/url
    const sessionId = crypto.randomBytes(12).toString("hex");

    const payment = await Payment.create({
      serviceRequest: serviceRequest._id,
      client: req.user._id,
      provider: serviceRequest.provider,
      amount,
      paymentMethod,
      paymentStatus: "pending",
      sessionId
    });

    // In a real integration you'd redirect the client to a payment provider.
    const paymentUrl = `https://mock-payment.local/pay/${sessionId}`;

    res.status(201).json({
      message: "Payment initiated",
      payment,
      paymentUrl
    });
  } catch (error) {
  console.error("PAYMENT ERROR:", error);
  res.status(500).json({ message: error.message });
}

};

/**
 * @desc Confirm payment (mock)
 * @route POST /api/payment/confirm
 * @access Client
 */

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 1️⃣ Update payment status correctly
    payment.paymentStatus = "completed";

    // 2️⃣ Update service request status
    const serviceRequest = await ServiceRequest.findById(
      payment.serviceRequest
    );

    if (!serviceRequest) {
      return res.status(404).json({ message: "Service request not found" });
    }

    serviceRequest.status = "completed";
    await serviceRequest.save();

    // 3️⃣ Generate invoice
    const invoicePath = await generateInvoice(payment);
    payment.invoicePath = invoicePath;

    await payment.save();

    res.json({
      message: "Payment confirmed",
      payment,
      invoicePath
    });

  } catch (error) {
    console.error("🔥 Confirm Payment Error:", error);

    res.status(500).json({
      message: error.message,
    });
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
