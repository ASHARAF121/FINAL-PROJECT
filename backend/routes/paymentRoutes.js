const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

// Client
router.post(
  "/create",
  protect,
  authorizeRoles("client"),
  paymentController.createPayment
);

router.get(
  "/client",
  protect,
  authorizeRoles("client"),
  paymentController.getClientPayments
);

// Provider
router.get(
  "/provider",
  protect,
  authorizeRoles("provider"),
  paymentController.getProviderPayments
);

module.exports = router;
