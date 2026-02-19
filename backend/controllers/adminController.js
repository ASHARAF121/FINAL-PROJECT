const User = require("../models/User");
const ServiceRequest = require("../models/ServiceRequest");
const Payment = require("../models/Payment");
const bcrypt = require("bcryptjs");

/**
 * GET ALL PROVIDERS
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
 * VERIFY PROVIDER
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
 * GET ALL USERS
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
 * GET ALL SERVICE REQUESTS
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
 * GET ALL PAYMENTS
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
 * DASHBOARD STATS
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

/**
 * CREATE USER
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await ServiceRequest.deleteMany({
      $or: [{ client: user._id }, { provider: user._id }],
    });

    await Payment.deleteMany({
      $or: [{ client: user._id }, { provider: user._id }],
    });

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

