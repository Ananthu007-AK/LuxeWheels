const User=require("../model/user")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const{loginvalidation,registervalidation}=require("../middlewares/validation")


const registerController = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ msg: "Please fill all the fields" });
    }

    const userdata = await User.findOne({ email });
    if (userdata) {
        return res.status(400).json({ msg: "Email already exists" });
    }

    const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "Email is not valid" });
    }
    if (password.length < 6) {
        return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Assign role, default to 'user' if none provided
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || "user" 
    });

    res.status(201).json({ msg: "User registered successfully" });
};

const loginController = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ msg: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(400).json({ msg: "Password incorrect" });
    }

    // Include role in JWT payload
    const token = jwt.sign(
        { userId: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
    );

    res.status(200).json({ msg: "Login Success", token, role: user.role });
};



const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password'); // Don't send password
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const adminDashboard = async (req, res) => {
    res.json({ message: "Welcome, Admin!" });
};

module.exports={registerController,loginController ,registervalidation,loginvalidation,getProfile,adminDashboard} 
