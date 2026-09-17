const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const upload = require('../middlewares/multerConfig');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', carController.getCars);
router.get('/:id', carController.getCarById);
router.post('/add', verifyToken, upload.array('images', 5), carController.addCar);
router.put('/:id', verifyToken, upload.array('images', 5), carController.updateCar);
router.delete('/:id', verifyToken, carController.deleteCar);

module.exports = router;