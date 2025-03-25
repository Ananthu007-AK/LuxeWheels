const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { loginvalidation, registervalidation } = require("../middlewares/validation");
const verifyToken = require("../middlewares/authMiddleware");  // ✅ Import authentication middleware
const user = require('../model/user');

// Role-based middleware
function verifyRole(requiredRole) {
    return (req, res, next) => {
        if (req.role !== requiredRole) {
            return res.status(403).json({ error: "Forbidden: Access Denied" });
        }
        next();
    };
}

// Register user
router.post('/register', registervalidation, userController.registerController);

// Login user
router.post('/login', loginvalidation, userController.loginController);

// ✅ Protected Routes Example
router.get('/profile', verifyToken, userController.getProfile); // Normal users can access this
router.get('/admin', verifyToken, verifyRole('admin'), userController.adminDashboard); // Only admins can access

router.get('/user/:username',userController.userHome);

router.put('/update',verifyToken,userController.updateProfile);

router.get('/', verifyToken, verifyRole('admin'), userController.getAllUsers)

module.exports = router;