const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/providers", adminController.getAllProviders);
router.put("/verify-provider/:id", adminController.verifyProvider);
router.get("/users", adminController.getAllUsers);
router.get("/service-requests", adminController.getAllServiceRequests);
router.get("/payments", adminController.getAllPayments);
router.get("/stats", adminController.getDashboardStats);

module.exports = router;
