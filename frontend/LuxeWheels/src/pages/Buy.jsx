import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Buy.css";

// Import your car images (assuming they're in the same location)
import img2 from "./car.png";
import img3 from "./car2.png";
import img4 from "./car3.png";
import img5 from "./car4.png";
import img6 from "./car5.png";

function Buy() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferred_contact: "email",
    test_drive: false
  });
  const [submitted, setSubmitted] = useState(false);

  // Sample car database - in a real app this would come from an API or context
  const carDatabase = [
    { id: 0, image: img3, title: "VOLVO XC 90", price: "₹62,00,000", specs: "2.0L 4-cylinder Turbo, 400 HP, AWD" },
    { id: 1, image: img4, title: "MUSTANG GT", price: "₹85,00,000", specs: "5.0L V8, 460 HP, RWD" },
    { id: 2, image: img5, title: "C43 AMG", price: "₹75,00,000", specs: "3.0L V6 Biturbo, 385 HP, AWD" },
    { id: 3, image: img6, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000", specs: "6.6L V12, 563 HP, AWD" },
    { id: 4, image: img2, title: "MERCEDES S-CLASS", price: "₹1,60,00,000", specs: "4.0L V8 Biturbo, 496 HP, AWD" }
  ];

  // Get current car based on ID
  const currentCar = carDatabase.find(car => car.id === parseInt(id)) || carDatabase[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Inquiry submitted:", formData);
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        preferred_contact: "email",
        test_drive: false
      });
    }, 5000);
  };

  return (
    <>
      <title>Luxewheels - Enquire About {currentCar.title}</title>
      <Navbar />

      <div className="buy-container">
        <div className="vehicle-showcase">
          <img src={currentCar.image} alt={currentCar.title} className="showcase-image" />
          <div className="vehicle-details">
            <h1 className="vehicle-title">{currentCar.title}</h1>
            <p className="vehicle-price">{currentCar.price}</p>
            <p className="vehicle-specs">{currentCar.specs}</p>
            <div className="vehicle-badges">
              <span className="badge badge-premium">Premium</span>
              <span className="badge badge-available">Available</span>
            </div>
          </div>
        </div>

        <div className="enquiry-section">
          <h2 className="enquiry-heading">Interested in this luxury vehicle?</h2>
          <p className="enquiry-subtext">
            Complete the form below to connect with our luxury vehicle specialist.
            No obligation to purchase - we're here to answer your questions.
          </p>

          {submitted ? (
            <div className="success-message">
              <h3>Thank you for your interest!</h3>
              <p>Our specialist will contact you shortly regarding the {currentCar.title}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="preferred_contact">Preferred Contact Method</label>
                <select
                  id="preferred_contact"
                  name="preferred_contact"
                  className="form-select"
                  value={formData.preferred_contact}
                  onChange={handleChange}
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="test_drive"
                  name="test_drive"
                  className="form-check"
                  checked={formData.test_drive}
                  onChange={handleChange}
                />
                <label htmlFor="test_drive">I would like to schedule a test drive</label>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Your Message (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific questions or requirements?"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="submit-button">Submit Enquiry</button>
                <Link to="/" className="back-link">Back to Collection</Link>
              </div>
              
              <p className="privacy-note">
                Your information will be handled according to our Privacy Policy.
                We never share your details with third parties.
              </p>
            </form>
          )}
        </div>
        
        <div className="benefits-section">
          <h3 className="benefits-title">The Luxewheels Advantage</h3>
          <ul className="benefits-list">
            <li className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Personalized Shopping Experience</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Exclusive Test Drive Opportunities</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Transparent Pricing & No Hidden Fees</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Premium After-Sales Support</span>
            </li>
            <li className="benefit-item">
              <span className="benefit-icon">✓</span>
              <span className="benefit-text">Flexible Financing Options</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="related-vehicles">
        <h2 className="related-title">You May Also Like</h2>
        <div className="related-container">
          {carDatabase.filter(car => car.id !== parseInt(id)).slice(0, 3).map(car => (
            <div key={car.id} className="related-card">
              <img src={car.image} alt={car.title} className="related-image" />
              <h3 className="related-name">{car.title}</h3>
              <p className="related-price">{car.price}</p>
              <Link to={`/car/${car.id}`} className="related-link">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="buy-footer">
        <p>&copy; 2025 Luxewheels - Where Elegance Meets The Road</p>
      </footer>
    </>
  );
}

export default Buy;