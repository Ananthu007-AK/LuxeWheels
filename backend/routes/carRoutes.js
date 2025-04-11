const express = require('express');
const router = express.Router();
const carController = require('../controllers/CarController');
const upload = require('../middlewares/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware'); // Assuming you have authentication middleware


router.post('/add', authMiddleware, upload.array('images', 5), carController.addCar);

router.get('/', carController.getCars);

router.get('/:id', carController.getCarById);

router.put('/:id', authMiddleware, upload.array('images', 5), carController.updateCar);

router.delete('/:id', authMiddleware, carController.deleteCar);

module.exports = router;