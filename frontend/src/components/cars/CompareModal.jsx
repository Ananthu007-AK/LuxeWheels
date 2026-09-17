import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { API_BASE_URL } from '../../api/client';
import defaultCarImg from '../../pages/car.png';
import './Compare.css';

const CompareModal = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    isModalOpen,
    setIsModalOpen,
  } = useCompare();

  if (compareList.length === 0) return null;

  const getImgUrl = (car) => {
    if (!car) return defaultCarImg;
    let raw = null;
    if (Array.isArray(car.images) && car.images.length > 0) {
      raw = car.images[0];
    } else if (typeof car.image === 'string' && car.image) {
      raw = car.image;
    } else if (typeof car.img === 'string' && car.img) {
      raw = car.img;
    }

    if (!raw) return defaultCarImg;
    if (typeof raw !== 'string') return defaultCarImg;
    if (raw.startsWith('http') || raw.startsWith('data:') || raw.startsWith('blob:')) return raw;
    if (raw.startsWith('/src') || raw.startsWith('/assets') || raw.includes('car.png') || raw.includes('default-car')) {
      return raw;
    }
    const cleanPath = raw.startsWith('/') ? raw : `/${raw}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  return (
    <>
      {/* Floating Bottom Bar */}
      <div className="lux-compare-bar">
        <div className="lux-compare-items">
          <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Compare:</span>
          {compareList.map((car) => (
            <div key={car._id || car.id} className="lux-compare-chip">
              <img
                src={getImgUrl(car)}
                alt={car.make}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultCarImg;
                }}
              />
              <span>{car.make} {car.model}</span>
              <button
                className="lux-compare-chip-remove"
                onClick={() => removeFromCompare(car._id || car.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="lux-compare-actions">
          <button
            className="lux-compare-btn-open"
            onClick={() => setIsModalOpen(true)}
          >
            Compare ({compareList.length})
          </button>
          <button className="lux-compare-btn-clear" onClick={clearCompare}>
            Clear
          </button>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <div className="lux-compare-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="lux-compare-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lux-compare-modal-header">
              <h2>Side-by-Side Fleet Comparison</h2>
              <button
                className="lux-compare-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <table className="lux-compare-table">
              <thead>
                <tr>
                  <th>Specification</th>
                  {compareList.map((car) => (
                    <th key={car._id || car.id} className="lux-compare-car-col">
                      <img
                        src={getImgUrl(car)}
                        alt={`${car.make} ${car.model}`}
                        className="lux-compare-car-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultCarImg;
                        }}
                      />
                      <div className="lux-compare-car-name">{car.make} {car.model}</div>
                      <Link
                        to={`/cars/${car._id || car.id}`}
                        className="lux-compare-view-link"
                        onClick={() => setIsModalOpen(false)}
                      >
                        View Full Specs
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Purchase Price</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id} style={{ fontWeight: 'bold', color: '#0056b3' }}>
                      ₹{Number(car.price || 0).toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Daily Rental Rate</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id} style={{ fontWeight: 'bold' }}>
                      ₹{Number(car.rent || Math.round(Number(car.price || 0) * 0.005) || 25000).toLocaleString('en-IN')} / day
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Year of Manufacture</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id}>{car.year || 'N/A'}</td>
                  ))}
                </tr>
                <tr>
                  <td>Transmission</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id} style={{ textTransform: 'capitalize' }}>
                      {car.transmission || 'Automatic'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Fuel Architecture</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id} style={{ textTransform: 'capitalize' }}>
                      {car.fuelType || 'Petrol'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Kilometers Driven</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id}>
                      {Number(car.kmDriven || 0).toLocaleString()} km
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Exterior Color</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id}>{car.colour || 'Factory Spec'}</td>
                  ))}
                </tr>
                <tr>
                  <td>Previous Owners</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id}>{car.owners || 1}</td>
                  ))}
                </tr>
                <tr>
                  <td>Fleet Availability</td>
                  {compareList.map((car) => (
                    <td key={car._id || car.id}>
                      <span
                        style={{
                          color: (car.status || 'available') === 'available' ? '#28a745' : '#dc3545',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}
                      >
                        {car.status || 'Available'}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default CompareModal;
