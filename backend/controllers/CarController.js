// controllers/carController.js
const Car = require('../model/Car');

exports.addCar = async (req, res) => {
  try {
    console.log('Request files:', req.files);
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    console.log('Image paths:', imagePaths);

    const carData = {
      ...req.body,
      images: imagePaths,
      year: Number(req.body.year),
      price: Number(req.body.price),
      kmDriven: Number(req.body.kmDriven),
      owners: Number(req.body.owners)
    };

    const newCar = new Car(carData);
    await newCar.save();
    console.log('Car saved:', newCar);

    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error.message);
    res.status(500).json({ message: 'Error adding car', error: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error: error.message });
  }
};

exports.getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error('Error fetching car by ID:', error.message);
    res.status(500).json({ message: 'Error fetching car', error: error.message });
  }
};