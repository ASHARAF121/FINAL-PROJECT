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

router.post(
  "/confirm",
  protect,
  authorizeRoles("client"),
  paymentController.confirmPayment
);

// Provider
router.get(
  "/provider",
  protect,
  authorizeRoles("provider"),
  paymentController.getProviderPayments
);

module.exports = router;
