const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const serviceRequestController = require("../controllers/serviceRequestController");

const router = express.Router();

// Client
router.post(
  "/",
  protect,
  authorizeRoles("client"),
  serviceRequestController.createRequest
);

// Client & Provider
router.get(
  "/my",
  protect,
  authorizeRoles("client", "provider"),
  serviceRequestController.getMyRequests
);

// Provider
router.get(
  "/available",
  protect,
  authorizeRoles("provider"),
  serviceRequestController.getAvailableRequests
);

router.put(
  "/accept/:id",
  protect,
  authorizeRoles("provider"),
  serviceRequestController.acceptRequest
);

router.put(
  "/reject/:id",
  protect,
  authorizeRoles("provider"),
  serviceRequestController.rejectRequest
);

router.put(
  "/complete/:id",
  protect,
  authorizeRoles("provider"),
  serviceRequestController.completeRequest
);

// Admin
router.get(
  "/all",
  protect,
  authorizeRoles("admin"),
  serviceRequestController.getAllRequests
);

module.exports = router;
