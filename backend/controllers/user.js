const User = require("../model/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginvalidation, registervalidation } = require("../middlewares/validation");

// User Registration
const registerController = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "Please fill all fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user" // Default role: user
        });

        return res.status(201).json({ msg: "User registered successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// User Login
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ msg: "Incorrect password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Set a longer expiration time
        );

        return res.status(200).json({ msg: "Login successful", token, role: user.role });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Exclude password field
        if (!user) return res.status(404).json({ msg: "User not found" });

        return res.json({ user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Admin Dashboard
const adminDashboard = async (req, res) => {
    return res.json({ message: "Welcome, Admin!" });
};

module.exports = {
    registerController,
    loginController,
    registervalidation,
    loginvalidation,
    getProfile,
    adminDashboard
};
