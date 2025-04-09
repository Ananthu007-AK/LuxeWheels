import { Link, useNavigate } from "react-router-dom";
import '../pages/Home.css';
import { Link as ScrollLink } from "react-scroll";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  const handleProfileClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent default Link behavior
      navigate("/login"); // Redirect to login page if user is not logged in
    }
    // If user is logged in, the Link will proceed to "/profile" normally
  };

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        Luxewheels
      </a>
      <div className="nav-links">
        <Link to="/buy">Buy</Link>
        <Link to="/rent">Rent</Link>
        <Link to="/sell">Sell</Link>
        <ScrollLink to="about" smooth={true} duration={500}>About us</ScrollLink>
        <Link to="/profile" onClick={handleProfileClick}>Profile</Link>

        {user ? (
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        ) : (
          <Link to="/login">Login/Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;