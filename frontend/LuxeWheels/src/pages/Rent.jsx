import React, { useState, useEffect } from 'react';
import './Rent.css';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RentPage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pickupDate: '',
    returnDate: ''
  });
  const [luxuryCars, setLuxuryCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUser(username);
    }
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/cars');
      const formattedCars = response.data.map(car => ({
        key: car._id || car.id,
        _id: car._id || car.id,
        name: `${car.make} ${car.model}`,
        category: determineCategory(car),
        price: parseFloat(car.rent),
        images: car.images && car.images.length > 0 ? car.images.map(img => `http://localhost:5000${img}`) : [],
        description: `Experience luxury with this ${car.make} ${car.model}.`,
        year: car.year,
        kmDriven: car.kmDriven,
        transmission: car.transmission,
        colour: car.colour,
        owners: car.owners,
        fuelType: car.fuelType,
        status: car.status
      }));
      console.log('Luxury cars:', formattedCars);
      setLuxuryCars(formattedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setLuxuryCars([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  const determineCategory = (car) => {
    const make = car.make.toLowerCase();
    if (['porsche', 'ferrari'].includes(make)) return 'Sports';
    if (['rolls-royce'].includes(make)) return 'Ultra Luxury';
    if (['aston martin', 'mustang'].includes(make)) return 'Grand Tourer';
    if (['range rover'].includes(make)) return 'Grand Tourer'; // Or 'SUV'
    if (['volvo'].includes(make)) return 'Supercar'; // Adjust as needed
    if (['mercedes', 'c43 amg'].includes(make)) return 'Luxury';
    return 'Luxury'; // Default category
  };

  const filteredCars = luxuryCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleOpenBookingForm = () => {
    setShowBookingForm(true);
    setFormData(prevData => ({
      ...prevData,
      pickupDate: dateRange.start,
      returnDate: dateRange.end
    }));
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const rentalData = {
        carId: selectedCar._id,
        ...formData
      };
      const response = await axios.post('http://localhost:5000/rentals', rentalData);
      alert(response.data.message); // Use backend success message
      setFormData({
        name: '',
        phone: '',
        email: '',
        pickupDate: '',
        returnDate: '',
        specialRequests: ''
      });
      setShowBookingForm(false);
    } catch (error) {
      console.error('Error submitting rental:', error);
      alert(error.response?.data?.message || 'Failed to submit rental request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rental-page-container">
      <Navbar user={user} setUser={setUser} />
      
      {!selectedCar && (
        <div className="showcase-banner">
          <h1 className="showcase-heading">Luxury Car Rentals</h1>
          <p className="showcase-subtext">Experience extraordinary performance and sophistication</p>
          <div className="search-wrapper">
            <input 
              type="text" 
              className="search-input"
              placeholder="Search your dream car..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading">Loading cars...</div>
      ) : selectedCar ? (
        <div className="vehicle-details-wrapper">
          <div className="navigation-back">
            <button className="back-button" onClick={() => setSelectedCar(null)}>← Back to all cars</button>
          </div>
          <div className="details-layout">
            <div className="vehicle-showcase">
              {selectedCar.images && selectedCar.images.length > 0 ? (
                <>
                  <img
                    src={selectedCar.images[0]}
                    alt={selectedCar.name}
                    className="main-image"
                    onError={(e) => console.log('Main image load error:', e.target.src)}
                  />
                  <div className="thumbnail-gallery">
                    {selectedCar.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${selectedCar.name} thumbnail ${index + 1}`}
                        className={index === 0 ? 'thumbnail active' : 'thumbnail'}
                        onClick={() => {/* Add logic to switch image if needed */}}
                        onError={(e) => console.log('Thumbnail load error:', e.target.src)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="vehicle-data-sheet">
              <h2>{selectedCar.name}</h2>
              <p className="vehicle-class">{selectedCar.category}</p>
              <p className="rental-cost">₹{selectedCar.rent} <span className="cost-interval">per day</span></p>
              <p className="vehicle-description">{selectedCar.description}</p>
              
              <div className="technical-specs">
                <h3 className="specs-heading">Specifications</h3>
                <div className="specs-table">
                  <div className="spec-row">
                    <span className="spec-name">Year</span>
                    <span className="spec-data">{selectedCar.year}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Mileage</span>
                    <span className="spec-data">{selectedCar.kmDriven} km</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Transmission</span>
                    <span className="spec-data">{selectedCar.transmission}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Colour</span>
                    <span className="spec-data">{selectedCar.colour}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Owners</span>
                    <span className="spec-data">{selectedCar.owners}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Fuel Type</span>
                    <span className="spec-data">{selectedCar.fuelType}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Status</span>
                    <span className="spec-data">{selectedCar.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="booking-action">
                <h3 className="booking-title">Ready for an extraordinary driving experience?</h3>
                <button 
                  onClick={handleOpenBookingForm} 
                  className="book-now-button"
                >
                  Reserve Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="vehicle-catalog">
          <div className="vehicle-grid">
            {filteredCars.length === 0 ? (
              <p>No cars match your search.</p>
            ) : (
              filteredCars.map(car => (
                <div key={car._id} className="vehicle-tile" onClick={() => handleCarSelect(car)}>
                  <div className="vehicle-thumbnail">
                    <img src={car.images[0] || ''} alt={car.name} onError={(e) => console.log('Thumbnail load error:', e.target.src)} />
                  </div>
                  <div className="vehicle-info-brief">
                    <h3 className="vehicle-title">{car.name}</h3>
                    <p className="vehicle-category">{car.category}</p>
                    <p className="vehicle-rate">${car.price} <span className="rate-period">per day</span></p>
                    <button className="details-button" onClick={() => handleCarSelect(car)}><Link to={`/cars/${car._id}`}> View Details</Link></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showBookingForm && selectedCar && (
        <div className="booking-form-modal-overlay">
          <div className="booking-form-modal">
            <div className="form-modal-header">
              <h2>Book Your Experience</h2>
              <button className="close-modal-button" onClick={handleCloseBookingForm}>×</button>
            </div>
            
            <div className="form-modal-car-summary">
              <img src={selectedCar.images[0] || ''} alt={selectedCar.name} className="form-car-thumbnail" onError={(e) => console.log('Form image load error:', e.target.src)} />
              <div className="form-car-details">
                <h3>{selectedCar.name}</h3>
                <p className="form-car-category">{selectedCar.category}</p>
                <p className="form-car-price">${selectedCar.price} <span className="form-price-interval">per day</span></p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="booking-detail-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupDate">Pick-up Date</label>
                  <input 
                    type="date" 
                    id="pickupDate"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="returnDate">Return Date</label>
                  <input 
                    type="date" 
                    id="returnDate"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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

      <div className="advantages-section">
        <h2 className="advantages-title">Why Choose LuxeWheels</h2>
        <div className="advantages-display">
          <div className="advantage-item">
            <div className="advantage-icon">🏆</div>
            <h3 className="advantage-title">Premium Selection</h3>
            <p className="advantage-text">Handpicked fleet of the world's finest automobiles.</p>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon">🔄</div>
            <h3 className="advantage-title">Latest Models</h3>
            <p className="advantage-text">New models refreshed regularly to ensure you experience the latest in automotive excellence.</p>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon">🚗</div>
            <h3 className="advantage-title">Doorstep Delivery</h3>
            <p className="advantage-text">We bring the vehicle to your location with white-glove service.</p>
          </div>
          <div className="advantage-item">
            <div className="advantage-icon">💼</div>
            <h3 className="advantage-title">Concierge Service</h3>
            <p className="advantage-text">24/7 dedicated concierge for any assistance during your rental.</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">What Our Clients Say</h2>
        <div className="reviews-collection">
          <div className="review-card">
            <p className="review-text">"The Ferrari Roma was an absolute dream to drive along the coast. LuxeWheels made the process seamless from start to finish."</p>
            <p className="reviewer-name">— Michael T., Executive</p>
          </div>
          <div className="review-card">
            <p className="review-text">"Arrived for a business trip and had the Bentley Continental waiting for me. Made quite the impression at meetings."</p>
            <p className="reviewer-name">— Sarah L., CEO</p>
          </div>
          <div className="review-card">
            <p className="review-text">"The attention to detail and level of service is unmatched. My go-to for luxury rentals in every city."</p>
            <p className="reviewer-name">— James W., Entrepreneur</p>
          </div>
        </div>
      </div>

      <div className="faq-block">
        <h2 className="faq-heading">Frequently Asked Questions</h2>
        <div className="faq-list">
          <div className="faq-entry">
            <h3 className="faq-question">What documents do I need to rent?</h3>
            <p className="faq-answer">Valid driver's license, credit card in your name, proof of insurance, and a secondary form of ID are required.</p>
          </div>
          <div className="faq-entry">
            <h3 className="faq-question">Is there a security deposit?</h3>
            <p className="faq-answer">Yes, a security deposit is required and varies by vehicle. It's fully refundable upon return of the vehicle in its original condition.</p>
          </div>
          <div className="faq-entry">
            <h3 className="faq-question">Do you offer chauffeur services?</h3>
            <p className="faq-answer">Yes, professional chauffeurs are available for an additional fee.</p>
          </div>
          <div className="faq-entry">
            <h3 className="faq-question">What is your cancellation policy?</h3>
            <p className="faq-answer">Full refund for cancellations 72+ hours before pickup. 50% refund within 24-72 hours. No refund for less than 24 hours notice.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentPage;