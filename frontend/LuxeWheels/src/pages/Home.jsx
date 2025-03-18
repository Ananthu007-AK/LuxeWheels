import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import img1 from "./car.png";
import axios from "axios";

const CollectionCard = ({ image, title, price, id }) => {
  const imgSrc = image.startsWith('http') ? image : `http://localhost:5000${image}`;
  return (
    <div className="collection-card">
      <img src={imgSrc} alt={title} onError={(e) => console.log('Image load error:', e.target.src)} />
      <h3>{title}</h3>
      <p>{price}</p>
      <Link to={`/car/${id}`} className="collection-btn">View Details</Link>
    </div>
  );
};

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser ] = useState(null);
  const [cars, setCars] = useState([]); // State to hold car data

  useEffect(() => {
    const fetchUser  = async () => {
      const userName = localStorage.getItem("username");
      if (!userName) return;

      try {
        const res = await axios.get(`http://localhost:5000/user/${userName}`);
        setUser (res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchCars = async () => {
      try {
        const res = await axios.get('http://localhost:5000/cars'); // Fetch car data
        setCars(res.data); // Set car data to state
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchUser ();
    fetchCars(); // Call fetchCars when component mounts
  }, []);

  const filteredItems = cars.filter(car =>
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <title>Luxewheels - Where Elegance Meets The Road</title>
      <Navbar />

      <main>
        <section className="hero">
          {user ? (
            <>
              <h1>Welcome, {user.email}!</h1>
              <p>Discover your dream luxury car.</p>
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
          {filteredItems.map((car) => (
            <CollectionCard
              key={car.id}
              id={car.id}
              image={car.images[0] || img1} // Use the first image or a default image
              title={`${car.make} ${car.model}`} // Combine make and model for title
              price={`₹${Number(car.price).toLocaleString()}`} // Format price
            />
          ))}
        </div>
      </section>

      {/* Rest of the Home component remains the same */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
          Luxewheels is the place to be for all your luxury car needs. We offer
          a wide range of luxury cars for sale and rent. Our team of experts is
          dedicated to providing you with the best service possible. We are
          here to help you find the car of your dreams.
        </p>
      </section>

      <section className="services">
        <h2>Our Services</h2>
        <ul>
          <li>Luxury Car Rentals</li>
          <li>Car Sales</li>
          <li>Luxury Car Auctions</li>
          <li>Concierge Services</li>
          <li>Vehicle Maintenance and Care</li>
        </ul>
      </section>

            <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-card">
          <p>
            "Luxewheels provided an exceptional experience! The car was in
            pristine condition, and the service was top-notch."
          </p>
          <p>— John D., Business Executive</p>
        </div>
        <div className="testimonial-card">
          <p>
            "I rented a Rolls Royce for my wedding, and it was the highlight of
            the day. Highly recommend Luxewheels!"
          </p>
          <p>— Sarah L., Bride</p>
        </div>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <p>
          Have questions or need assistance? Reach out to us at:
          <br />
          Email: support@luxewheels.com
          <br />
          Phone: +1 (234) 567-890
        </p>
      </section>

      <footer>
        <p>&copy; 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default Home;