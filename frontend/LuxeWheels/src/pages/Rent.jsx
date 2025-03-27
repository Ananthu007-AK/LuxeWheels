import React, { useState, useEffect } from 'react';
import './Rent.css';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [luxuryCars, setLuxuryCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
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
        status: car.status,
      }));
      console.log('Luxury cars:', formattedCars);
      setLuxuryCars(formattedCars);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setLuxuryCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  const determineCategory = (car) => {
    const make = car.make.toLowerCase();
    if (['porsche', 'ferrari'].includes(make)) return 'Sports';
    if (['rolls-royce'].includes(make)) return 'Ultra Luxury';
    if (['aston martin', 'mustang'].includes(make)) return 'Grand Tourer';
    if (['range rover'].includes(make)) return 'Grand Tourer';
    if (['volvo'].includes(make)) return 'Supercar';
    if (['mercedes', 'c43 amg'].includes(make)) return 'Luxury';
    return 'Luxury';
  };

  const filteredCars = luxuryCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="rental-page-container">
      <Navbar user={user} setUser={setUser} />
      
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

      {isLoading ? (
        <div className="loading">Loading cars...</div>
      ) : (
        <div className="vehicle-catalog">
          <div className="vehicle-grid">
            {filteredCars.length === 0 ? (
              <p>No cars match your search.</p>
            ) : (
              filteredCars.map(car => (
                <div key={car._id} className="vehicle-tile">
                  <div className="vehicle-thumbnail">
                    <img src={car.images[0] || ''} alt={car.name} onError={(e) => console.log('Thumbnail load error:', e.target.src)} />
                  </div>
                  <div className="vehicle-info-brief">
                    <h3 className="vehicle-title">{car.name}</h3>
                    <p className="vehicle-category">{car.category}</p>
                    <p className="vehicle-rate">${car.price} <span className="rate-period">per day</span></p>
                    <p className={`vehicle-status ${car.status === 'available' ? 'available' : 'not-available'}`}>
                      {car.status === 'available' ? 'Available' : 'Not Available'}
                    </p>
                    <button className="details-button">
                      <Link to={`/cars/${car._id}`}>View Details</Link>
                    </button>
                  </div>
                </div>
              ))
            )}
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