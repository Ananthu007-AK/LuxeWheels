const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    user: { type: String, required: true },
    car: { type: String, required: true },
    message: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);