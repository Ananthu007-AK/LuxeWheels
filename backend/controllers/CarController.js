const Car = require('../model/Car'); // Assuming you have a Car model

exports.addCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    res.status(500).json({ message: 'Error adding car', error });
  }
};

exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find(); // Fetch all cars from the database
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cars', error });
  }
};