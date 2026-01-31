const ServiceRequest = require("../models/ServiceRequest");
const Payment = require("../models/Payment");

/**
 * @desc   View available service requests
 * @route  GET /api/provider/requests
 * @access Provider
 */
exports.getAvailableRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      status: "pending",
      provider: null
    }).populate("service", "title category");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/**
 * @desc   Accept a service request
 * @route  PUT /api/provider/accept/:id
 * @access Provider
 */
exports.acceptRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Request not available" });
    }

    request.provider = req.user._id;
    request.status = "accepted";
    await request.save();

    res.json({ message: "Request accepted", request });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept request" });
  }
};

/**
 * @desc   Complete a service request
 * @route  PUT /api/provider/complete/:id
 * @access Provider
 */
exports.completeRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request || request.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    request.status = "completed";
    await request.save();

    res.json({ message: "Service marked as completed" });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete service" });
  }
};

/**
 * @desc   Provider earnings & history
 * @route  GET /api/provider/earnings
 * @access Provider
 */
exports.getEarnings = async (req, res) => {
  try {
    const payments = await Payment.find({
      provider: req.user._id,
      paymentStatus: "success"
    });

    const totalEarnings = payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    res.json({ totalEarnings, payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch earnings" });
  }
};
