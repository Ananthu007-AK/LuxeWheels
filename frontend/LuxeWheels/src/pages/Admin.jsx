import React, { useState } from 'react';
import './Admin.css';
import axios from 'axios';

function Admin() {
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    status: 'available',
    images: [],
    transmission: 'automatic',
    kmDriven: '',
    colour: '',
    owners: '',
    fuelType: 'petrol'
  });

  const [userListings, setUserListings] = useState([
    { 
      id: 1, 
      userId: 1,
      userName: 'John Doe', 
      make: 'Toyota', 
      model: 'Camry', 
      year: '2022', 
      price: '25000',
      images: [],
      transmission: 'automatic',
      kmDriven: '30000',
      colour: 'Silver',
      owners: '1',
      fuelType: 'petrol',
      status: 'pending' 
    },
    { 
      id: 2, 
      userId: 2,
      userName: 'Jane Smith', 
      make: 'Honda', 
      model: 'Civic', 
      year: '2021', 
      price: '22000',
      images: [],
      transmission: 'manual',
      kmDriven: '45000',
      colour: 'Blue',
      owners: '2',
      fuelType: 'petrol',
      status: 'pending' 
    }
  ]);

  const [enquiries, setEnquiries] = useState([
    { id: 1, user: 'Mike Johnson', car: 'BMW X5', message: 'Is this still available?', date: '2025-03-15' }
  ]);

  const [rentals, setRentals] = useState([
    { id: 1, car: 'Mercedes S-Class 2023', renter: 'Sarah Williams', startDate: '2025-03-14', endDate: '2025-03-21', status: 'active' },
    { id: 2, car: 'Tesla Model 3 2022', renter: 'James Brown', startDate: '2025-03-15', endDate: '2025-03-18', status: 'active' }
  ]);

  const [cars, setCars] = useState([
    { id: 1, make: 'Porsche', model: '911', year: '2023', price: '128500', status: 'available', images: [], transmission: 'automatic', kmDriven: '5000', colour: 'Black', owners: '1', fuelType: 'petrol' },
    { id: 2, make: 'Ferrari', model: 'F8', year: '2022', price: '315000', status: 'reserved', images: [], transmission: 'automatic', kmDriven: '12000', colour: 'Red', owners: '2', fuelType: 'petrol' }
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', registered: '2025-01-15', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', registered: '2025-02-01', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', registered: '2025-02-20', status: 'active' }
  ]);

  const [activeSection, setActiveSection] = useState('dashboard');

  const handleAddCar = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('make', newCar.make);
    formData.append('model', newCar.model);
    formData.append('year', newCar.year);
    formData.append('price', newCar.price);
    formData.append('status', newCar.status);
    formData.append('transmission', newCar.transmission);
    formData.append('kmDriven', newCar.kmDriven);
    formData.append('colour', newCar.colour);
    formData.append('owners', newCar.owners);
    formData.append('fuelType', newCar.fuelType);
  
    // Append images to formData
    newCar.images.forEach(image => {
      formData.append('images', image); // Append each image file
    });
  
    try {
      const response = await axios.post('http://localhost:5000/cars/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      setCars([...cars, response.data.car]); // Update local state with the new car
      setNewCar({ /* reset newCar state */ });
      setActiveSection('dashboard');
    } catch (error) {
      console.error('Error adding car:', error);
      alert('Failed to add car. Please try again.');
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    
    if (files.length + newCar.images.length > maxImages) {
      alert(`You can upload a maximum of ${maxImages} images`);
      return;
    }

    const validImages = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    const newImages = validImages.map(file => URL.createObjectURL(file));
    setNewCar({ ...newCar, images: [...newCar.images, ...newImages] });
  };

  const removeImage = (index) => {
    const updatedImages = newCar.images.filter((_, i) => i !== index);
    setNewCar({ ...newCar, images: updatedImages });
  };

  const verifyListing = (id) => {
    const listing = userListings.find(l => l.id === id);
    if (listing) {
      const approvedCar = {
        id: cars.length + 1,
        make: listing.make,
        model: listing.model,
        year: listing.year,
        price: listing.price,
        status: 'available',
        images: listing.images,
        transmission: listing.transmission,
        kmDriven: listing.kmDriven,
        colour: listing.colour,
        owners: listing.owners,
        fuelType: listing.fuelType
      };
      setCars([...cars, approvedCar]);
      setUserListings(userListings.filter(l => l.id !== id));
    }
  };

  const rejectListing = (id) => {
    setUserListings(userListings.filter(l => l.id !== id));
  };

  const completeRental = (id) => {
    setRentals(rentals.map(rental =>
      rental.id === id ? { ...rental, status: 'completed' } : rental
    ));
  };

  const handleLogout = () => {
    console.log('Logging out...');
    alert('You have been logged out');
    setActiveSection('dashboard');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <section className="admin-section-card">
            <h2>Car Listings</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Images</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Trans</th>
                  <th>KM</th>
                  <th>Colour</th>
                  <th>Owners</th>
                  <th>Fuel</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.id}>
                    <td>
                      {car.images.length > 0 ? (
                        <div className="admin-image-preview-container">
                          {car.images.map((img, index) => (
                            <img 
                              key={index}
                              src={img} 
                              alt={`${car.make} ${car.model} ${index + 1}`} 
                              className="admin-car-image" 
                            />
                          ))}
                        </div>
                      ) : (
                        'No Images'
                      )}
                    </td>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td>${Number(car.price).toLocaleString()}</td>
                    <td>{car.transmission}</td>
                    <td>{Number(car.kmDriven).toLocaleString()}</td>
                    <td>{car.colour}</td>
                    <td>{car.owners}</td>
                    <td>{car.fuelType}</td>
                    <td>
                      <span className={`admin-rental-status admin-status-${car.status}`}>
                        {car.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'addCar':
        return (
          <section className="admin-section-card">
            <h2>Add New Car</h2>
            <form onSubmit={handleAddCar} className="admin-car-form">
              <div className="admin-form-row">
                <input
                  type="text"
                  placeholder="Make"
                  value={newCar.make}
                  onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                  className="admin-input-field"
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  className="admin-input-field"
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={newCar.year}
                  onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                  className="admin-input-field"
                />
              </div>
              <div className="admin-form-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={newCar.price}
                  onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                  className="admin-input-field"
                />
                <select
                  value={newCar.transmission}
                  onChange={(e) => setNewCar({ ...newCar, transmission: e.target.value })}
                  className="admin-input-field"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
                <input
                  type="number"
                  placeholder="KM Driven"
                  value={newCar.kmDriven}
                  onChange={(e) => setNewCar({ ...newCar, kmDriven: e.target.value })}
                  className="admin-input-field"
                />
              </div>
              <div className="admin-form-row">
                <input
                  type="text"
                  placeholder="Colour"
                  value={newCar.colour}
                  onChange={(e) => setNewCar({ ...newCar, colour: e.target.value })}
                  className="admin-input-field"
                />
                <input
                  type="number"
                  placeholder="No. of Owners"
                  value={newCar.owners}
                  onChange={(e) => setNewCar({ ...newCar, owners: e.target.value })}
                  className="admin-input-field"
                />
                <select
                  value={newCar.fuelType}
                  onChange={(e) => setNewCar({ ...newCar, fuelType: e.target.value })}
                  className="admin-input-field"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="admin-form-row">
                <div className="admin-image-upload-container">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="admin-input-field"
                  />
                  <small>Max 5 images (5MB each)</small>
                  {newCar.images.length > 0 && (
                    <div className="admin-image-preview">
                      {newCar.images.map((img, index) => (
                        <div key={index} className="admin-image-preview-item">
                          <img 
                            src={img} 
                            alt={`Preview ${index + 1}`} 
                            className="admin-car-image" 
                          />
                          <button 
                            type="button" 
                            onClick={() => removeImage(index)}
                            className="admin-remove-image-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="admin-form-row">
                <button type="submit" className="admin-submit-btn">Add Car</button>
              </div>
            </form>
          </section>
        );
      case 'userListings':
        return (
          <section className="admin-section-card">
            <h2>User Submitted Listings</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userListings.map(listing => (
                  <tr key={listing.id}>
                    <td>{listing.userName}</td>
                    <td>{listing.make}</td>
                    <td>{listing.model}</td>
                    <td>{listing.year}</td>
                    <td>${Number(listing.price).toLocaleString()}</td>
                    <td>
                      <span className={`admin-rental-status admin-status-${listing.status}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td>
                      {listing.status === 'pending' && (
                        <div className="admin-action-buttons">
                          <button 
                            onClick={() => verifyListing(listing.id)}
                            className="admin-action-btn admin-approve-btn"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => rejectListing(listing.id)}
                            className="admin-action-btn admin-reject-btn"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'enquiries':
        return (
          <section className="admin-section-card">
            <h2>Buying Enquiries</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Car</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(enquiry => (
                  <tr key={enquiry.id}>
                    <td>{enquiry.user}</td>
                    <td>{enquiry.car}</td>
                    <td>{enquiry.message}</td>
                    <td>{enquiry.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'rentals':
        return (
          <section className="admin-section-card">
            <h2>Active Rentals</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Renter</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map(rental => (
                  <tr key={rental.id}>
                    <td>{rental.car}</td>
                    <td>{rental.renter}</td>
                    <td>{rental.startDate}</td>
                    <td>{rental.endDate}</td>
                    <td>
                      <span className={`admin-rental-status admin-status-${rental.status}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td>
                      {rental.status === 'active' && (
                        <button 
                          onClick={() => completeRental(rental.id)}
                          className="admin-action-btn"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      case 'users':
        return (
          <section className="admin-section-card">
            <h2>Registered Users</h2>
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.registered}</td>
                    <td>
                      <span className={`admin-rental-status admin-status-${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-main-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul className="admin-nav-list">
            <li 
              className={`admin-nav-item ${activeSection === 'dashboard' ? 'admin-nav-active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard
            </li>
            <li 
              className={`admin-nav-item ${activeSection === 'addCar' ? 'admin-nav-active' : ''}`}
              onClick={() => setActiveSection('addCar')}
            >
              Add New Car
            </li>
            <li 
              className={`admin-nav-item ${activeSection === 'userListings' ? 'admin-nav-active' : ''}`}
              onClick={() => setActiveSection('userListings')}
            >
              User Listings
            </li>
            <li 
              className={`admin-nav-item ${activeSection === 'enquiries' ? 'admin-nav-active' : ''}`}
              onClick={() => setActiveSection('enquiries')}
            >
              Enquiries
            </li>
            <li 
              className={`admin-nav-item ${activeSection === 'rentals' ? 'admin-nav-active' : ''}`}
              onClick={() => setActiveSection('rentals')}
            >
              Rentals
            </li>
            <li 
              className={`admin-nav-item ${activeSection === 'users' ? 'admin-nav-active' : ''}`}
              onClick={() => setActiveSection('users')}
            >
              Users
            </li>
            <li 
              className="admin-nav-item admin-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-content-wrapper">
        <header className="admin-header">
          <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
          <div className="admin-user-info">Welcome, Admin</div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;