import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar"; // Import Navbar component
import img1 from "./car.png";
import img2 from "./car2.png";
import img3 from "./car3.png";
import img4 from "./car4.png";
import img5 from "./car5.png";

function Home() {
  return (
    <>
      <title>Luxewheels - Where Elegance Meets The Road</title>
      <Navbar /> {/* Use Navbar Component */}

      <main>
        <section className="hero">
          <h1>Where Elegance Meets The Road</h1>
          <input
            type="text"
            className="search-bar"
            placeholder="Tell us your dream..."
          />
          <div className="car-showcase">
            <img src={img1} alt="Luxury car showcase" className="car-image" />
          </div>
        </section>
      </main>

      <section className="Collection">
        <h2>Our Collection</h2>
        <div className="collection-cards">
          <div className="collection-card">
            <img src={img2} alt="Car" />
            <h3>VOLVO XC 90</h3>
            <p>₹62,00,000</p>
            <button className="collection-btn">View Product</button>
          </div>
          <div className="collection-card">
            <img src={img3} alt="Car" />
            <h3>MUSTANG GT</h3>
            <p>₹85,00,000</p>
            <button className="collection-btn">View Product</button>
          </div>
          <div className="collection-card">
            <img src={img4} alt="Car" />
            <h3>C43 AMG</h3>
            <p>₹75,00,000</p>
            <button className="collection-btn">View Product</button>
          </div>
          <div className="collection-card">
            <img src={img5} alt="Car" />
            <h3>ROLLS ROYCE GHOST SERIES</h3>
            <p>₹2,60,00,000</p>
            <button className="collection-btn">View Product</button>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About us</h2>
        <p>
          Luxewheels is the place to be for all your luxury car needs. We offer
          a wide range of luxury cars for sale and rent. We also offer a
          platform for you to sell your luxury car. Our team of experts is
          dedicated to providing you with the best service possible. We are
          here to help you find the car of your dreams.
        </p>
      </section>

      <footer>
        <p>&copy; 2025 Luxewheels</p>
      </footer>
    </>
  );
}

export default Home;
