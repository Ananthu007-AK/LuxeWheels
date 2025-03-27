import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import img1 from "./car.png";
import axios from "axios";

const CollectionCard = ({ image, title, price, _id, status }) => {
  const imgSrc = image.startsWith("http") ? image : `http://localhost:5000${image}`;
  return (
    <div className={`collection-card ${status !== 'available' ? 'not-available' : ''}`}>
      <img src={imgSrc} alt={title} onError={(e) => console.log("Image load error:", e.target.src)} />
      <h3>{title}</h3>
      <p>{price}</p>
      <p className={`status ${status === 'available' ? 'available' : 'not-available'}`}>
        {status === 'available' ? 'Available' : 'Not Available'}
      </p>
      <Link to={`/cars/${_id}`} className="collection-btn">View Details</Link>
    </div>
  );
};

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUser(username);
    }

    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/cars"); // Update to 3003 if needed
        const formattedCars = res.data.map(car => ({
          _id: car._id,
          make: car.make,
          model: car.model,
          price: Number(car.price),
          images: car.images && car.images.length > 0 ? car.images : [img1],
          status: car.status,
        }));
        console.log("Fetched cars:", formattedCars);
        setCars(formattedCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <main>
        <section className="hero">
          {user ? (
            <>
              <h2>Welcome, {user}!</h2>
              <h1>Discover your dream luxury car.</h1>
            </>
          ) : (
            <>
              <h1>Where Elegance Meets The Road</h1>
              <input
                type="text"
                className="search-bar"
                placeholder="Tell us your dream..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="car-showcase">
                <img src={img1} alt="Luxury car showcase" className="car-image" />
              </div>
            </>
          )}
        </section>
      </main>

      <section className="Collection">
        <h2>Our Collection</h2>
        <div className="collection-cards">
          {cars
            .filter((car) =>
              car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
              car.model.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((car) => (
              <CollectionCard
                key={car._id}
                _id={car._id}
                image={car.images[0]}
                title={`${car.make} ${car.model}`}
                price={`₹${car.price.toLocaleString('en-IN')}`}
                status={car.status}
              />
            ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us">
        <h2>About Us</h2>
        <p>
          At Luxewheels, we believe that driving should be an experience, not just a necessity. Founded with a passion for luxury and performance, we bring you an exclusive collection of the world’s finest automobiles. Whether you’re looking to own a masterpiece or rent a dream ride, our mission is to deliver elegance, sophistication, and unparalleled service straight to your doorstep. With a commitment to quality and customer satisfaction, Luxewheels is your gateway to automotive excellence.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section company-info">
            <h3>Luxewheels</h3>
            <p>Experience luxury on wheels.</p>
            <p>Email: info@luxewheels.com</p>
            <p>Phone: +91 123-456-7890</p>
          </div>
          <div className="footer-section quick-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rent">Rent a Car</Link></li>
              <li><Link to="/buy">Buy a Car</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <p>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | 
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a> | 
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Luxewheels. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Home;