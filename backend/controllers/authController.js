const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// Nodemailer Configuration (use your SMTP details)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Forgot Password Controller
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Email:", email);
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User with this email does not exist" });
        }
        console.log("User:", user);
        
        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Save token and expiry time in DB
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `http://localhost:5000/reset-password/${resetToken}`;

        // Send email
        await transporter.sendMail({
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
        });

        return res.status(200).json({ msg: "Password reset link sent to your email" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Reset Password Controller
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        console.log("Incoming token:", token);

        // Hash the token (same method used in forgotPassword)
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        console.log("Hashed token:", hashedToken);

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check token expiry
        });

        console.log("Found user:", user);

        if (!user) {
            return res.status(400).json({ msg: "Invalid or expired token" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Remove reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ msg: "Password has been reset successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

module.exports = { forgotPassword, resetPassword };
