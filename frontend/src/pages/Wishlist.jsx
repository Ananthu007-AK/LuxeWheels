import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import './Wishlist.css';

const Wishlist = () => {
  const [user, setUser] = useState(null);
  const { wishlist, removeFromWishlist } = useWishlist();
  const { isInCompare, addToCompare } = useCompare();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setUser(username);
    }
  }, []);

  const resolveImg = (car) => {
    const raw = car.images && car.images.length > 0 ? car.images[0] : null;
    if (!raw) return '/default-car.png';
    if (raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('blob:')) return raw;
    if (raw.startsWith('/src') || raw.startsWith('/assets') || raw.includes('default-car')) return raw;
    return `http://localhost:9000${raw.startsWith('/') ? '' : '/'}${raw}`;
  };

  return (
    <div className="wishlist-page-wrapper">
      <Navbar user={user} setUser={setUser} />

      <section className="wishlist-hero-section">
        <h1 className="wishlist-hero-title">My Saved Fleet</h1>
        <p className="wishlist-hero-subtitle">
          Your personal collection of bookmarked luxury and exotic motorcars
        </p>
      </section>

      <div className="wishlist-content-container">
        {wishlist.length === 0 ? (
          <div className="wishlist-empty-state">
            <div className="empty-heart-icon">♡</div>
            <h2>Your Wishlist is Empty</h2>
            <p>You haven't saved any luxury vehicles yet. Explore our fleet and click the heart icon on any vehicle to bookmark it here.</p>
            <div className="empty-action-buttons">
              <Link to="/rent" className="wishlist-explore-btn">
                Browse Rental Fleet
              </Link>
              <Link to="/buy" className="wishlist-explore-btn secondary">
                Explore For Sale
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="wishlist-header-row">
              <span className="wishlist-count-label">
                {wishlist.length} {wishlist.length === 1 ? 'Vehicle' : 'Vehicles'} Bookmarked
              </span>
            </div>

            <div className="wishlist-vehicles-grid">
              {wishlist.map((car) => {
                const carId = car._id || car.id;
                const isComp = isInCompare(carId);

                return (
                  <div key={carId} className="wishlist-card">
                    <div className="wishlist-card-media">
                      <img
                        src={resolveImg(car)}
                        alt={car.name || `${car.make} ${car.model}`}
                        className="wishlist-card-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-car.png';
                        }}
                      />
                      <button
                        className="wishlist-card-remove-btn"
                        onClick={() => removeFromWishlist(carId)}
                        title="Remove from wishlist"
                      >
                        ×
                      </button>
                    </div>

                    <div className="wishlist-card-info">
                      <h3 className="wishlist-car-title">
                        {car.make} {car.model}
                      </h3>

                      <div className="wishlist-rates-box">
                        {car.rent && (
                          <div className="wishlist-rate-item">
                            <span className="rate-lbl">Rental:</span>
                            <span className="rate-val">₹{Number(car.rent).toLocaleString('en-IN')}/day</span>
                          </div>
                        )}
                        {car.price && (
                          <div className="wishlist-rate-item">
                            <span className="rate-lbl">Buy:</span>
                            <span className="rate-val">₹{Number(car.price).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>

                      <div className="wishlist-car-tags">
                        {car.year && <span className="wishlist-tag">{car.year}</span>}
                        {car.transmission && <span className="wishlist-tag">{car.transmission}</span>}
                        {car.fuelType && <span className="wishlist-tag">{car.fuelType}</span>}
                      </div>

                      <div className="wishlist-card-actions">
                        <Link to={`/cars/${carId}`} className="wishlist-view-btn">
                          View & Reserve
                        </Link>
                        <button
                          className={`wishlist-compare-btn ${isComp ? 'active' : ''}`}
                          onClick={() => addToCompare(car)}
                          title="Compare vehicle"
                        >
                          ⚖ {isComp ? 'In Compare' : 'Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
