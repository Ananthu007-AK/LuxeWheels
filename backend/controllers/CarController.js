const Car = require('../model/Car');
const fs = require('fs');
const path = require('path');

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
      owners: Number(req.body.owners),
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

exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Prepare updated car data
    const updateData = {
      ...req.body,
      year: Number(req.body.year),
      price: Number(req.body.price),
      kmDriven: Number(req.body.kmDriven),
      owners: Number(req.body.owners),
    };

    // Handle image updates
    if (req.files && req.files.length > 0) {
      // Delete old images from the server
      if (car.images && car.images.length > 0) {
        car.images.forEach(img => {
          const imagePath = path.join(__dirname, '..', 'public', img);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        });
      }

      // Add new images
      const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
      updateData.images = imagePaths;
    } else {
      // Keep existing images if no new ones are uploaded
      updateData.images = car.images;
    }

    const updatedCar = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true });
    console.log('Car updated:', updatedCar);

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

    // Delete associated images from the server
    if (car.images && car.images.length > 0) {
      car.images.forEach(img => {
        const imagePath = path.join(__dirname, '..', 'public', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await Car.findByIdAndDelete(req.params.id);
    console.log('Car deleted:', req.params.id);

    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error.message);
    res.status(500).json({ message: 'Error deleting car', error: error.message });
  }
};