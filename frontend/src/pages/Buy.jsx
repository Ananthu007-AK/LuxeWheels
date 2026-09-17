import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FilterBar from "../components/cars/FilterBar";
import "./Buy.css";
import axios from 'axios';
import defaultCarImage from "./car.png";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

function Buy() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [user, setUser] = useState(null);

  // Filter States
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [transmission, setTransmission] = useState("all");
  const [fuelType, setFuelType] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

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
      const response = await axios.get('http://localhost:9000/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([
        { _id: "1", make: "VOLVO", model: "XC 90", price: "6200000", year: "2023", kmDriven: "0", transmission: "Automatic", fuelType: "Petrol", images: [defaultCarImage] },
        { _id: "2", make: "FORD", model: "MUSTANG GT", price: "8500000", year: "2023", kmDriven: "0", transmission: "Manual", fuelType: "Petrol", images: [defaultCarImage] }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = (car) => {
    setSelectedCar(car);
    setShowEnquiryForm(true);
    setEnquiryData({
      ...enquiryData,
      message: `I am interested in purchasing the ${car.make} ${car.model} listed at ₹${Number(car.price).toLocaleString('en-IN')}.`
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
      showToast("Please enter a valid 10-digit phone number.", "error");
      setIsSubmitting(false);
      return;
    }

    const enquiryPayload = {
      user: enquiryData.name,
      car: `${selectedCar.make} ${selectedCar.model}`,
      message: enquiryData.message,
      email: enquiryData.email,
      phone: enquiryData.phone,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await axios.post('http://localhost:9000/enquiries', enquiryPayload);
      showToast(response.data.message || "Your purchase enquiry has been submitted! Our luxury concierge will contact you soon.", "success");
      setShowEnquiryForm(false);
      setEnquiryData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      showToast("There was an error submitting your enquiry. Please try again later.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetFilters = () => {
    setMaxPrice(50000000);
    setTransmission("all");
    setFuelType("all");
    setSortBy("default");
    setSearchTerm("");
  };

  const filteredCars = cars
    .filter((car) => {
      const matchesSearch = `${car.make} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      const numPrice = Number(car.price || 0);
      if (numPrice > maxPrice) return false;

      if (transmission !== "all" && (car.transmission || "").toLowerCase() !== transmission.toLowerCase()) {
        return false;
      }

      if (fuelType !== "all" && (car.fuelType || "").toLowerCase() !== fuelType.toLowerCase()) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      const pA = Number(a.price || 0);
      const pB = Number(b.price || 0);
      if (sortBy === "price-asc") return pA - pB;
      if (sortBy === "price-desc") return pB - pA;
      if (sortBy === "year-desc") return Number(b.year || 0) - Number(a.year || 0);
      return 0;
    });

  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <div className="buy-page-container">
        <section className="buy-page-hero">
          <h1 className="buy-page-title">Exclusive Collection</h1>
          <p className="buy-page-subtitle">Acquire the world's most sought-after luxury motorcars</p>
          <div className="buy-page-search-container">
            <input
              type="text"
              className="buy-page-search"
              placeholder="Search by make, model or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <FilterBar
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          priceLimit={50000000}
          priceLabel="Max Purchase Budget"
          isRent={false}
          transmission={transmission}
          setTransmission={setTransmission}
          fuelType={fuelType}
          setFuelType={setFuelType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
        />

        <section className="buy-page-collection">
          <h2 className="buy-page-section-title">Available Luxury Cars</h2>
          {isLoading ? (
            <div className="buy-page-loading">Loading luxury cars...</div>
          ) : (
            <div className="buy-page-cars-grid">
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => {
                  const carId = car._id || car.id;
                  const wishlisted = isInWishlist(carId);
                  const compared = isInCompare(carId);

                  return (
                    <div key={carId} className="buy-page-car-card">
                      <div className="buy-page-car-image-container">
                        <img
                          src={car.images && car.images.length > 0 ? `http://localhost:9000${car.images[0]}` : defaultCarImage}
                          alt={`${car.make} ${car.model}`}
                          className="buy-page-car-image"
                          onError={(e) => console.log('Image load error:', e.target.src)}
                        />
                        <div className="card-floating-actions">
                          <button
                            className={`card-action-btn ${wishlisted ? 'wishlist-active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(car);
                            }}
                            title={wishlisted ? 'Remove from Saved' : 'Save to Wishlist'}
                            type="button"
                          >
                            {wishlisted ? '♥' : '♡'}
                          </button>
                          <button
                            className={`card-action-btn ${compared ? 'compare-active' : ''}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCompare(car);
                            }}
                            title={compared ? 'In Comparison' : 'Add to Compare'}
                            type="button"
                          >
                            ⚖
                          </button>
                        </div>
                      </div>
                      <div className="buy-page-car-details">
                        <h3 className="buy-page-car-title">{car.make} {car.model}</h3>
                        <p className="buy-page-car-price">{formatPrice(car.price)}</p>
                        <div className="buy-page-car-specs">
                          <p><span>Year:</span> {car.year}</p>
                          <p><span>Mileage:</span> {car.kmDriven} km</p>
                          <p><span>Engine:</span> {car.fuelType || "Petrol"}</p>
                          <p><span>Transmission:</span> {car.transmission}</p>
                          {car.colour && <p><span>Color:</span> {car.colour}</p>}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                          <Link
                            to={`/cars/${carId}`}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              padding: '12px 14px',
                              border: '1.5px solid #000',
                              borderRadius: '4px',
                              color: '#000',
                              textDecoration: 'none',
                              fontWeight: '600',
                              fontSize: '0.85rem'
                            }}
                          >
                            View Specs
                          </Link>
                          <button
                            className="buy-page-buy-button"
                            onClick={() => handleBuyClick(car)}
                            style={{ flex: 1, marginTop: 0 }}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="buy-page-no-results">No cars match your search criteria.</p>
              )}
            </div>
          )}
        </section>
      </div>

      {showEnquiryForm && (
        <div className="buy-page-enquiry-overlay">
          <div className="buy-page-enquiry-form-container">
            <button
              className="buy-page-close-button"
              onClick={() => setShowEnquiryForm(false)}
            >
              ├ù
            </button>
            <h2 className="buy-page-enquiry-title">
              Enquire About {selectedCar?.make} {selectedCar?.model}
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

      <Footer />
    </>
  );
}

export default Buy;

