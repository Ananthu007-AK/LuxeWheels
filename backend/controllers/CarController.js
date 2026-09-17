const Car = require('../models/Car');
const fs = require('fs');
const path = require('path');

exports.addCar = async (req, res) => {
  try {
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const carData = {
      ...req.body,
      images: imagePaths,
      year: Number(req.body.year),
      price: Number(req.body.price),
      rent: Number(req.body.rent || req.body.price * 0.005) || 25000,
      kmDriven: Number(req.body.kmDriven),
      owners: Number(req.body.owners),
    };

    const newCar = new Car(carData);
    await newCar.save();

    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    console.error('Error adding car:', error.message);
    res.status(500).json({ message: 'Error adding car', error: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
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

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const updateData = {
      ...req.body,
      year: Number(req.body.year),
      price: Number(req.body.price),
      rent: Number(req.body.rent || car.rent),
      kmDriven: Number(req.body.kmDriven),
      owners: Number(req.body.owners),
    };

    if (req.files && req.files.length > 0) {
      if (car.images && car.images.length > 0) {
        car.images.forEach(img => {
          const imagePath = path.join(__dirname, '..', img.replace(/^\//, ''));
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }
      const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = imagePaths;
    } else {
      updateData.images = car.images;
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    console.error('Error updating car:', error.message);
    res.status(500).json({ message: 'Error updating car', error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    if (car.images && car.images.length > 0) {
      car.images.forEach(img => {
        const imagePath = path.join(__dirname, '..', img.replace(/^\//, ''));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error.message);
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
};
