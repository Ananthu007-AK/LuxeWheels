const Rental = require('../model/Rental');
const Car = require('../model/Car');
const mongoose = require('mongoose');

exports.createRental = async (req, res) => {
  try {
    const { carId, name, phone, email, pickupDate, returnDate, specialRequests } = req.body;
    console.log('Received rental request:', req.body);

    if (!carId || !name || !phone || !email || !pickupDate || !returnDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ message: 'Invalid carId format' });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.status !== 'available') return res.status(400).json({ message: 'Car is not available' });

    const rental = new Rental({
      carId,
      name,
      phone,
      email,
      pickupDate,
      returnDate,
      specialRequests,
    });
    await rental.save();

    car.status = 'rented';
    await car.save();

    res.status(201).json({ message: 'Rental created successfully', rental });
  } catch (error) {
    console.error('Detailed error creating rental:', error); // Enhanced logging
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid carId format' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.', error: error.message }); // Include error message
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate('carId', 'make model');
    res.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

exports.completeRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    rental.status = 'completed';
    await rental.save();

    // Update car status back to available
    const car = await Car.findById(rental.carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    car.status = 'available';
    await car.save();

    res.json({ message: 'Rental completed successfully', success: true });
  } catch (error) {
    console.error('Error completing rental:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};