import { Link } from "react-router-dom";
import '../pages/Home.css' // Add styles for the navbar if needed
import { Link as ScrollLink} from "react-scroll"; // Import Link from react-scroll

const Navbar = () => {
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
        <Link to="/Login">Login/Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
