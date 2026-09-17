import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../pages/Home.css';
import { useWishlist } from "../context/WishlistContext";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    if (setUser) setUser(null);
    navigate("/");
  };

  const handleProfileClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className={`navbar fixed-navbar ${isScrolled ? "scrolled" : "top-stage"}`}>
      <Link to="/" className="logo">
        Luxewheels
      </Link>

      <button
        className="mobile-nav-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Navigation Menu"
      >
        ☰
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? "open" : ""}`}>
        <Link to="/buy" onClick={() => setIsMobileMenuOpen(false)}>Buy</Link>
        <Link to="/rent" onClick={() => setIsMobileMenuOpen(false)}>Rent</Link>
        <Link to="/sell" onClick={() => setIsMobileMenuOpen(false)}>Sell</Link>
        <Link to="/wishlist" className="nav-wishlist-btn" onClick={() => setIsMobileMenuOpen(false)}>
          Wishlist
          {wishlist && wishlist.length > 0 && (
            <span className="wishlist-counter-badge">{wishlist.length}</span>
          )}
        </Link>
        <Link to="/profile" onClick={(e) => { setIsMobileMenuOpen(false); handleProfileClick(e); }}>
          Profile
        </Link>

        {user ? (
          <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="logout-btn">
            Logout
          </button>
        ) : (
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login/Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

