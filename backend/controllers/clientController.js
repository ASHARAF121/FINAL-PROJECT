const Service = require("../models/Service");
const ServiceRequest = require("../models/ServiceRequest");
const Review = require("../models/Review");

/**
 * @desc   Get all available services
 * @route  GET /api/client/services
 * @access Client
 */
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

/**
 * @desc   Create a service request
 * @route  POST /api/client/request
 * @access Client
 */
exports.createServiceRequest = async (req, res) => {
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
 * @desc   View client service requests
 * @route  GET /api/client/requests
 * @access Client
 */
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ client: req.user._id })
      .populate("service", "title category basePrice")
      .populate("provider", "name phone");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

/**
 * @desc   Submit review after completion
 * @route  POST /api/client/review
 * @access Client
 */
exports.addReview = async (req, res) => {
  try {
    const { serviceRequestId, rating, comment } = req.body;

    const request = await ServiceRequest.findById(serviceRequestId);
    if (!request || request.status !== "completed") {
      return res.status(400).json({ message: "Service not completed" });
    }

    const review = await Review.create({
      serviceRequest: serviceRequestId,
      client: req.user._id,
      provider: request.provider,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};
