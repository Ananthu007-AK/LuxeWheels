const Listing = require('../models/Listing');
const Car = require('../models/Car');

const listingController = {
  createListing: async (req, res) => {
    try {
      const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
      const listingData = { ...req.body, images: imagePaths };
      const listing = new Listing(listingData);
      await listing.save();
      res.status(201).json({ success: true, listing });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getPendingListings: async (req, res) => {
    try {
      const listings = await Listing.find({ status: 'pending' }).sort({ createdAt: -1 });
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveListing: async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }

      const carData = {
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        rent: Math.round(listing.price * 0.005) || 25000,
        status: 'available',
        images: listing.images,
        transmission: listing.transmission || 'automatic',
        kmDriven: listing.mileage || 0,
        colour: listing.color || 'Black',
        owners: 1,
        fuelType: 'petrol'
      };

      const car = new Car(carData);
      await car.save();

      listing.status = 'approved';
      await listing.save();

      res.json({ success: true, listing, car });
    } catch (error) {
      console.error('Error in approveListing:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  rejectListing: async (req, res) => {
    try {
      const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { new: true }
      );
      if (!listing) {
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }
      res.json({ success: true, listing });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  getCars: async (req, res) => {
    try {
      const cars = await Car.find().sort({ createdAt: -1 });
      res.json(cars);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = listingController;