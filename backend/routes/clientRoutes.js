const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const clientController = require("../controllers/clientController");

const router = express.Router();

router.use(protect, authorizeRoles("client"));

router.get("/services", clientController.getServices);
router.post("/request", clientController.createServiceRequest);
router.get("/providers", clientController.getProviders);
router.get("/requests", clientController.getMyRequests);
router.post("/review", clientController.addReview);

module.exports = router;
