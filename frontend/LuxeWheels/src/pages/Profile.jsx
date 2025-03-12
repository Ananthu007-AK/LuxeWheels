import React, { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import "./Profile.css";
import userPlaceholder from "./user-placeholder.png"; // Add a placeholder image to your project

function Profile() {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Luxury Lane, Beverly Hills, CA 90210",
    preferredCars: ["Rolls Royce", "Mercedes-Benz AMG", "Ferrari"],
    profilePhoto: userPlaceholder
  });
  
  const [formData, setFormData] = useState({
    ...userData
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const fileInputRef = useRef(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save the changes
      setUserData({...formData});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Here you would typically send the password change request to your backend
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        setFormData({
          ...formData,
          profilePhoto: event.target.result
        });
        
        // If not in editing mode, immediately update the profile photo
        if (!isEditing) {
          setUserData({
            ...userData,
            profilePhoto: event.target.result
          });
        }
      };
      
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const renderUserDetails = () => {
    if (isEditing) {
      return (
        <form className="profile-edit-form">
          <div className="profile-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="profile-form-group">
            <label htmlFor="preferredCars">Preferred Cars (comma-separated)</label>
            <input
              type="text"
              id="preferredCars"
              name="preferredCars"
              value={formData.preferredCars.join(", ")}
              onChange={(e) => {
                const carsArray = e.target.value.split(",").map(car => car.trim());
                setFormData({
                  ...formData,
                  preferredCars: carsArray
                });
              }}
            />
          </div>
        </form>
      );
    }

    return (
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
        <div className="profile-detail-item">
          <span className="profile-detail-label">Preferred Cars:</span>
          <ul className="profile-cars-list">
            {userData.preferredCars.map((car, index) => (
              <li key={index} className="profile-car-item">{car}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderPasswordChange = () => {
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

  return (
    <>
      <title>Profile - Luxewheels</title>
      <Navbar />

      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p className="profile-subtitle">Manage your account details and preferences</p>
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
              <h2 className="profile-name">{userData.name}</h2>
              <p className="profile-email">{userData.email}</p>
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
                className={`profile-nav-item ${activeTab === "preferences" ? "active" : ""}`}
                onClick={() => setActiveTab("preferences")}
              >
                Car Preferences
              </button>
              <button 
                className={`profile-nav-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Order History
              </button>
            </div>
          </div>

          <div className="profile-main">
            {activeTab === "details" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Personal Details</h2>
                  <button 
                    className="profile-edit-btn"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? "Save Changes" : "Edit Details"}
                  </button>
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

            {activeTab === "preferences" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Car Preferences</h2>
                </div>
                <div className="profile-preferences-container">
                  <p className="profile-placeholder-text">Your car preferences will be shown here.</p>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="profile-section">
                <div className="profile-section-header">
                  <h2>Order History</h2>
                </div>
                <div className="profile-orders-container">
                  <p className="profile-placeholder-text">Your order history will be shown here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer>
        <p>&copy; 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default Profile;