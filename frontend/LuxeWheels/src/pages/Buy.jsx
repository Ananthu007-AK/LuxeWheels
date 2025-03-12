import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Buy.css";
import img2 from "./car.png";
import img3 from "./car2.png";
import img4 from "./car3.png";
import img5 from "./car4.png";
import img6 from "./car5.png";

function Buy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const carCollection = [
    { id: 1, image: img3, title: "VOLVO XC 90", price: "₹62,00,000", year: "2023", mileage: "0 km", engine: "2.0L Turbocharged", transmission: "Automatic" },
    { id: 2, image: img4, title: "MUSTANG GT", price: "₹85,00,000", year: "2023", mileage: "0 km", engine: "5.0L V8", transmission: "Manual" },
    { id: 3, image: img5, title: "C43 AMG", price: "₹75,00,000", year: "2022", mileage: "1,200 km", engine: "3.0L Biturbo V6", transmission: "Automatic" },
    { id: 4, image: img6, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000", year: "2023", mileage: "0 km", engine: "6.75L Twin-Turbo V12", transmission: "Automatic" },
    { id: 5, image: img6, title: "BENTLEY CONTINENTAL GT", price: "₹1,90,00,000", year: "2022", mileage: "500 km", engine: "6.0L W12", transmission: "Automatic" },
    { id: 6, image: img3, title: "FERRARI 488 GTB", price: "₹3,50,00,000", year: "2023", mileage: "0 km", engine: "3.9L Twin-Turbo V8", transmission: "Automatic" },
  ];

  const filteredCars = carCollection.filter((car) =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <div className="buy-page-cars-grid">
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <div key={car.id} className="buy-page-car-card">
                  <div className="buy-page-car-image-container">
                    <img src={car.image} alt={car.title} className="buy-page-car-image" />
                  </div>
                  <div className="buy-page-car-details">
                    <h3 className="buy-page-car-title">{car.title}</h3>
                    <p className="buy-page-car-price">{car.price}</p>
                    <div className="buy-page-car-specs">
                      <p><span>Year:</span> {car.year}</p>
                      <p><span>Mileage:</span> {car.mileage}</p>
                      <p><span>Engine:</span> {car.engine}</p>
                      <p><span>Transmission:</span> {car.transmission}</p>
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
        </section>
      </div>

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

      <footer className="buy-page-footer">
        <p>&copy; 2025 Luxewheels - Where Elegance Meets The Road</p>
      </footer>
    </>
  );
}

export default Buy;