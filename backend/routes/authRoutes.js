const express = require("express");
const { forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/forgot-password", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

module.exports = router;
