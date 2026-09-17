import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CarDetails.css";
import axios from "axios";
import car2 from "./car.png"; // Default image
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";
import { useCompare } from "../context/CompareContext";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  const [activeTab, setActiveTab] = useState("buy");
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [rawCarData, setRawCarData] = useState(null);
  const [bookingErrors, setBookingErrors] = useState({});
  const [withChauffeur, setWithChauffeur] = useState(false);

  const [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupDate: "",
    returnDate: "",
    specialRequests: "",
  });
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Fetched ID from useParams:", id);

    if (!id || id === ":id" || !/^[0-9a-fA-F]{24}$/.test(id)) {
      setError("Invalid car ID.");
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
        const response = await axios.get(`http://localhost:9000/cars/${id}`);
        setRawCarData(response.data);
        const fetchedCar = {
          id: response.data._id,
          _id: response.data._id,
          title: `${response.data.make} ${response.data.model}`,
          price: `₹${response.data.price?.toLocaleString("en-IN") || "N/A"}`,
          rentPrice: `₹${response.data.rent?.toLocaleString("en-IN") || "50,000"}/day`,
          rawRent: response.data.rent || 50000,
          rawPrice: response.data.price || 0,
          images: response.data.images?.length > 0
            ? response.data.images.map((img) => `http://localhost:9000${img}`)
            : [car2],
          description: `Experience luxury with this ${response.data.make} ${response.data.model}.`,
          year: response.data.year,
          kmDriven: response.data.kmDriven,
          transmission: response.data.transmission,
          colour: response.data.colour,
          owners: response.data.owners,
          fuelType: response.data.fuelType,
          status: response.data.status,
          category: determineCategory(response.data),
        };
        console.log("Fetched car:", fetchedCar);
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
    if (["porsche", "ferrari"].includes(make)) return "Sports";
    if (["rolls-royce"].includes(make)) return "Ultra Luxury";
    if (["aston martin", "mustang"].includes(make)) return "Grand Tourer";
    if (["range rover"].includes(make)) return "Grand Tourer";
    if (["volvo"].includes(make)) return "Supercar";
    if (["mercedes", "c43 amg"].includes(make)) return "Luxury";
    return "Luxury";
  };

  const calculateDays = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 1;
    const start = new Date(bookingData.pickupDate);
    const end = new Date(bookingData.returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const durationDays = calculateDays();
  const rawRent = car?.rawRent || 50000;
  const baseRentalTotal = durationDays * rawRent;
  const chauffeurFee = withChauffeur ? durationDays * 3500 : 0;
  const deposit = Math.round(rawRent * 0.4);
  const estimatedTotal = baseRentalTotal + chauffeurFee + deposit;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (car?.images.length || 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (car?.images.length || 1)) % (car?.images.length || 1));
  };

  const handleBuyClick = (car) => {
    if (!user) {
      showToast("Please sign in to proceed with the purchase.", "info");
      navigate("/login");
      return;
    }
    setSelectedCar(car);
    setShowEnquiryForm(true);
    setEnquiryData({
      ...enquiryData,
      message: `I am interested in buying the ${car.title} priced at ${car.price}.`,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryData({ ...enquiryData, [name]: value });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(enquiryData.phone)) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      setIsSubmitting(false);
      return;
    }

    const enquiryPayload = {
      user: enquiryData.name,
      car: car.title,
      message: enquiryData.message,
      email: enquiryData.email,
      phone: enquiryData.phone,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const response = await axios.post('http://localhost:9000/enquiries', enquiryPayload);
      showToast(
        response.data.message ||
        'Your enquiry has been submitted successfully! Our luxury concierge will contact you shortly.',
        'success'
      );
      setShowEnquiryForm(false);
      setEnquiryData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      showToast(error.response?.data?.message || 'Failed to submit enquiry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenBookingForm = () => {
    if (!user) {
      showToast("Please sign in to reserve this car.", "info");
      navigate("/login");
      return;
    }
    if (car.status !== "available") {
      showToast("This car is currently not available for booking.", "warning");
      return;
    }
    setShowBookingForm(true);
    setSelectedCar(car);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({ ...prevData, [name]: value }));

    const today = new Date().toISOString().split("T")[0];
    let errors = { ...bookingErrors };

    if (name === "pickupDate") {
      if (value < today) {
        errors.pickupDate = "Pick-up date cannot be in the past.";
      } else {
        errors.pickupDate = "";
      }
      if (bookingData.returnDate && value >= bookingData.returnDate) {
        errors.returnDate = "Return date must be after pick-up date.";
      } else if (bookingData.returnDate) {
        errors.returnDate = "";
      }
    }

    if (name === "returnDate") {
      if (value <= bookingData.pickupDate) {
        errors.returnDate = "Return date must be after pick-up date.";
      } else {
        errors.returnDate = "";
      }
    }

    setBookingErrors(errors);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const today = new Date().toISOString().split('T')[0];
    const pickupDate = bookingData.pickupDate;
    const returnDate = bookingData.returnDate;

    if (!pickupDate || !returnDate) {
      showToast('Please select both pick-up and return dates.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (pickupDate < today) {
      showToast('Pick-up date cannot be in the past.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (returnDate <= pickupDate) {
      showToast('Return date must be after the pick-up date.', 'error');
      setIsSubmitting(false);
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookingData.phone)) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      setIsSubmitting(false);
      return;
    }

    const specialReqFormatted = [
      `[Duration: ${durationDays} ${durationDays === 1 ? 'day' : 'days'} | Chauffeur: ${withChauffeur ? 'Yes' : 'No'} | Est: ₹${estimatedTotal.toLocaleString('en-IN')}]`,
      bookingData.specialRequests
    ].filter(Boolean).join(' ');

    const bookingPayload = {
      carId: car.id,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      pickupDate: bookingData.pickupDate,
      returnDate: bookingData.returnDate,
      specialRequests: specialReqFormatted,
      status: 'pending',
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:9000/rentals', bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast(
        response.data.message ||
        `Rental request submitted for ${car.title}! Our team will confirm your booking shortly.`,
        'success'
      );
      setShowBookingForm(false);
      setBookingData({
        name: '',
        phone: '',
        email: '',
        pickupDate: '',
        returnDate: '',
        specialRequests: '',
      });
      setWithChauffeur(false);
    } catch (error) {
      console.error('Booking submission error:', error.response?.data || error);
      showToast(error.response?.data?.message || 'Failed to submit booking.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) return <div className="car-details-container">Loading...</div>;
  if (error) return <div className="car-details-container">{error}</div>;
  if (!car) return <div className="car-details-container">Car not found.</div>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <div className="car-details-container">
        {/* Header Breadcrumb & Title Bar */}
        <div className="car-details-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Collection
          </button>

          <div className="car-header-meta">
            <span className="car-category-badge">✦ {car.category.toUpperCase()}</span>
            <h1 className="car-main-title">{car.title}</h1>

            <div className="car-quick-specs-bar">
              <span className="quick-spec-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {car.year} Model
              </span>
              <span className="quick-spec-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {car.kmDriven?.toLocaleString("en-IN")} KM
              </span>
              <span className="quick-spec-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                {car.transmission}
              </span>
              <span className="quick-spec-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3" /><path d="M12 2a4 4 0 0 0-4 4v11h8V6a4 4 0 0 0-4-4z" /></svg>
                {car.fuelType}
              </span>
              <span className={`status-pill ${car.status === "available" ? "available" : "reserved"}`}>
                <span className="status-dot"></span>
                {car.status === "available" ? "Available for Booking" : "Currently Reserved"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: Gallery + Control Panel Grid */}
        <div className="car-details-content">
          {/* Gallery Showcase */}
          <div className="car-gallery">
            <div className="main-image-container">
              <span className="image-counter-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" /></svg>
                {currentImageIndex + 1} / {car.images.length}
              </span>
              <button className="gallery-nav prev" onClick={handlePrevImage} aria-label="Previous image">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <img
                src={car.images[currentImageIndex]}
                alt={`${car.title} view ${currentImageIndex + 1}`}
                className="main-car-image"
              />
              <button className="gallery-nav next" onClick={handleNextImage} aria-label="Next image">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="image-thumbnails">
              {car.images.map((img, index) => (
                <div
                  key={index}
                  className={`thumbnail-wrapper ${currentImageIndex === index ? "active" : ""}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={img}
                    alt={`${car.title} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Gallery Luxury Guarantee Badges */}
            <div className="gallery-trust-bar">
              <div className="trust-item">
                <span className="trust-icon">🛡️</span>
                <div className="trust-text">
                  <strong>150-Point Certified</strong>
                  <span>Fully inspected by engineers</span>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🚚</span>
                <div className="trust-text">
                  <strong>Doorstep Delivery</strong>
                  <span>Concierge drop-off & pick-up</span>
                </div>
              </div>
              <div className="trust-item">
                <span className="trust-icon">💎</span>
                <div className="trust-text">
                  <strong>24/7 Support</strong>
                  <span>Dedicated VIP account manager</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Control Center Card */}
          <div className="car-info">
            <div className="car-info-card">
              <div className="tabs">
                <button
                  className={activeTab === "buy" ? "active" : ""}
                  onClick={() => setActiveTab("buy")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  Purchase Option
                </button>
                <button
                  className={activeTab === "rent" ? "active" : ""}
                  onClick={() => setActiveTab("rent")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><rect x="1" y="3" width="15" height="13" rx="2" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
                  Rental Option
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "buy" ? (
                  <div className="buy-content">
                    <div className="price-tag-container">
                      <span className="price-label">Ex-Showroom Luxury Purchase</span>
                      <div className="price">{car.price}</div>
                    </div>

                    <div className="inclusions-list">
                      <div className="inclusion-item">
                        <span className="check-icon">✓</span>
                        <span>Includes 3-Year Comprehensive Warranty</span>
                      </div>
                      <div className="inclusion-item">
                        <span className="check-icon">✓</span>
                        <span>Complimentary Annual Maintenance & Servicing</span>
                      </div>
                      <div className="inclusion-item">
                        <span className="check-icon">✓</span>
                        <span>Zero-Accident & Verified Service History</span>
                      </div>
                    </div>

                    <div className="buy-cta-group">
                      <button
                        className="action-button primary"
                        onClick={() => handleBuyClick(car)}
                      >
                        Buy Now / Request Concierge
                      </button>
                      <button
                        className="action-button secondary"
                        onClick={() => {
                          if (!user) {
                            showToast("Please sign in to schedule a test drive.", "info");
                            navigate("/login");
                            return;
                          }
                          setSelectedCar(car);
                          setShowEnquiryForm(true);
                          setEnquiryData({
                            ...enquiryData,
                            message: `I would like to schedule a VIP Test Drive for the ${car.title}.`,
                          });
                        }}
                      >
                        Schedule VIP Test Drive
                      </button>
                    </div>

                    <div className="financing-options-card">
                      <div className="finance-header">
                        <span className="finance-title">Financing & Flexible Credit</span>
                        <span className="finance-badge">Low Interest</span>
                      </div>
                      <p className="finance-sub">Bespoke luxury vehicle loans starting from <strong>₹80,000 / month</strong></p>
                    </div>
                  </div>
                ) : (
                  <div className="rent-content">
                    <div className="price-tag-container">
                      <span className="price-label">Executive Daily Rate</span>
                      <div className="price">{car.rentPrice}</div>
                    </div>

                    <div className="rental-packages-grid">
                      <div className="package-card">
                        <span className="pkg-tag">popular</span>
                        <span className="pkg-title">Weekend Getaway</span>
                        <span className="pkg-sub">3 Days for price of 2</span>
                      </div>
                      <div className="package-card">
                        <span className="pkg-tag discount">10% OFF</span>
                        <span className="pkg-title">Weekly Executive</span>
                        <span className="pkg-sub">7+ Days Reservation</span>
                      </div>
                      <div className="package-card">
                        <span className="pkg-tag discount">20% OFF</span>
                        <span className="pkg-title">Monthly VIP</span>
                        <span className="pkg-sub">30+ Days Unlimited</span>
                      </div>
                    </div>

                    <div className="booking-action">
                      <button
                        onClick={handleOpenBookingForm}
                        className="action-button primary reserve-btn"
                        disabled={car.status !== "available"}
                      >
                        {car.status === "available" ? "Reserve Vehicle Now" : "Currently Unavailable"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Actions Bar */}
              <div className="car-action-secondary-row">
                <button
                  className={`action-pill-btn ${isInWishlist(car.id) ? "active" : ""}`}
                  onClick={() => toggleWishlist(rawCarData || car)}
                  type="button"
                >
                  <span className="btn-icon">{isInWishlist(car.id) ? "♥" : "♡"}</span>
                  {isInWishlist(car.id) ? "Saved in Wishlist" : "Save to Wishlist"}
                </button>
                <button
                  className={`action-pill-btn ${isInCompare(car.id) ? "active" : ""}`}
                  onClick={() => addToCompare(rawCarData || car)}
                  type="button"
                >
                  <span className="btn-icon">⚖</span>
                  {isInCompare(car.id) ? "In Comparison" : "Add to Compare"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications & Luxury Features Section */}
        <div className="car-details-description">
          <div className="description-header">
            <h2>About {car.title}</h2>
            <p className="description-text">{car.description}</p>
          </div>

          <h2 className="section-title">Technical Specifications</h2>
          <div className="specifications-grid">
            <div className="spec-card">
              <div className="spec-icon-box">📅</div>
              <div className="spec-details">
                <span className="spec-label">Model Year</span>
                <span className="spec-value">{car.year}</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon-box">⚡</div>
              <div className="spec-details">
                <span className="spec-label">Kilometers Driven</span>
                <span className="spec-value">{car.kmDriven?.toLocaleString("en-IN")} km</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon-box">🕹️</div>
              <div className="spec-details">
                <span className="spec-label">Transmission</span>
                <span className="spec-value">{car.transmission}</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon-box">🎨</div>
              <div className="spec-details">
                <span className="spec-label">Exterior Colour</span>
                <span className="spec-value">{car.colour}</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon-box">👑</div>
              <div className="spec-details">
                <span className="spec-label">Previous Owners</span>
                <span className="spec-value">{car.owners}</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon-box">⛽</div>
              <div className="spec-details">
                <span className="spec-label">Fuel Type</span>
                <span className="spec-value">{car.fuelType}</span>
              </div>
            </div>
            <div className="spec-card">
              <div className="spec-icon-box">🛡️</div>
              <div className="spec-details">
                <span className="spec-label">Availability Status</span>
                <span className={`spec-value ${car.status === "available" ? "available" : "not-available"}`}>
                  {car.status === "available" ? "Available" : "Not Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Executive Features & Amenities */}
          <div className="executive-amenities-section">
            <h2 className="section-title">Executive Amenities & Highlights</h2>
            <div className="amenities-grid">
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Bespoke Handcrafted Leather Interior</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>360° Surround View Camera System</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Adaptive Air Suspension & Sport Mode</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Premium Burmester / Bang & Olufsen Sound</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Panoramic Sky Roof & Ambient Lighting</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Ventilated & Heated Massage Seats</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Executive Chauffeur Package Ready</span>
              </div>
              <div className="amenity-item">
                <span className="amenity-check">✦</span>
                <span>Full Ceramic Coated Exterior Body</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="buy-page-enquiry-overlay">
          <div className="buy-page-enquiry-form-container">
            <button
              className="buy-page-close-button"
              onClick={() => setShowEnquiryForm(false)}
            >
              ×
            </button>
            <h2 className="buy-page-enquiry-title">Enquire About {selectedCar?.title}</h2>
            <form className="buy-page-enquiry-form" onSubmit={handleEnquirySubmit}>
              <div className="buy-page-form-group">
                <label htmlFor="name" className="buy-page-form-label">
                  Full Name
                </label>
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
                <label htmlFor="email" className="buy-page-form-label">
                  Email Address
                </label>
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
                <label htmlFor="phone" className="buy-page-form-label">
                  Phone Number
                </label>
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
                <label htmlFor="message" className="buy-page-form-label">
                  Message
                </label>
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

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="booking-form-modal-overlay">
          <div className="booking-form-modal">
            <div className="form-modal-header">
              <h2>Book Your Experience</h2>
              <button
                className="close-modal-button"
                onClick={handleCloseBookingForm}
              >
                ×
              </button>
            </div>
            <div className="form-modal-car-summary">
              <img src={car.images[0]} alt={car.title} className="form-car-thumbnail" />
              <div className="form-car-details">
                <h3>{car.title}</h3>
                <p className="form-car-category">{car.category}</p>
                <p className="form-car-price">
                  {car.rentPrice} <span className="form-price-interval">per day</span>
                </p>
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
                    min={new Date().toISOString().split("T")[0]} // Restrict to today or future
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
                    min={bookingData.pickupDate || new Date().toISOString().split("T")[0]} // After pickup or today
                    required
                  />
                </div>
              </div>

              {/* Live Price Calculator & Chauffeur Add-on */}
              <div className="booking-calculator-card">
                <div className="calc-row-header">
                  <span className="calc-title">Live Rental Breakdown</span>
                  <span className="calc-days-pill">{durationDays} {durationDays === 1 ? 'Day' : 'Days'}</span>
                </div>

                <label className="chauffeur-toggle">
                  <input
                    type="checkbox"
                    checked={withChauffeur}
                    onChange={(e) => setWithChauffeur(e.target.checked)}
                  />
                  <div className="chauffeur-text">
                    <span className="chauffeur-title">Dedicated Executive Chauffeur</span>
                    <span className="chauffeur-sub">Uniformed, vetted chauffeur (+₹3,500/day)</span>
                  </div>
                  <span className="chauffeur-amount">+₹{(3500 * durationDays).toLocaleString("en-IN")}</span>
                </label>

                <div className="calc-lines">
                  <div className="calc-line">
                    <span>Base Vehicle Rental ({durationDays}d × ₹{rawRent.toLocaleString("en-IN")})</span>
                    <span>₹{baseRentalTotal.toLocaleString("en-IN")}</span>
                  </div>
                  {withChauffeur && (
                    <div className="calc-line">
                      <span>Chauffeur Service ({durationDays}d)</span>
                      <span>₹{chauffeurFee.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="calc-line">
                    <span>Refundable Security Deposit (40%)</span>
                    <span>₹{deposit.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="calc-divider"></div>

                <div className="calc-total">
                  <span>Estimated Total Payable:</span>
                  <span className="calc-grand-price">₹{estimatedTotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="calc-footnote">
                  * Security deposit is 100% refundable upon vehicle return in original condition.
                </p>
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
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCloseBookingForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="confirm-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Confirm Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default CarDetails;
