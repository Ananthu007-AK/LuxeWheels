const express = require('express');
const router = express.Router();
const carController = require('../controllers/CarController');
const upload = require('../middlewares/multerConfig');

router.post('/add',upload ,carController.addCar);

router.get('/', carController.getCars); // Route to get all cars

module.exports = router;