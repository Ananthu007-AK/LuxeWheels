import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../pages/Home.css';
import { useAuth } from "../context/AuthContext";

const Navbar = ({ user: propUser, setUser: propSetUser }) => {
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = propUser !== undefined ? propUser : authUser;

  const handleLogout = () => {
    logout();
    if (propSetUser) propSetUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const handleProfileClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      navigate("/login");
    }
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        Luxewheels
      </Link>

      <button
        className="mobile-nav-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/buy" onClick={() => setMenuOpen(false)}>Buy</Link>
        <Link to="/rent" onClick={() => setMenuOpen(false)}>Rent</Link>
        <Link to="/sell" onClick={() => setMenuOpen(false)}>Sell</Link>
        <Link to="/profile" onClick={handleProfileClick}>Profile</Link>

        {currentUser ? (
          <button onClick={handleLogout} className="logout-btn">Logout ({currentUser})</button>
        ) : (
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login/Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
