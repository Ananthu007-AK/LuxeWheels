import React from 'react';
import './FilterBar.css';

const FilterBar = ({
  maxPrice,
  setMaxPrice,
  priceLimit = 50000000,
  priceLabel = "Max Price",
  isRent = false,
  transmission,
  setTransmission,
  fuelType,
  setFuelType,
  sortBy,
  setSortBy,
  onReset,
}) => {
  const formatPrice = (val) => {
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  return (
    <div className="lux-filter-bar">
      <div className="lux-filter-row">
        {/* Price Slider */}
        <div className="lux-filter-group">
          <div className="lux-filter-label">
            <span>{priceLabel}</span>
            <span className="lux-filter-val">{formatPrice(maxPrice)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={priceLimit}
            step={isRent ? 1000 : 100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="lux-filter-slider"
          />
        </div>

        {/* Transmission Pills */}
        <div className="lux-filter-group">
          <div className="lux-filter-label">Transmission</div>
          <div className="lux-filter-pills">
            {['all', 'automatic', 'manual'].map((t) => (
              <button
                key={t}
                type="button"
                className={`lux-filter-pill ${transmission === t ? 'active' : ''}`}
                onClick={() => setTransmission(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Type Pills */}
        <div className="lux-filter-group">
          <div className="lux-filter-label">Fuel Architecture</div>
          <div className="lux-filter-pills">
            {['all', 'petrol', 'diesel', 'electric', 'hybrid'].map((f) => (
              <button
                key={f}
                type="button"
                className={`lux-filter-pill ${fuelType === f ? 'active' : ''}`}
                onClick={() => setFuelType(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Select */}
        <div className="lux-filter-group" style={{ minWidth: '160px', flex: '0 1 auto' }}>
          <div className="lux-filter-label">Sort By</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="lux-filter-select"
          >
            <option value="default">Default Spec</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Newest Year</option>
          </select>
        </div>

        {/* Reset Button */}
        {onReset && (
          <button type="button" className="lux-filter-reset-btn" onClick={onReset}>
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
