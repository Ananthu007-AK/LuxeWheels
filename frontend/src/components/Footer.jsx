import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Home.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section company-info">
          <h3>Luxewheels</h3>
          <p>Experience extraordinary luxury and automotive excellence.</p>
          <p>Email: concierge@luxewheels.com</p>
          <p>Phone: +91 (800) LUXE-WHEELS</p>
        </div>
        <div className="footer-section quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rent">Rent Fleet</Link></li>
            <li><Link to="/buy">Buy Collection</Link></li>
            <li><Link to="/sell">Sell Your Vehicle</Link></li>
            <li><Link to="/wishlist">Saved Wishlist</Link></li>
          </ul>
        </div>
        <div className="footer-section social">
          <h3>Connect With Us</h3>
          <p>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> |
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a> |
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>
          </p>
          <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#888' }}>
            Available 24/7 for executive bookings and concierge assistance.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Luxewheels. All rights reserved. Where Elegance Meets The Road.</p>
      </div>
    </footer>
  );
};

export default Footer;
