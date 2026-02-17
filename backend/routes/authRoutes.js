const express = require("express");
const { clientRegister,providerRegister, login } = require("../controllers/authController");
const upload = require("../middlewares/upload");

const router = express.Router();

router.post("/clientregister", clientRegister);
router.post("/providerregister", upload.single("idDocument"), providerRegister);
router.post("/login", login);

module.exports = router;
