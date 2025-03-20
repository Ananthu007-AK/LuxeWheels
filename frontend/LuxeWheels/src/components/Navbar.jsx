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
        <Link to="/profile">Profile</Link>

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
