const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

router.post('/', rentalController.createRental);
router.get('/', rentalController.getAllRentals);
router.patch('/:id/complete', rentalController.completeRental);

module.exports = router;