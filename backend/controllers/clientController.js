const Service = require("../models/Service");
const ServiceRequest = require("../models/ServiceRequest");
const Review = require("../models/Review");
const User = require("../models/User");

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
    const { serviceType, service, providerId, location, date, time, notes } = req.body;

    if (!serviceType || !location || !date || !time) {
      return res.status(400).json({
        message: "Missing required fields: serviceType, location, date, time"
      });
    }

    const newReq = {
      client: req.user._id,
      serviceType,
      location,
      date,
      time,
      notes
    };

    if (service) newReq.service = service;

    if (providerId) {
      // validate provider exists and is a provider
      const provider = await User.findById(providerId);
      if (!provider || provider.role !== "provider") {
        return res.status(400).json({ message: "Invalid provider selected" });
      }
      newReq.provider = providerId;
      // if assigning provider directly, set status to accepted
      newReq.status = "accepted";
    }

    const request = await ServiceRequest.create(newReq);

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service request", error: error.message });
  }
};

/**
 * @desc Get providers for clients (optionally filter by serviceType)
 * @route GET /api/client/providers
 * @access Client
 */
exports.getProviders = async (req, res) => {
  try {
    const { serviceType } = req.query;
    const filter = { role: "provider", isVerified: true };
    if (serviceType) filter.serviceType = serviceType;

    const providers = await User.find(filter).select("_id name email serviceType serviceArea");
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch providers" });
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
      .populate("serviceType", "title description price")
      .populate("provider", "name phone email rating")
      .select("_id serviceType location date time status notes provider createdAt");

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
