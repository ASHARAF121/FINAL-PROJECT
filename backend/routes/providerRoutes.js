const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const providerController = require("../controllers/providerController");

const router = express.Router();

router.use(protect, authorizeRoles("provider"));

router.get("/requests", providerController.getAvailableRequests);
router.put("/accept/:id", providerController.acceptRequest);
router.put("/complete/:id", providerController.completeRequest);
router.get("/earnings", providerController.getEarnings);

module.exports = router;
