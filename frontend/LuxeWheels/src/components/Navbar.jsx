import { Link } from "react-router-dom";
import '../pages/Home.css' // Add styles for the navbar if needed

const Navbar = () => {
  return (
    <nav className="navbar">
      <a href="/" className="logo">
        Luxewheels
      </a>
      <div className="nav-links">
        <Link to="#">Buy</Link>
        <Link to="/rent">Rent</Link>
        <Link to="/sell">Sell</Link>
        <Link to="#">About us</Link>
        <Link to="/Login">Login/Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
