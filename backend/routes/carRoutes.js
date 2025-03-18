// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/CarController'); // Corrected case
const upload = require('../middlewares/multerConfig'); // Adjusted path

router.post('/add', upload.array('images', 5), carController.addCar);

router.get('/', carController.getCars); // Route to get all cars

router.get('/:id', carController.getCarById); // Route to get car by ID

module.exports = router;