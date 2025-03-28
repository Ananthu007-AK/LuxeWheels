const Rental = require('../model/Rental');
const Car = require('../model/Car');

// Create a rental request (pending status)
exports.createRental = async (req, res) => {
  try {
    const { carId, name, phone, email, pickupDate, returnDate, specialRequests } = req.body;

    // Validate car exists and is available
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.status !== 'available') return res.status(400).json({ message: 'Car is not available' });

    // Create rental with pending status
    const rental = new Rental({
      carId,
      name,
      phone,
      email,
      pickupDate,
      returnDate,
      specialRequests,
      status: 'pending', // Set initial status as pending
    });
    await rental.save();

    // Do NOT update car status here; wait for admin approval
    res.status(201).json({ message: 'Rental request submitted successfully, awaiting approval', rental });
  } catch (error) {
    res.status(500).json({ message: 'Error creating rental', error });
  }
};

// Get all rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate('carId', 'make model');
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rentals', error });
  }
};

// Approve a rental
exports.approveRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.status !== 'pending') return res.status(400).json({ message: 'Rental is not pending approval' });

    // Update rental status to approved
    rental.status = 'approved';
    await rental.save();

    // Update car status to rented
    const car = await Car.findById(rental.carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    car.status = 'rented';
    await car.save();

    res.json({ message: 'Rental approved successfully', rental });
  } catch (error) {
    res.status(500).json({ message: 'Error approving rental', error });
  }
};

// Complete a rental
exports.completeRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.status !== 'approved') return res.status(400).json({ message: 'Rental is not approved or already completed' });

    // Update rental status to completed
    rental.status = 'completed';
    await rental.save();

    // Update car status back to available
    const car = await Car.findById(rental.carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    car.status = 'available';
    await car.save();

    res.json({ message: 'Rental completed successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error completing rental', error });
  }
};