import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Profile.css";
import userPlaceholder from "./user-placeholder.png";
import axios from "axios";

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
  const [rentals, setRentals] = useState([]); // New state for rentals
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ ...userData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");

    if (username && token) {
      setUser(username);
      fetchUserData();
      fetchRentals(); // Fetch rentals on mount
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
      setRentals([]); // Reset rentals
      setIsLoading(false);
    }
  }, []); // Empty dependency array, runs only on mount

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.get("http://localhost:5000/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      setUserData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        profilePhoto: data.profilePhoto || userPlaceholder,
      });
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        profilePhoto: data.profilePhoto || userPlaceholder,
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
  
      const response = await axios.get("http://localhost:5000/rentals/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setRentals(response.data); // Assuming response.data is an array of rentals
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
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        const token = localStorage.getItem("token");
        console.log('Updating profile with token:', token);
        console.log('Form data:', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        });
        const response = await axios.put(
          "http://localhost:5000/users/update",
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log('Update response:', response.data);
        setUserData({ ...formData, profilePhoto: userData.profilePhoto });
        alert(response.data.msg);
      } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
        alert("Failed to update profile. Please try again.");
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
      alert("Passwords don't match!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/user/change-password",
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

      alert("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error changing password:", error.response?.data || error.message);
      alert("Failed to change password. Please try again.");
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
              "http://localhost:5000/user/profile-photo",
              formDataToSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            setUserData({
              ...userData,
              profilePhoto: response.data.profilePhoto || newProfilePhoto,
            });
          } catch (error) {
            console.error("Error updating profile photo:", error.response?.data || error.message);
            alert("Failed to update profile photo. Please try again.");
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
              <span className="profile-detail-value">{rental.carId.title}</span>
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
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <title>Profile - Luxewheels</title>
      <Navbar user={user} setUser={setUser} onLogout={handleLogout} />

      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p className="profile-subtitle">Manage your account details</p>
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
                My Rentals
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
                  <h2>My Rentals</h2>
                </div>
                {renderRentals()}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer>
        <p>© 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default Profile;