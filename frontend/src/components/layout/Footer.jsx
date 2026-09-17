import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="lux-footer">
      <div className="lux-footer-container">
        <div className="lux-footer-brand">
          <h2>LUXE<span>WHEELS</span></h2>
          <p>
            Curating the finest automotive engineering. Experience the pinnacle of performance, prestige, and bespoke client service.
          </p>
        </div>

        <div className="lux-footer-col">
          <h3>Fleet</h3>
          <ul>
            <li><Link to="/buy">Purchase Inventory</Link></li>
            <li><Link to="/rent">Exotic Rentals</Link></li>
            <li><Link to="/sell">Consign Your Vehicle</Link></li>
          </ul>
        </div>

        <div className="lux-footer-col">
          <h3>Services</h3>
          <ul>
            <li><Link to="/rent">Chauffeur Service</Link></li>
            <li><Link to="/rent">Corporate Leasing</Link></li>
            <li><Link to="/profile">VIP Concierge</Link></li>
          </ul>
        </div>

        <div className="lux-footer-col">
          <h3>Direct Contact</h3>
          <ul>
            <li>Email: concierge@luxewheels.com</li>
            <li>Phone: +91 1800-LUXE-WHEELS</li>
            <li>Locations: Mumbai • Dubai • London</li>
          </ul>
        </div>
      </div>

      <div className="lux-footer-bottom">
        <p>&copy; {new Date().getFullYear()} LuxeWheels Inc. All rights reserved.</p>
        <p>Crafted for automotive connoisseurs worldwide.</p>
      </div>
    </footer>
  );
};

export default Footer;
