import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Profile.css";
import userPlaceholder from "./user-placeholder.png";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";

function Profile() {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePhoto: userPlaceholder,
  });
  const [rentals, setRentals] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [receiptRental, setReceiptRental] = useState(null);

  const { showToast } = useToast();
  const { wishlist, removeFromWishlist } = useWishlist();

  const fileInputRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (username && token) {
      setUser(username);
      fetchUserData();
      fetchRentals();
    } else {
      setUser(null);
      setUserData({
        name: "",
        email: "",
        phone: "",
        address: "",
        profilePhoto: userPlaceholder,
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        profilePhoto: userPlaceholder,
      });
      setRentals([]);
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:9000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      const profilePhotoUrl = data.profilePhoto
        ? `http://localhost:9000${data.profilePhoto}`
        : userPlaceholder;
      setUserData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        profilePhoto: profilePhotoUrl,
      });
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        profilePhoto: profilePhotoUrl,
      });
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:9000/rentals/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRentals(response.data);
    } catch (error) {
      console.error("Error fetching rentals:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setUserData({
      name: "",
      email: "",
      phone: "",
      address: "",
      profilePhoto: userPlaceholder,
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      profilePhoto: userPlaceholder,
    });
    setRentals([]);
    showToast("You have been signed out.", "info");
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("address", formData.address);
        if (formData.profilePhoto !== userData.profilePhoto && formData.profilePhoto.startsWith('data:')) {
          const file = await fetch(formData.profilePhoto).then(r => r.blob());
          formDataToSend.append("profilePhoto", file, "profile.jpg");
        }

        const response = await axios.put(
          "http://localhost:9000/users/update",
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({ ...formData, profilePhoto: response.data.user.profilePhoto || formData.profilePhoto });
        showToast(response.data.msg || "Profile updated successfully!", "success");
      } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
        showToast("Failed to update profile. Please try again.", "error");
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords don't match!", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:9000/user/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showToast("Password updated successfully!", "success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      showToast("Failed to change password. Please try again.", "error");
    }
  };

  const handlePhotoClick = () => fileInputRef.current.click();

  const handlePhotoChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const newProfilePhoto = event.target.result;
        setFormData({ ...formData, profilePhoto: newProfilePhoto });

        if (!isEditing) {
          try {
            const token = localStorage.getItem("token");
            const formDataToSend = new FormData();
            formDataToSend.append("profilePhoto", file);

            const response = await axios.post(
              "http://localhost:9000/users/profile-photo",
              formDataToSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const serverPhotoUrl = `http://localhost:9000${response.data.profilePhoto}`;
            setUserData({
              ...userData,
              profilePhoto: serverPhotoUrl || newProfilePhoto,
            });
            showToast("Profile photo updated!", "success");
          } catch (error) {
            console.error("Error updating profile photo:", error.response?.data || error.message);
            showToast("Failed to update profile photo.", "error");
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const renderUserDetails = () => {
    if (isLoading) return <div className="profile-loading">Loading user data...</div>;
    if (!user) return <div className="profile-loading">Please log in to view your profile.</div>;

    return isEditing ? (
      <form className="profile-edit-form">
        <div className="profile-form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="profile-form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="profile-form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div className="profile-form-group">
          <label htmlFor="address">Address</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleInputChange}></textarea>
        </div>
      </form>
    ) : (
      <div className="profile-details-container">
        <div className="profile-detail-item">
          <span className="profile-detail-label">Name:</span>
          <span className="profile-detail-value">{userData.name}</span>
        </div>
        <div className="profile-detail-item">
          <span className="profile-detail-label">Email:</span>
          <span className="profile-detail-value">{userData.email}</span>
        </div>
        <div className="profile-detail-item">
          <span className="profile-detail-label">Phone:</span>
          <span className="profile-detail-value">{userData.phone}</span>
        </div>
        <div className="profile-detail-item">
          <span className="profile-detail-label">Address:</span>
          <span className="profile-detail-value">{userData.address}</span>
        </div>
      </div>
    );
  };

  const renderPasswordChange = () => {
    if (isLoading) return <div className="profile-loading">Loading user data...</div>;
    if (!user) return <div className="profile-loading">Please log in to change your password.</div>;

    return (
      <form className="profile-password-form" onSubmit={handlePasswordSubmit}>
        <div className="profile-form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="profile-form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="profile-form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div className="profile-form-actions">
          <button type="submit" className="profile-password-save-btn">Update Password</button>
        </div>
      </form>
    );
  };

  const renderRentals = () => {
    if (isLoading) return <div className="profile-loading">Loading rentals...</div>;
    if (!user) return <div className="profile-loading">Please log in to view your rentals.</div>;
    if (rentals.length === 0) return <div className="profile-loading">No rentals found.</div>;

    return (
      <div className="profile-rentals-container">
        {rentals.map((rental) => (
          <div key={rental._id} className="profile-rental-item">
            <div className="profile-rental-detail">
              <span className="profile-detail-label">Car:</span>
              <span className="profile-detail-value">{rental.carId?.title || 'Luxury Vehicle'}</span>
            </div>
            <div className="profile-rental-detail">
              <span className="profile-detail-label">Pick-up Date:</span>
              <span className="profile-detail-value">{new Date(rental.pickupDate).toLocaleDateString()}</span>
            </div>
            <div className="profile-rental-detail">
              <span className="profile-detail-label">Return Date:</span>
              <span className="profile-detail-value">{new Date(rental.returnDate).toLocaleDateString()}</span>
            </div>
            <div className="profile-rental-detail">
              <span className="profile-detail-label">Status:</span>
              <span className={`profile-detail-value ${rental.status}`}>{rental.status}</span>
            </div>
            {rental.specialRequests && (
              <div className="profile-rental-detail">
                <span className="profile-detail-label">Special Requests:</span>
                <span className="profile-detail-value">{rental.specialRequests}</span>
              </div>
            )}
            <div>
              <button
                className="profile-receipt-btn"
                onClick={() => setReceiptRental(rental)}
                type="button"
              >
                📄 View & Print Booking Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWishlist = () => {
    if (wishlist.length === 0) {
      return (
        <div className="profile-loading" style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ fontSize: "1.1rem", marginBottom: "15px" }}>You have no saved vehicles in your wishlist.</p>
          <Link
            to="/rent"
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "#000",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "600"
            }}
          >
            Browse Luxury Collection
          </Link>
        </div>
      );
    }

    return (
      <div className="profile-wishlist-grid">
        {wishlist.map((car) => {
          const carId = car._id || car.id;
          const imageSrc =
            car.images && car.images.length > 0
              ? car.images[0].startsWith("http")
                ? car.images[0]
                : `http://localhost:9000${car.images[0]}`
              : "/default-car.png";

          return (
            <div key={carId} className="profile-wishlist-card">
              <img src={imageSrc} alt={car.name || car.title} className="profile-wishlist-img" />
              <div className="profile-wishlist-content">
                <h4 className="profile-wishlist-title">{car.name || car.title || `${car.make} ${car.model}`}</h4>
                <p className="profile-wishlist-rate">
                  {car.rent
                    ? `₹${Number(car.rent).toLocaleString("en-IN")}/day`
                    : car.price
                      ? `₹${Number(car.price).toLocaleString("en-IN")}`
                      : "Luxury Vehicle"}
                </p>
                <div className="profile-wishlist-actions">
                  <Link to={`/cars/${carId}`} className="profile-wishlist-view-btn">
                    View & Book
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(carId)}
                    className="profile-wishlist-remove-btn"
                    title="Remove from saved"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Navbar user={user} setUser={setUser} onLogout={handleLogout} />

      <div className="profile-container">
        <div className="profile-header">
          <h1>Client Portfolio</h1>
          <p className="profile-subtitle">Manage your credentials, reservations, and saved fleet</p>
        </div>

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-avatar-container">
              <div className="profile-avatar-wrapper">
                <img
                  src={isEditing ? formData.profilePhoto : userData.profilePhoto}
                  alt="Profile"
                  className="profile-avatar"
                  onClick={handlePhotoClick}
                />
                <div className="profile-avatar-overlay" onClick={handlePhotoClick}>
                  <span className="profile-avatar-edit-icon">✏️</span>
                  <span className="profile-avatar-edit-text">Edit</span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="profile-avatar-input"
                />
              </div>
              {!isLoading && user && (
                <>
                  <h2 className="profile-name">{userData.name}</h2>
                  <p className="profile-email">{userData.email}</p>
                </>
              )}
            </div>
            <div className="profile-navigation">
              <button
                className={`profile-nav-item ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Personal Details
              </button>
              <button
                className={`profile-nav-item ${activeTab === "password" ? "active" : ""}`}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </button>
              <button
                className={`profile-nav-item ${activeTab === "rentals" ? "active" : ""}`}
                onClick={() => setActiveTab("rentals")}
              >
                My Rentals ({rentals.length})
              </button>
              <button
                className={`profile-nav-item ${activeTab === "wishlist" ? "active" : ""}`}
                onClick={() => setActiveTab("wishlist")}
              >
                Saved Vehicles ({wishlist.length})
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === "details" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Personal Details</h2>
                  {!isLoading && user && (
                    <button className="profile-edit-btn" onClick={handleEditToggle}>
                      {isEditing ? "Save Changes" : "Edit Details"}
                    </button>
                  )}
                </div>
                {renderUserDetails()}
              </div>
            )}

            {activeTab === "password" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Change Password</h2>
                </div>
                {renderPasswordChange()}
              </div>
            )}

            {activeTab === "rentals" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>My Rental Agreements</h2>
                </div>
                {renderRentals()}
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Saved Fleet</h2>
                </div>
                {renderWishlist()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Printable Booking Receipt Modal */}
      {receiptRental && (
        <div className="receipt-modal-backdrop" onClick={() => setReceiptRental(null)}>
          <div className="receipt-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-header-banner">
              <div>
                <h2 className="receipt-brand-logo">LUXEWHEELS</h2>
                <p className="receipt-brand-sub">Official Rental Confirmation & Invoice</p>
              </div>
              <button className="receipt-close-btn" onClick={() => setReceiptRental(null)}>
                ×
              </button>
            </div>
            <div className="receipt-body">
              <div className="receipt-meta-grid">
                <div className="receipt-meta-item">
                  <strong>Booking Reference</strong>
                  <span>LUX-{(receiptRental._id || "").slice(-6).toUpperCase()}</span>
                </div>
                <div className="receipt-meta-item">
                  <strong>Agreement Status</strong>
                  <span
                    style={{
                      textTransform: "uppercase",
                      color: receiptRental.status === "approved" ? "#16a34a" : "#d97706",
                    }}
                  >
                    {receiptRental.status || "Pending Confirmation"}
                  </span>
                </div>
                <div className="receipt-meta-item">
                  <strong>Client Name</strong>
                  <span>{receiptRental.name || userData.name}</span>
                </div>
                <div className="receipt-meta-item">
                  <strong>Client Contact</strong>
                  <span>{receiptRental.phone || userData.phone}</span>
                </div>
              </div>

              <div className="receipt-item-box">
                <h3 className="receipt-item-title">{receiptRental.carId?.title || "Luxury Automobile"}</h3>
                <p className="receipt-item-specs">
                  Pick-up: {new Date(receiptRental.pickupDate).toLocaleDateString("en-IN")} &nbsp;|&nbsp;
                  Return: {new Date(receiptRental.returnDate).toLocaleDateString("en-IN")}
                </p>
                {receiptRental.specialRequests && (
                  <p style={{ fontSize: "0.82rem", color: "#555", marginTop: "8px", lineHeight: "1.4" }}>
                    <strong>Add-ons & Notes:</strong> {receiptRental.specialRequests}
                  </p>
                )}
              </div>

              <div className="receipt-totals">
                <div className="receipt-row">
                  <span>Security Deposit:</span>
                  <span>100% Refundable</span>
                </div>
                <div className="receipt-row">
                  <span>Concierge & Insurance:</span>
                  <span>Complimentary</span>
                </div>
                <div className="receipt-row receipt-grand">
                  <span>Booking Verification:</span>
                  <span>{receiptRental.status === "approved" ? "CONFIRMED" : "RESERVED"}</span>
                </div>
              </div>

              <div className="receipt-footer-actions">
                <button className="receipt-print-btn" onClick={() => window.print()}>
                  🖨️ Print / Save Receipt PDF
                </button>
                <button className="receipt-dismiss-btn" onClick={() => setReceiptRental(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Profile;

