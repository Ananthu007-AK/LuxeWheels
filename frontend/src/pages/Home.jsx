import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import img1 from "./car.png";
import client, { API_BASE_URL } from "../api/client";

const CollectionCard = ({ image, title, price, _id, status }) => {
  const imgSrc = image
    ? image.startsWith("http")
      ? image
      : `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`
    : img1;

  return (
    <div className={`collection-card ${status !== 'available' ? 'not-available' : ''}`}>
      <img
        src={imgSrc}
        alt={title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = img1;
        }}
      />
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
  const navigate = useNavigate();
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
        const res = await client.get("/cars");
        const formattedCars = res.data.map((car) => ({
          _id: car._id,
          make: car.make,
          model: car.model,
          price: Number(car.price),
          images: car.images && car.images.length > 0 ? car.images : [img1],
          status: car.status || 'available',
        }));
        setCars(formattedCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      }
    };

    fetchCars();
  }, []);

  const scrollToCollection = () => {
    const el = document.getElementById("collection-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <main>
        <section className="hero">
          {user ? (
            <div className="hero-greeting">
              <h2 className="welcome-tag">Welcome back, {user}</h2>
              <h1>Discover your dream luxury car.</h1>
            </div>
          ) : (
            <h1>Where Elegance Meets The Road</h1>
          )}

          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Tell us your dream car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.trim() !== "" && (
              <div className="search-results-dropdown">
                {filteredCars.length > 0 ? (
                  filteredCars.slice(0, 5).map((car) => (
                    <div
                      key={car._id}
                      className="search-dropdown-item"
                      onClick={() => navigate(`/cars/${car._id}`)}
                    >
                      <img
                        src={
                          car.images && car.images[0]
                            ? car.images[0].startsWith("http")
                              ? car.images[0]
                              : `${API_BASE_URL}${car.images[0].startsWith("/") ? "" : "/"}${car.images[0]}`
                            : img1
                        }
                        alt={`${car.make} ${car.model}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = img1;
                        }}
                      />
                      <div className="search-item-details">
                        <span className="search-item-name">{car.make} {car.model}</span>
                        <span className="search-item-price">₹{car.price.toLocaleString("en-IN")}</span>
                      </div>
                      <span className={`search-item-badge ${car.status === "available" ? "avail" : "booked"}`}>
                        {car.status === "available" ? "Available" : "Booked"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="search-dropdown-empty">
                    No luxury cars found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="car-showcase">
            <img src={img1} alt="Luxury car showcase" className="car-image" />
          </div>

          <div className="hero-scroll-prompt" onClick={scrollToCollection} role="button" tabIndex={0}>
            <span>Explore Collection</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </section>
      </main>

      <section className="Collection" id="collection-section">
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
      <section className="about-us" id="about">
        <h2>About Us</h2>
        <p>
          At Luxewheels, we believe that driving should be an experience, not just a necessity. Founded with a passion for luxury and performance, we bring you an exclusive collection of the world’s finest automobiles. Whether you’re looking to own a masterpiece or rent a dream ride, our mission is to deliver elegance, sophistication, and unparalleled service straight to your doorstep. With a commitment to quality and customer satisfaction, Luxewheels is your gateway to automotive excellence.
        </p>
      </section>

      <Footer />
    </>
  );
}

export default Home;

