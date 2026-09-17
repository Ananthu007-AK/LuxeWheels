import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../../api/client';
import './CarCard.css';

const CarCard = ({ car, mode = 'both' }) => {
  const {
    _id,
    id,
    make,
    model,
    year,
    price,
    rent,
    images = [],
    status = 'available',
    fuelType = 'Petrol',
    transmission = 'Automatic',
    kmDriven,
  } = car;

  const carId = _id || id;
  const rawImage = images && images.length > 0 ? images[0] : null;

  let imageUrl = '/default-car.png';
  if (rawImage) {
    if (rawImage.startsWith('http')) {
      imageUrl = rawImage;
    } else {
      imageUrl = `${API_BASE_URL}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`;
    }
  }

  const formatPrice = (val) => {
    if (!val) return 'Contact';
    return `₹${Number(val).toLocaleString('en-IN')}`;
  };

  const statusClass = `lux-status-${status.toLowerCase()}`;

  return (
    <div className="lux-car-card">
      <div className="lux-card-img-wrap">
        <img
          src={imageUrl}
          alt={`${make} ${model}`}
          className="lux-card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-car.png';
          }}
        />
        <span className={`lux-card-status ${statusClass}`}>
          {status}
        </span>
      </div>

      <div className="lux-card-body">
        <h3 className="lux-card-title">{make} {model}</h3>

        <div className="lux-card-specs">
          {year && <span className="lux-spec-item">{year}</span>}
          {transmission && <span>• {transmission}</span>}
          {fuelType && <span>• {fuelType}</span>}
          {kmDriven !== undefined && <span>• {Number(kmDriven).toLocaleString()} km</span>}
        </div>

        <div className="lux-card-pricing">
          {mode === 'rent' ? (
            <div>
              <span className="lux-price-main">{formatPrice(rent || Math.round(price * 0.005) || 25000)}</span>
              <span className="lux-price-sub"> / day</span>
            </div>
          ) : (
            <div>
              <span className="lux-price-main">{formatPrice(price)}</span>
              {rent && <div className="lux-price-sub">or {formatPrice(rent)}/day rent</div>}
            </div>
          )}
        </div>

        <Link to={`/cars/${carId}`} className="lux-card-btn">
          View Specifications
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
          </button >
        </div >
      </div >

  {/* Car Showcase Image */ }
  < div className = "relative my-3 h-44 sm:h-48 w-full flex items-center justify-center z-10" >
    <img
      src={imageUrl}
      alt={`${make} ${model}`}
      className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = '/default-car.png';
      }}
    />
      </div >

  {/* Bottom Control & Info Bar */ }
  < div className = "pt-3 border-t border-gray-100 flex items-center justify-between mt-auto z-10 gap-2" >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#000000] text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
            LW
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#333333] leading-none">
              LuxeWheels <span className="text-blue-600 font-bold text-[10px]">✓</span>
            </span>
            <span className="block text-[10px] font-medium text-gray-400 mt-0.5">Verified Fleet</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            {mode === 'rent' ? (
              <div>
                <span className="text-base font-bold text-[#e63946]">
                  {formatPrice(rent || Math.round((price || 5000000) * 0.005) || 25000)}
                </span>
                <span className="text-[10px] font-medium text-gray-500">/day</span>
              </div>
            ) : mode === 'buy' ? (
              <span className="text-base font-bold text-[#e63946]">{formatPrice(price)}</span>
            ) : (
              <div>
                <span className="block text-base font-bold text-[#e63946]">{formatPrice(price)}</span>
                {rent && (
                  <span className="block text-[10px] font-bold text-gray-600">
                    or {formatPrice(rent)}/day
                  </span>
                )}
              </div>
            )}
          </div>

          {onBuyClick ? (
            <button
              onClick={() => onBuyClick(car)}
              className="px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-lg hover:bg-[#333333] transition-colors shadow-xs cursor-pointer border-0 uppercase tracking-wider"
            >
              Buy Now
            </button>
          ) : (
            <Link
              to={`/cars/${carId}`}
              className="px-4 py-2 bg-[#000000] text-white text-xs font-bold rounded-lg hover:bg-[#333333] transition-colors shadow-xs no-underline flex items-center gap-1 uppercase tracking-wider"
            >
              Details <span className="text-[10px]">→</span>
            </Link>
          )}
        </div>
      </div >
    </div >
  );
};

export default CarCard;
