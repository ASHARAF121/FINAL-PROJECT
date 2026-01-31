const ServiceRequest = require("../models/ServiceRequest");

/**
 * @desc   Create service request
 * @route  POST /api/service-request
 * @access Client
 */
exports.createRequest = async (req, res) => {
  try {
    const { serviceId, scheduledDate, location } = req.body;

    const request = await ServiceRequest.create({
      client: req.user._id,
      service: serviceId,
      scheduledDate,
      location
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service request" });
  }
};

/**
 * @desc   Get logged-in user's service requests
 * @route  GET /api/service-request/my
 * @access Client / Provider
 */
exports.getMyRequests = async (req, res) => {
  try {
    const filter =
      req.user.role === "client"
        ? { client: req.user._id }
        : { provider: req.user._id };

    const requests = await ServiceRequest.find(filter)
      .populate("client", "name phone")
      .populate("provider", "name phone")
      .populate("service", "title category basePrice");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/**
 * @desc   Get available service requests (unassigned)
 * @route  GET /api/service-request/available
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
    res.status(500).json({ message: "Failed to fetch available requests" });
  }
};

/**
 * @desc   Accept service request
 * @route  PUT /api/service-request/accept/:id
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
 * @desc   Reject service request
 * @route  PUT /api/service-request/reject/:id
 * @access Provider
 */
exports.rejectRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request || request.status !== "pending") {
      return res.status(400).json({ message: "Request not available" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject request" });
  }
};

/**
 * @desc   Complete service request
 * @route  PUT /api/service-request/complete/:id
 * @access Provider
 */
exports.completeRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (
      !request ||
      request.provider.toString() !== req.user._id.toString()
    ) {
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
 * @desc   Get all service requests
 * @route  GET /api/service-request/all
 * @access Admin
 */
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("client", "name email")
      .populate("provider", "name email")
      .populate("service", "title category");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all requests" });
  }
};
