import React, { useState } from 'react';
import './Rent.css';
import Navbar from '../components/Navbar';
import porsche911GTS from './images/Porsche 911 GT3.jpg';
import car2 from './car2.png';
import car4 from './car4.png';
import car5 from './car5.png';
import Ferrari from './images/Ferrari Roma.jpg';
import Aston from './images/Aston Martin.jpg';
import car3 from './car3.png';
import Range from './images/Range Rover.jpeg';

const RentPage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const luxuryCars = [
    {
      id: 1,
      name: 'Porsche 911 GTS',
      category: 'Sports',
      price: 899,
      image: porsche911GTS,
      description: 'Experience the thrill of German engineering with this iconic sports car.',
      specs: {
        engine: '3.0L Twin-Turbo Flat-6',
        horsepower: '473 hp',
        acceleration: '0-60 mph in 3.1s',
        topSpeed: '193 mph'
      }
    },
    {
      id: 2,
      name: 'VOLVO XC 90',
      category: 'Supercar',
      price: 1499,
      image: car2,
      description: 'Turn heads with this stunning Italian masterpiece.',
      specs: {
        engine: '5.2L V10',
        horsepower: '631 hp',
        acceleration: '0-60 mph in 2.9s',
        topSpeed: '202 mph'
      }
    },
    {
      id: 3,
      name: 'C43 AMG',
      category: 'Luxury',
      price: 1199,
      image: car4,
      description: 'Ultimate luxury and comfort with incredible performance.',
      specs: {
        engine: '6.0L W12',
        horsepower: '626 hp',
        acceleration: '0-60 mph in 3.6s',
        topSpeed: '207 mph'
      }
    },
    {
      id: 4,
      name: 'Rolls-Royce Ghost',
      category: 'Ultra Luxury',
      price: 1899,
      image: car5,
      description: 'The pinnacle of luxury automotive craftsmanship.',
      specs: {
        engine: '6.75L Twin-Turbo V12',
        horsepower: '563 hp',
        acceleration: '0-60 mph in 4.6s',
        topSpeed: '155 mph (limited)'
      }
    },
    {
      id: 5,
      name: 'Ferrari Roma',
      category: 'Sports',
      price: 1299,
      image: Ferrari,
      description: 'Italian elegance meets racing heritage.',
      specs: {
        engine: '3.9L Twin-Turbo V8',
        horsepower: '612 hp',
        acceleration: '0-60 mph in 3.4s',
        topSpeed: '199 mph'
      }
    },
    {
      id: 6,
      name: 'Aston Martin DB11',
      category: 'Grand Tourer',
      price: 1099,
      image: Aston,
      description: 'British elegance with a powerful presence.',
      specs: {
        engine: '4.0L Twin-Turbo V8',
        horsepower: '528 hp',
        acceleration: '0-60 mph in 3.9s',
        topSpeed: '187 mph'
      }
    },
    {
      id: 7,
      name: 'MUSTANG GT',
      category: 'Grand Tourer',
      price: 1099,
      image: car3,
      description: ' A performance-focused coupe with a classic American muscle car design.',
      specs: {
        engine: '4.0L Twin-Turbo V8',
        horsepower: '528 hp',
        acceleration: '0-60 mph in 3.9s',
        topSpeed: '187 mph'
      }
    },
    {
      id: 8,
      name: 'RANGE ROVER SPORT',
      category: 'Grand Tourer',
      price: 1099,
      image: Range,
      description: 'Performance-focused SUV known for its assertive power, responsive handling, and luxurious interior.',
      specs: {
        engine: '4.0L Twin-Turbo V8',
        horsepower: '528 hp',
        acceleration: '0-60 mph in 3.9s',
        topSpeed: '187 mph'
      }
    }
  ];

  const filteredCars = luxuryCars.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          car.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Rental request submitted for ${selectedCar.name} from ${dateRange.start} to ${dateRange.end}`);
    // Here you would typically handle the form submission to your backend
  };

  return (
    <div className="rental-page-container">
      <Navbar />
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

      {selectedCar ? (
        <div className="vehicle-details-wrapper">
          <div className="navigation-back">
            <button className="back-button" onClick={() => setSelectedCar(null)}>← Back to all cars</button>
          </div>
          <div className="details-layout">
            <div className="vehicle-showcase">
              <img src={selectedCar.image} alt={selectedCar.name} />
            </div>
            <div className="vehicle-data-sheet">
              <h2>{selectedCar.name}</h2>
              <p className="vehicle-class">{selectedCar.category}</p>
              <p className="rental-cost">${selectedCar.price} <span className="cost-interval">per day</span></p>
              <p className="vehicle-description">{selectedCar.description}</p>
              
              <div className="technical-specs">
                <h3 className="specs-heading">Specifications</h3>
                <div className="specs-table">
                  <div className="spec-row">
                    <span className="spec-name">Engine</span>
                    <span className="spec-data">{selectedCar.specs.engine}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Horsepower</span>
                    <span className="spec-data">{selectedCar.specs.horsepower}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Acceleration</span>
                    <span className="spec-data">{selectedCar.specs.acceleration}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Top Speed</span>
                    <span className="spec-data">{selectedCar.specs.topSpeed}</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="reservation-form">
                <h3 className="form-title">Book Your Experience</h3>
                <div className="form-flex-row">
                  <div className="input-block">
                    <label className="input-label">Pick-up Date</label>
                    <input 
                      type="date" 
                      className="input-field"
                      required 
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </div>
                  <div className="input-block">
                    <label className="input-label">Return Date</label>
                    <input 
                      type="date" 
                      className="input-field"
                      required
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-flex-row">
                  <div className="input-block">
                    <label className="input-label">Name</label>
                    <input type="text" className="input-field" placeholder="Your full name" required />
                  </div>
                  <div className="input-block">
                    <label className="input-label">Phone</label>
                    <input type="tel" className="input-field" placeholder="Your phone number" required />
                  </div>
                </div>
                <div className="form-flex-row form-flex-row--full">
                  <div className="input-block">
                    <label className="input-label">Email</label>
                    <input type="email" className="input-field" placeholder="Your email address" required />
                  </div>
                </div>
                <button type="submit" className="submit-button">Reserve Now</button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="vehicle-catalog">
          <div className="vehicle-grid">
            {filteredCars.map(car => (
              <div key={car.id} className="vehicle-tile" onClick={() => handleCarSelect(car)}>
                <div className="vehicle-thumbnail">
                  <img src={car.image} alt={car.name} />
                </div>
                <div className="vehicle-info-brief">
                  <h3 className="vehicle-title">{car.name}</h3>
                  <p className="vehicle-category">{car.category}</p>
                  <p className="vehicle-rate">${car.price} <span className="rate-period">per day</span></p>
                  <button className="details-button">View Details</button>
                </div>
              </div>
            ))}
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