// controllers/listingController.js
const Listing = require('../model/Listing');
const Car = require('../model/Car');

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
      const listings = await Listing.find({ status: 'pending' });
      res.json(listings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  approveListing: async (req, res) => {
    try {
      console.log('Approving listing with ID:', req.params.id);
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        console.log('Listing not found for ID:', req.params.id);
        return res.status(404).json({ success: false, error: 'Listing not found' });
      }

      console.log('Found listing:', listing);

      // Create a new car from the listing
      const carData = {
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        status: 'available',
        images: listing.images,
        transmission: listing.transmission,
        kmDriven: listing.mileage,
        colour: listing.color,
        owners: 1, // Default value
        fuelType: 'petrol' // Default value
      };

      console.log('Creating car with data:', carData);
      const car = new Car(carData);
      await car.save();
      console.log('Car saved:', car);

      // Update listing status
      listing.status = 'approved';
      await listing.save();
      console.log('Listing updated:', listing);

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
      const cars = await Car.find();
      res.json(cars);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

module.exports = listingController;