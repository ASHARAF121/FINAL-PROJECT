const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const serviceController = require("../controllers/serviceController");

const router = express.Router();

// Public
router.get("/", serviceController.getAllServices);
router.get("/:id", serviceController.getServiceById);

// Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  serviceController.createService
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  serviceController.updateService
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  serviceController.deleteService
);

module.exports = router;
