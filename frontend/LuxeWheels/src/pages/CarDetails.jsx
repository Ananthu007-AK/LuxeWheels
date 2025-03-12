import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CarDetails.css";
import car2 from "./car2.png";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buy");

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
      }
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
      }
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
                  <button className="action-button primary">Buy Now</button>
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
                  <button className="action-button primary">Rent Now</button>
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

      <footer>
        <p>&copy; 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default CarDetails;