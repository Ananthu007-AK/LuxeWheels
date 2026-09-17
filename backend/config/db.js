const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/LuxeWheels";

const connect = () => {
  mongoose.connect(uri)
    .then(() => { console.log(`MongoDB Connected: ${uri}`); })
    .catch((err) => { console.error("MongoDB Connection Error:", err); });
};

module.exports = { connect };
