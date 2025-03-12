import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import img1 from "./car.png";
import img2 from "./car2.png";
import img3 from "./car3.png";
import img4 from "./car4.png";
import img5 from "./car5.png";

const CollectionCard = ({ image, title, price, id }) => {
  return (
    <div className="collection-card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{price}</p>
      <Link to={`/car/${id}`} className="collection-btn">View Details</Link>
    </div>
  );
};

function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const collectionItems = [
    { id: 0, image: img2, title: "VOLVO XC 90", price: "₹62,00,000" },
    { id: 1, image: img3, title: "MUSTANG GT", price: "₹85,00,000" },
    { id: 2, image: img4, title: "C43 AMG", price: "₹75,00,000" },
    { id: 3, image: img5, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000" },
    { id: 4, image: img5, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000" },
    { id: 5, image: img5, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000" },
    { id: 6, image: img5, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000" },
    { id: 7, image: img5, title: "ROLLS ROYCE GHOST SERIES", price: "₹2,60,00,000" },
    // Add more items as needed
  ];

  const filteredItems = collectionItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <title>Luxewheels - Where Elegance Meets The Road</title>
      <Navbar />

      <main>
        <section className="hero">
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
        </section>
      </main>

      <section className="Collection">
        <h2>Our Collection</h2>
        <div className="collection-cards">
          {filteredItems.map((item) => (
            <CollectionCard
              key={item.id}
              id={item.id}
              image={item.image}
              title={item.title}
              price={item.price}
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