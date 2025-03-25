import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import img1 from "./car.png";
import axios from "axios";

const CollectionCard = ({ image, title, price, _id }) => {
  const imgSrc = image.startsWith("http") ? image : `http://localhost:5000${image}`;
  return (
    <div className="collection-card">
      <img src={imgSrc} alt={title} onError={(e) => console.log("Image load error:", e.target.src)} />
      <h3>{title}</h3>
      <p>{price}</p>
      <Link to={`/cars/${_id}`} className="collection-btn">View Details</Link>
    </div>
  );
};

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Check if user is logged in
    const username = localStorage.getItem("username");
    if (username) {
      setUser(username);
    }

    // Fetch car data
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/cars");
        setCars(res.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  return (
    <>
      {/* Pass user and setUser to Navbar */}
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
                image={car.images[0] || img1}
                title={`${car.make} ${car.model}`}
                price={`₹${Number(car.price).toLocaleString()}`}
              />
            ))}
        </div>
      </section>
    </>
  );
}

export default Home;
