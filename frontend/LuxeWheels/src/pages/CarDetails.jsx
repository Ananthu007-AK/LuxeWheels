import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CarDetails.css";
import car2 from "./car2.png";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buy");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  // New booking form state
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupDate: "",
    returnDate: "",
    specialRequests: ""
  });

  // This would typically come from an API or data store
  // For now, we'll simulate with a hardcoded collection
  const carCollection = [
    { 
      id: "0", 
      title: "VOLVO XC 90", 
      price: "₹62,00,000",
      rentPrice: "₹15,000/day",
      images: [car2, car2, car2],
      description: "Experience Swedish luxury and innovation with the VOLVO XC 90. This premium SUV combines elegant design with advanced safety features and powerful performance.",
      specifications: {
        engine: "2.0L 4-Cylinder Turbo & Supercharged",
        power: "316 HP",
        torque: "400 Nm",
        transmission: "8-Speed Automatic",
        acceleration: "0-100 km/h in 6.5 seconds",
        topSpeed: "230 km/h"
      },
      category: "Luxury SUV"
    },
    { 
      id: "1", 
      title: "MUSTANG GT", 
      price: "₹85,00,000",
      rentPrice: "₹25,000/day",
      images: ["/car3.png", "/car3-interior.png", "/car3-rear.png"],
      description: "The iconic MUSTANG GT represents American muscle at its finest. With its aggressive styling and powerful V8 engine, it delivers an exhilarating driving experience.",
      specifications: {
        engine: "5.0L V8",
        power: "460 HP",
        torque: "570 Nm",
        transmission: "10-Speed Automatic",
        acceleration: "0-100 km/h in 4.2 seconds",
        topSpeed: "250 km/h"
      },
      category: "Sports Car"
    },
    // Add more cars with similar structure
  ];

  const car = carCollection[parseInt(id)] || carCollection[0];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
  };

  const handleBuyClick = (car) => {
    setSelectedCar(car);
    setShowEnquiryForm(true);
    // Set the car name in the message field
    setEnquiryData({
      ...enquiryData,
      message: `I am interested in buying the ${car.title} priced at ${car.price}.`
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData({
      ...enquiryData,
      [name]: value
    });
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Enquiry submitted:", enquiryData);
    alert("Your enquiry has been submitted successfully! Our team will contact you soon.");
    setShowEnquiryForm(false);
    setEnquiryData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  // New handlers for booking form
  const handleOpenBookingForm = () => {
    setShowBookingForm(true);
    setSelectedCar(car);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert(`Rental request submitted for ${car.title} from ${bookingData.pickupDate} to ${bookingData.returnDate}`);
    setShowBookingForm(false);
    // Here you would typically handle the form submission to your backend
    console.log("Booking submitted:", bookingData);
    // Reset form data
    setBookingData({
      name: "",
      phone: "",
      email: "",
      pickupDate: "",
      returnDate: "",
      specialRequests: ""
    });
  };

  return (
    <>
      <Navbar />
      
      <div className="car-details-container">
        <div className="car-details-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Collection
          </button>
          <h1>{car.title}</h1>
        </div>

        <div className="car-details-content">
          <div className="car-gallery">
            <div className="main-image-container">
              <button className="gallery-nav prev" onClick={handlePrevImage}>‹</button>
              <img 
                src={car.images[currentImageIndex]} 
                alt={`${car.title} view ${currentImageIndex + 1}`}
                className="main-car-image" 
              />
              <button className="gallery-nav next" onClick={handleNextImage}>›</button>
            </div>
            <div className="image-thumbnails">
              {car.images.map((img, index) => (
                <img 
                  key={index}
                  src={img} 
                  alt={`${car.title} thumbnail ${index + 1}`}
                  className={currentImageIndex === index ? "active" : ""}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="car-info">
            <div className="tabs">
              <button 
                className={activeTab === "buy" ? "active" : ""} 
                onClick={() => setActiveTab("buy")}
              >
                Buy
              </button>
              <button 
                className={activeTab === "rent" ? "active" : ""}
                onClick={() => setActiveTab("rent")}
              >
                Rent
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "buy" ? (
                <div className="buy-content">
                  <h2>Purchase Price</h2>
                  <div className="price">{car.price}</div>
                  <p>Includes 3-year warranty and complimentary maintenance</p>
                  <button className="action-button">Schedule a Test Drive</button>
                  <button className="action-button primary" onClick={() => handleBuyClick(car)}>Buy Now</button>
                  <div className="financing-options">
                    <h3>Financing Options Available</h3>
                    <p>EMI starting from ₹80,000 per month</p>
                    <button className="text-button">Calculate EMI</button>
                  </div>
                </div>
              ) : (
                <div className="rent-content">
                  <h2>Rental Options</h2>
                  <div className="price">{car.rentPrice}</div>
                  <div className="rental-packages">
                    <div className="package">
                      <h3>Weekend Package</h3>
                      <p>3 days for the price of 2</p>
                    </div>
                    <div className="package">
                      <h3>Weekly Package</h3>
                      <p>7 days with 10% discount</p>
                    </div>
                    <div className="package">
                      <h3>Monthly Package</h3>
                      <p>30 days with 20% discount</p>
                    </div>
                  </div>
                  <div className="booking-action">
                    <h3 className="booking-title">Ready for an extraordinary driving experience?</h3>
                    <button 
                      onClick={handleOpenBookingForm} 
                      className="action-button primary"
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="car-details-description">
          <h2>About this Car</h2>
          <p>{car.description}</p>
          
          <h2>Specifications</h2>
          <div className="specifications-grid">
            <div className="spec-item">
              <span className="spec-label">Engine</span>
              <span className="spec-value">{car.specifications.engine}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Power</span>
              <span className="spec-value">{car.specifications.power}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Torque</span>
              <span className="spec-value">{car.specifications.torque}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Transmission</span>
              <span className="spec-value">{car.specifications.transmission}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Acceleration</span>
              <span className="spec-value">{car.specifications.acceleration}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Top Speed</span>
              <span className="spec-value">{car.specifications.topSpeed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="buy-page-enquiry-overlay">
          <div className="buy-page-enquiry-form-container">
            <button 
              className="buy-page-close-button"
              onClick={() => setShowEnquiryForm(false)}
            >
              &times;
            </button>
            <h2 className="buy-page-enquiry-title">
              Enquire About {selectedCar?.title}
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
              
              <button type="submit" className="buy-page-submit-button">
                Submit Enquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* New Booking Form Modal - matching the style from RentPage */}
      {showBookingForm && (
        <div className="booking-form-modal-overlay">
          <div className="booking-form-modal">
            <div className="form-modal-header">
              <h2>Book Your Experience</h2>
              <button className="close-modal-button" onClick={handleCloseBookingForm}>×</button>
            </div>
            
            <div className="form-modal-car-summary">
              <img src={car.images[0]} alt={car.title} className="form-car-thumbnail" />
              <div className="form-car-details">
                <h3>{car.title}</h3>
                <p className="form-car-category">{car.category}</p>
                <p className="form-car-price">{car.rentPrice} <span className="form-price-interval">per day</span></p>
              </div>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="booking-detail-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupDate">Pick-up Date</label>
                  <input 
                    type="date" 
                    id="pickupDate"
                    name="pickupDate"
                    value={bookingData.pickupDate}
                    onChange={handleBookingInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="returnDate">Return Date</label>
                  <input 
                    type="date" 
                    id="returnDate"
                    name="returnDate"
                    value={bookingData.returnDate}
                    onChange={handleBookingInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bookingName">Full Name</label>
                  <input 
                    type="text" 
                    id="bookingName"
                    name="name"
                    placeholder="Your full name"
                    value={bookingData.name}
                    onChange={handleBookingInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bookingPhone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="bookingPhone"
                    name="phone"
                    placeholder="Your phone number"
                    value={bookingData.phone}
                    onChange={handleBookingInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="bookingEmail">Email Address</label>
                  <input 
                    type="email" 
                    id="bookingEmail"
                    name="email"
                    placeholder="Your email address"
                    value={bookingData.email}
                    onChange={handleBookingInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="specialRequests">Special Requests (Optional)</label>
                  <textarea 
                    id="specialRequests"
                    name="specialRequests"
                    placeholder="Any special requirements or preferences"
                    rows="3"
                    value={bookingData.specialRequests}
                    onChange={handleBookingInputChange}
                  ></textarea>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseBookingForm}>Cancel</button>
                <button type="submit" className="confirm-button">Confirm Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default CarDetails;