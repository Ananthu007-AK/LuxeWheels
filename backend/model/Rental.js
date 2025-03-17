const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  specialRequests: { type: String },
  status: { type: String, default: 'pending' }, // e.g., pending, active, completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rental', rentalSchema);