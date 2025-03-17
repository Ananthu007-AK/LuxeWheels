import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Buy.css";
import axios from 'axios';
import defaultCarImage from "./car.png";

function Buy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([
        { _id: "1", make: "VOLVO", model: "XC 90", price: "6200000", year: "2023", kmDriven: "0", transmission: "Automatic", images: [defaultCarImage] },
        { _id: "2", make: "FORD", model: "MUSTANG GT", price: "8500000", year: "2023", kmDriven: "0", transmission: "Manual", images: [defaultCarImage] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = (car) => {
    setSelectedCar(car);
    setShowEnquiryForm(true);
    setEnquiryData({
      ...enquiryData,
      message: `I am interested in buying the ${car.make} ${car.model} priced at ₹${Number(car.price).toLocaleString()}.`
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData({
      ...enquiryData,
      [name]: value
    });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(enquiryData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      setIsSubmitting(false);
      return;
    }

    const enquiryPayload = {
      user: enquiryData.name,
      car: `${selectedCar.make} ${selectedCar.model}`,
      message: enquiryData.message,
      email: enquiryData.email,
      phone: enquiryData.phone,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post('http://localhost:5000/enquiries', enquiryPayload);
      alert(response.data.message || "Your enquiry has been submitted successfully! Our team will contact you soon.");
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("There was an error submitting your enquiry. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }

    setShowEnquiryForm(false);
    setEnquiryData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const filteredCars = cars.filter((car) =>
    `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  return (
    <>
      <title>Luxewheels - Buy Luxury Cars</title>
      <Navbar />

      <div className="buy-page-container">
        <section className="buy-page-hero">
          <h1 className="buy-page-title">Exclusive Collection</h1>
          <p className="buy-page-subtitle">Find your dream luxury vehicle</p>
          <div className="buy-page-search-container">
            <input
              type="text"
              className="buy-page-search"
              placeholder="Search for your dream car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="buy-page-collection">
          <h2 className="buy-page-section-title">Available Luxury Cars</h2>
          {isLoading ? (
            <div className="buy-page-loading">Loading luxury cars...</div>
          ) : (
            <div className="buy-page-cars-grid">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <div key={car._id} className="buy-page-car-card">
                    <div className="buy-page-car-image-container">
                      <img 
                        src={car.images && car.images.length > 0 ? car.images[0] : defaultCarImage} 
                        alt={`${car.make} ${car.model}`} 
                        className="buy-page-car-image" 
                      />
                    </div>
                    <div className="buy-page-car-details">
                      <h3 className="buy-page-car-title">{car.make} {car.model}</h3>
                      <p className="buy-page-car-price">{formatPrice(car.price)}</p>
                      <div className="buy-page-car-specs">
                        <p><span>Year:</span> {car.year}</p>
                        <p><span>Mileage:</span> {car.kmDriven} km</p>
                        <p><span>Engine:</span> {car.fuelType || "Petrol"}</p>
                        <p><span>Transmission:</span> {car.transmission}</p>
                        {car.colour && <p><span>Color:</span> {car.colour}</p>}
                      </div>
                      <button 
                        className="buy-page-buy-button"
                        onClick={() => handleBuyClick(car)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="buy-page-no-results">No cars match your search criteria.</p>
              )}
            </div>
          )}
        </section>
      </div>

      {showEnquiryForm && (
        <div className="buy-page-enquiry-overlay">
          <div className="buy-page-enquiry-form-container">
            <button 
              className="buy-page-close-button"
              onClick={() => setShowEnquiryForm(false)}
            >
              ×
            </button>
            <h2 className="buy-page-enquiry-title">
              Enquire About {selectedCar?.make} {selectedCar?.model}
            </h2>
            <form className="buy-page-enquiry-form" onSubmit={handleEnquirySubmit}>
              <div className="buy-page-form-group">
                <label htmlFor="name" className="buy-page-form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="buy-page-form-input"
                  placeholder="Your full name"
                  value={enquiryData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="buy-page-form-group">
                <label htmlFor="email" className="buy-page-form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="buy-page-form-input"
                  placeholder="Your email address"
                  value={enquiryData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="buy-page-form-group">
                <label htmlFor="phone" className="buy-page-form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="buy-page-form-input"
                  placeholder="Your phone number"
                  value={enquiryData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="buy-page-form-group">
                <label htmlFor="message" className="buy-page-form-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="buy-page-form-textarea"
                  placeholder="Additional details or questions"
                  value={enquiryData.message}
                  onChange={handleInputChange}
                  rows="4"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="buy-page-submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="buy-page-footer">
        <p>© 2025 Luxewheels - Where Elegance Meets The Road</p>
      </footer>
    </>
  );
}

export default Buy;