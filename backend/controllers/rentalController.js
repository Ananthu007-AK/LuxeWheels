// controllers/rentalController.js
const Rental = require('../model/Rental');
const Car = require('../model/Car');
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
      userId: req.user._id,
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

    await sendEmail({
      to: adminEmail,
      subject,
      text,
      html,
    });

    res.status(201).json({ message: 'Rental request submitted successfully', rental });
  } catch (error) {
    console.error('Error creating rental:', error);
    res.status(500).json({ message: 'Server error while creating rental' });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('carId', 'make model')
      .sort({ createdAt: -1 });
    res.status(200).json(rentals);
  } catch (error) {
    console.error('Error fetching all rentals:', error);
    res.status(500).json({ message: 'Server error while fetching rentals' });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ userId: req.user._id })
      .populate('carId', 'make model')
      .sort({ createdAt: -1 });

    const formattedRentals = rentals.map((rental) => ({
      _id: rental._id,
      carId: {
        _id: rental.carId._id,
        title: `${rental.carId.make} ${rental.carId.model}`,
      },
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

    // Find and update the rental
    const rental = await Rental.findByIdAndUpdate(
      rentalId,
      { status: 'approved' },
      { new: true }
    ).populate('carId', 'make model'); // Populate car details for email

    if (!rental) {
      return res.status(404).json({ success: false, message: 'Rental not found' });
    }

    // Update car status to rented
    await Car.findByIdAndUpdate(rental.carId._id, { status: 'rented' });

    // Send email to user
    const userEmail = rental.email; // User's email from rental record
    const subject = `Your Rental Request for ${rental.carId.make} ${rental.carId.model} Has Been Approved`;
    const text = `
      Dear ${rental.name},

      We are pleased to inform you that your rental request has been approved!

      Rental Details:
      Car: ${rental.carId.make} ${rental.carId.model}
      Pick-up Date: ${rental.pickupDate}
      Return Date: ${rental.returnDate}
      Special Requests: ${rental.specialRequests || 'None'}

      Please contact us at ${process.env.ADMIN_EMAIL} if you have any questions or need to make changes.

      Enjoy your ride!
      The Luxewheels Team
    `;
    const html = `
      <h2>Rental Request Approved</h2>
      <p>Dear ${rental.name},</p>
      <p>We are pleased to inform you that your rental request has been approved!</p>
      <h3>Rental Details:</h3>
      <p><strong>Car:</strong> ${rental.carId.make} ${rental.carId.model}</p>
      <p><strong>Pick-up Date:</strong> ${rental.pickupDate}</p>
      <p><strong>Return Date:</strong> ${rental.returnDate}</p>
      <p><strong>Special Requests:</strong> ${rental.specialRequests || 'None'}</p>
      <p>Please contact us at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a> if you have any questions or need to make changes.</p>
      <p>Enjoy your ride!<br>The Luxewheels Team</p>
    `;

    await sendEmail({
      to: userEmail,
      subject,
      text,
      html,
    });

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