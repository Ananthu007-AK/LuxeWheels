const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  rent: { type: Number, required: true },
  status: { type: String, enum: ['available', 'rented', 'sold', 'pending'], default: 'available' },
  images: { type: [String], default: [] }, // Array of image paths
  transmission: { type: String, enum: ['automatic', 'manual'], default: 'automatic' },
  kmDriven: { type: Number, required: true },
  colour: { type: String, required: true },
  owners: { type: Number, required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'], default: 'petrol' },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;