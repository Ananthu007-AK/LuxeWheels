const Rental = require('../model/Rental');
const Car = require('../model/Car');

exports.createRental = async (req, res) => {
  try {
    const { carId, name, phone, email, pickupDate, returnDate, specialRequests } = req.body;

    // Validate car exists and is available
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.status !== 'available') return res.status(400).json({ message: 'Car is not available' });

    // Create rental
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

    // Update car status
    car.status = 'rented';
    await car.save();

    res.status(201).json({ message: 'Rental created successfully', rental });
  } catch (error) {
    res.status(500).json({ message: 'Error creating rental', error });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate('carId', 'make model');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error });
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
    car.status = 'available';
    await car.save();

    res.json({ message: 'Rental completed successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error completing rental', error });
  }
};