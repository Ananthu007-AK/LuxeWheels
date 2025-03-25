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

        return res.status(200).json({ msg: "Login successful", username:user.email,token, role: user.role });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Get User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });

        return res.json({
            name: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            address: user.address || ''
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Validate required fields (optional, adjust as needed)
        if (!name || !email) {
            return res.status(400).json({ msg: "Name and email are required" });
        }

        // Update user in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.userId, // From verifyToken middleware
            {
                username: name, // Assuming username is the "name" field
                email,
                phone, // Add if in schema
                address // Add if in schema
            },
            { new: true, runValidators: true } // Return updated doc, validate schema
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json({
            msg: "Profile updated successfully",
            user: {
                name: updatedUser.username,
                email: updatedUser.email,
                phone: updatedUser.phone || '',
                address: updatedUser.address || ''
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error" });
    }
};


// Admin Dashboard
const adminDashboard = async (req, res) => {
    return res.json({ message: "Welcome, Admin!" });
};

const userHome = async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ email: username }); // Assuming username is email
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      res.json({
        name: user.username, // Ensure this matches what frontend expects
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
   
}

const getAllUsers = async (req, res) => {
    try {
        // Fetch all users except those with role 'admin', excluding passwords
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        if (!users || users.length === 0) {
            return res.status(404).json({ msg: "No non-admin users found" });
        }

        // Map the data to match frontend expectations
        const formattedUsers = users.map(user => ({
            id: user._id,
            name: user.username,
            email: user.email,
            registered: user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'N/A',
            phone: user.phone || 'N/A',
            address: user.address || 'N/A',
            status: 'active' // All non-admins are considered 'active'
        }));

        return res.status(200).json(formattedUsers);
    } catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({ msg: "Server error" });
    }
};


module.exports = {
    registerController,
    loginController,
    registervalidation,
    loginvalidation,
    getProfile,
    updateProfile,
    adminDashboard,
    userHome,
    getAllUsers
};
