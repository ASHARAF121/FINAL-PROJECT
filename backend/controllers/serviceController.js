const Service = require("../models/Service");

/**
 * @desc   Create a new service
 * @route  POST /api/service
 * @access Admin
 */
exports.createService = async (req, res) => {
  try {
    const { title, category, description, basePrice } = req.body;

    const service = await Service.create({
      title,
      category,
      description,
      basePrice
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to create service" });
  }
};

/**
 * @desc   Get all services
 * @route  GET /api/service
 * @access Public
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

/**
 * @desc   Get service by ID
 * @route  GET /api/service/:id
 * @access Public
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

/**
 * @desc   Update service
 * @route  PUT /api/service/:id
 * @access Admin
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const { title, category, description, basePrice } = req.body;

    service.title = title || service.title;
    service.category = category || service.category;
    service.description = description || service.description;
    service.basePrice = basePrice || service.basePrice;

    await service.save();
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service" });
  }
};

/**
 * @desc   Delete service
 * @route  DELETE /api/service/:id
 * @access Admin
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
};
