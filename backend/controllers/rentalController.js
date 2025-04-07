const Rental = require("../model/Rental");
const Car = require("../model/Car");

exports.createRental = async (req, res) => {
  try {
    const { carId, name, phone, email, pickupDate, returnDate, specialRequests } = req.body;

    // Validate input
    if (!carId || !name || !phone || !email || !pickupDate || !returnDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate car exists and is available
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });
    if (car.status !== "available") return res.status(400).json({ message: "Car is not available for rent" });

    // Create rental
    const rental = new Rental({
      carId,
      userId: req.user._id, // From auth middleware
      name,
      phone,
      email,
      pickupDate,
      returnDate,
      specialRequests,
      status: "pending", // Initial status aligns with frontend
    });
    await rental.save();

    // Update car status
    car.status = "rented"; // Consistent with backend logic
    await car.save();

    res.status(201).json({ message: "Rental request submitted successfully", rental });
  } catch (error) {
    console.error("Error creating rental:", error);
    res.status(500).json({ message: "Server error while creating rental" });
  }
};

exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("carId", "make model")
      .sort({ createdAt: -1 }); // Newest first
    res.status(200).json(rentals);
  } catch (error) {
    console.error("Error fetching all rentals:", error);
    res.status(500).json({ message: "Server error while fetching rentals" });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ userId: req.user._id })
      .populate("carId", "make model")
      .sort({ createdAt: -1 }); // Newest first

    // Format rentals to match frontend expectations
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
    console.error("Error fetching user rentals:", error);
    res.status(500).json({ message: "Server error while fetching your rentals" });
  }
};

exports.completeRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    // Update rental status (align with frontend expectation)
    rental.status = "approved"; // Changed from "completed" to match frontend
    await rental.save();

    // Update car status back to available
    const car = await Car.findById(rental.carId);
    if (!car) return res.status(404).json({ message: "Associated car not found" });
    car.status = "available";
    await car.save();

    res.status(200).json({ message: "Rental completed successfully", success: true });
  } catch (error) {
    console.error("Error completing rental:", error);
    res.status(500).json({ message: "Server error while completing rental" });
  }
};
