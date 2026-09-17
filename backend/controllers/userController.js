const User = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    return res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    console.error('Registration error:', error);
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

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || "luxewheels_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      msg: "Login successful",
      username: user.username,
      email: user.email,
      token,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.json({
      name: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      profilePhoto: user.images || '',
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    if (!name || !email) {
      return res.status(400).json({ msg: "Name and email are required" });
    }
    const updateData = { username: name, email, phone, address };
    if (req.file) {
      updateData.images = `/uploads/${req.file.filename}`;
    }
    const userId = req.user?._id || req.user?.userId;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
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
        address: updatedUser.address || '',
        profilePhoto: updatedUser.images || '',
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Update Profile Photo
const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }
    const userId = req.user?._id || req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const photoPath = `/uploads/${req.file.filename}`;
    user.images = photoPath;
    await user.save();
    res.status(200).json({
      msg: "Profile photo updated successfully",
      profilePhoto: photoPath,
    });
  } catch (error) {
    console.error("Error updating profile photo:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin Dashboard
const adminDashboard = async (req, res) => {
  return res.json({ message: "Welcome, Admin!" });
};

// Get User by Username/Email
const userHome = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ email: username }).select('-password');
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json({
      name: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get All Non-Admin Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.username,
      email: user.email,
      registered: user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'N/A',
      phone: user.phone || 'N/A',
      address: user.address || 'N/A',
      status: 'active'
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
  getProfile,
  updateProfile,
  adminDashboard,
  userHome,
  getAllUsers,
  updateProfilePhoto,
};
