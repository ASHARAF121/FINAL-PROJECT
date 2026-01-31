const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");
const Payment = require("../models/Payment");

/**
 * @desc   Get all service providers (pending & verified)
 * @route  GET /api/admin/providers
 * @access Admin
 */
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" }).select("-password");
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch providers" });
  }
};

/**
 * @desc   Verify / approve a service provider
 * @route  PUT /api/admin/verify-provider/:id
 * @access Admin
 */
exports.verifyProvider = async (req, res) => {
  try {
    const provider = await User.findById(req.params.id);

    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isVerified = true;
    await provider.save();

    res.json({ message: "Provider verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * @desc   Get all users (clients + providers)
 * @route  GET /api/admin/users
 * @access Admin
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * @desc   Get all service requests
 * @route  GET /api/admin/service-requests
 * @access Admin
 */
exports.getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find()
      .populate("client", "name email")
      .populate("provider", "name email")
      .populate("service", "title category");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service requests" });
  }
};

/**
 * @desc   Get platform earnings & payment history
 * @route  GET /api/admin/payments
 * @access Admin
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("client", "name email")
      .populate("provider", "name email");

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};

/**
 * @desc   Admin dashboard statistics
 * @route  GET /api/admin/stats
 * @access Admin
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await User.countDocuments({ role: "provider" });
    const verifiedProviders = await User.countDocuments({
      role: "provider",
      isVerified: true
    });
    const totalRequests = await ServiceRequest.countDocuments();
    const completedRequests = await ServiceRequest.countDocuments({
      status: "completed"
    });

    res.json({
      totalUsers,
      totalProviders,
      verifiedProviders,
      totalRequests,
      completedRequests
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
