import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CarDetails.css";
import axios from "axios";
import car2 from "./car.png"; // Assuming a default car image exists

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

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Debug the id parameter
    console.log("Fetched ID from useParams:", id);

    // Validate id before fetching
    if (!id || id === ":id" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      setError("Invalid car ID. Please use a valid car ID from the collection.");
      setIsLoading(false);
      return;
    }

    const username = localStorage.getItem("username");
    if (username) {
      setUser(username);
    }

    const fetchCar = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/cars/${id}`);
        const fetchedCar = {
          id: response.data._id,
          title: `${response.data.make} ${response.data.model}`,
          price: `₹${response.data.price.toLocaleString('en-IN')}`,
          rentPrice: `₹${response.data.rent || 50000}/day`, // Fallback rent price
          images: response.data.images && response.data.images.length > 0 
            ? response.data.images.map(img => `http://localhost:5000${img}`)
            : [car2],
          description: `Experience luxury with this ${response.data.make} ${response.data.model}.`,
          year: response.data.year,
          kmDriven: response.data.kmDriven,
          transmission: response.data.transmission,
          colour: response.data.colour,
          owners: response.data.owners,
          fuelType: response.data.fuelType,
          status: response.data.status,
          category: determineCategory(response.data)
        };
        setCar(fetchedCar);
      } catch (error) {
        console.error("Error fetching car:", error);
        setError("Failed to load car details. Please try again later.");
        setCar(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  const determineCategory = (carData) => {
    const make = carData.make.toLowerCase();
    if (['porsche', 'ferrari'].includes(make)) return 'Sports';
    if (['rolls-royce'].includes(make)) return 'Ultra Luxury';
    if (['aston martin', 'mustang'].includes(make)) return 'Grand Tourer';
    if (['range rover'].includes(make)) return 'Grand Tourer';
    if (['volvo'].includes(make)) return 'Supercar';
    if (['mercedes', 'c43 amg'].includes(make)) return 'Luxury';
    return 'Luxury';
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (car?.images.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (car?.images.length || 1)) % (car?.images.length || 1));
  };

  const handleBuyClick = (car) => {
    setSelectedCar(car);
    setShowEnquiryForm(true);
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
      car: car.title,
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
      setShowEnquiryForm(false);
      setEnquiryData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }
  };

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

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingPayload = {
        ...bookingData,
        car: car.title,
        totalDays: calculateTotalDays(bookingData.pickupDate, bookingData.returnDate)
      };

      const response = await axios.post('http://localhost:5000/bookings', bookingPayload);
      alert(response.data.message || `Rental request submitted for ${car.title}`);
      
      setShowBookingForm(false);
      setBookingData({
        name: "",
        phone: "",
        email: "",
        pickupDate: "",
        returnDate: "",
        specialRequests: ""
      });
    } catch (error) {
      console.error("Booking submission error:", error);
      alert("Failed to submit booking. Please try again.");
    }
  };

  const calculateTotalDays = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returns = new Date(returnDate);
    const timeDiff = Math.abs(returns.getTime() - pickup.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  if (isLoading) return <div className="car-details-container">Loading...</div>;
  if (error) return <div className="car-details-container">{error}</div>;
  if (!car) return <div className="car-details-container">Car not found.</div>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      
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
              <span className="spec-label">Year</span>
              <span className="spec-value">{car.year}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Mileage</span>
              <span className="spec-value">{car.kmDriven} km</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Transmission</span>
              <span className="spec-value">{car.transmission}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Colour</span>
              <span className="spec-value">{car.colour}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Owners</span>
              <span className="spec-value">{car.owners}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Fuel Type</span>
              <span className="spec-value">{car.fuelType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Status</span>
              <span className="spec-value">{car.status}</span>
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
              ×
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

      {/* New Booking Form Modal */}
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
        <p>© 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default CarDetails;