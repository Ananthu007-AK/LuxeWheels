const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have this

// Protected routes with authentication middleware
router.post('/', authMiddleware, rentalController.createRental); // Create a rental (user-only)
router.get('/', authMiddleware, rentalController.getAllRentals); // Get all rentals (admin-only, optional)
router.get('/user', authMiddleware, rentalController.getUserRentals); // Get user's rentals (user-only)
router.patch('/:id/complete', authMiddleware, rentalController.completeRental); // Complete a rental (admin or user)
router.patch('/:id/approve', authMiddleware, rentalController.approveRental); // Approve a rental (admin-only)

module.exports = router;