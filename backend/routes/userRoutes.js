const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { loginvalidation, registervalidation } = require('../middlewares/validation');
const verifyToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');

function verifyRole(requiredRole) {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole && req.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: Access Denied' });
    }
    next();
  };
}

// Auth
router.post('/register', registervalidation, userController.registerController);
router.post('/login', loginvalidation, userController.loginController);

// User Profile
router.get('/profile', verifyToken, userController.getProfile);
router.put('/update', verifyToken, upload.single('profilePhoto'), userController.updateProfile);
router.post('/profile-photo', verifyToken, upload.single('profilePhoto'), userController.updateProfilePhoto);
router.get('/user/:username', userController.userHome);

// Admin
router.get('/admin', verifyToken, verifyRole('admin'), userController.adminDashboard);
router.get('/all', verifyToken, verifyRole('admin'), userController.getAllUsers);

module.exports = router;
