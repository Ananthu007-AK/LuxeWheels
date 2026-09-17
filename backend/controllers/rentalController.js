const Rental = require('../models/Rental');
const Car = require('../models/Car');
const { sendEmail } = require('../utils/email');

exports.createRental = async (req, res) => {
  try {
    const { carId, name, phone, email, pickupDate, returnDate, specialRequests } = req.body;

    if (!carId || !name || !phone || !email || !pickupDate || !returnDate) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    if (car.status !== 'available') return res.status(400).json({ message: 'Car is not available for rent' });

    const rental = new Rental({
      carId,
      userId: req.user?._id || req.user?.userId,
      name,
      phone,
      email,
      pickupDate,
      returnDate,
      specialRequests,
      status: 'pending',
    });
    await rental.save();

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const subject = `New Rental Request for ${car.make} ${car.model}`;
      const text = `
        New Rental Request Received:
        Name: ${name}
        Car: ${car.make} ${car.model} (ID: ${carId})
        Phone: ${phone}
        Email: ${email}
        Pick-up Date: ${pickupDate}
        Return Date: ${returnDate}
        Special Requests: ${specialRequests || 'None'}
        Status: ${rental.status}
      `;
      const html = `
        <h2>New Rental Request Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Car:</strong> ${car.make} ${car.model} (ID: ${carId})</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pick-up Date:</strong> ${pickupDate}</p>
        <p><strong>Return Date:</strong> ${returnDate}</p>
        <p><strong>Special Requests:</strong> ${specialRequests || 'None'}</p>
        <p><strong>Status:</strong> ${rental.status}</p>
      `;

      try {
        await sendEmail({
          to: adminEmail,
          subject,
          text,
          html,
        });
      } catch (err) {
        console.warn('Could not send notification email:', err.message);
      }
    }

    res.status(201).json({ message: 'Rental request submitted successfully', rental });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ message: 'Server error while creating rental', error: error.message });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('carId', 'make model images price rent')
      .sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ message: 'Server error while fetching rentals' });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.userId;
    const rentals = await Rental.find({ userId })
      .populate('carId', 'make model images price rent')
      .sort({ createdAt: -1 });

    const formattedRentals = rentals.map((rental) => ({
      _id: rental._id,
      carId: rental.carId ? {
        _id: rental.carId._id,
        title: `${rental.carId.make} ${rental.carId.model}`,
      } : { _id: null, title: 'Unknown Car' },
      pickupDate: rental.pickupDate,
      returnDate: rental.returnDate,
      status: rental.status,
      specialRequests: rental.specialRequests,
    }));

    res.status(200).json(formattedRentals);
  } catch (error) {
    console.error('Error fetching user rentals:', error);
    res.status(500).json({ message: 'Server error while fetching your rentals' });
  }
};

exports.approveRental = async (req, res) => {
  try {
    const rentalId = req.params.id;

    const rental = await Rental.findByIdAndUpdate(
      rentalId,
      { status: 'confirmed' },
      { new: true }
    ).populate('carId', 'make model');

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (rental.carId) {
      await Car.findByIdAndUpdate(rental.carId._id, { status: 'rented' });
    }

    res.status(200).json({ success: true, rental });
  } catch (error) {
    console.error('Error approving rental:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.completeRental = async (req, res) => {
  try {
    const rentalId = req.params.id;

    const rental = await Rental.findByIdAndUpdate(
      rentalId,
      { status: 'completed' },
      { new: true }
    );

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (rental.carId) {
      await Car.findByIdAndUpdate(rental.carId, { status: 'available' });
    }

    res.status(200).json({ success: true, rental });
  } catch (error) {
    console.error('Error completing rental:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.rejectRental = async (req, res) => {
  try {
    const rentalId = req.params.id;

    const rental = await Rental.findByIdAndUpdate(
      rentalId,
      { status: 'rejected' },
      { new: true }
    );

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    if (rental.carId) {
      await Car.findByIdAndUpdate(rental.carId, { status: 'available' });
    }

    res.status(200).json({ success: true, rental });
  } catch (error) {
    console.error('Error rejecting rental:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};