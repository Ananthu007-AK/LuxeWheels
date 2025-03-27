import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeSection, setActiveSection] = useState(() => localStorage.getItem('adminActiveSection') || 'dashboard');
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    rent: '',
    status: 'available',
    images: [],
    transmission: 'automatic',
    kmDriven: '',
    colour: '',
    owners: '',
    fuelType: 'petrol',
  });
  const [userListings, setUserListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchCars();
    fetchUserListings();
    fetchEnquiries();
    fetchRentals();
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem('adminActiveSection', activeSection);
  }, [activeSection]);

  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/cars', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/listings/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserListings(response.data);
    } catch (error) {
      console.error('Error fetching user listings:', error.response?.data || error.message);
    }
  };

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/enquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error.response?.data || error.message);
    }
  };

  const fetchRentals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/rentals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched rentals:', response.data); // Debug log
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error.response?.data || error.message);
      setRentals([]); // Empty array on error instead of hardcoded data
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedUsers = response.data.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        registered: user.registered || new Date().toISOString().split('T')[0],
        phone: user.phone || 'N/A',
        address: user.address || 'N/A',
        status: user.status || 'active',
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newCar).forEach(key => {
      if (key === 'images') {
        newCar.images.forEach(image => formData.append('images', image));
      } else {
        formData.append(key, newCar[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/cars/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setCars([...cars, response.data.car]);
      setNewCar({
        make: '',
        model: '',
        year: '',
        price: '',
        rent: '',
        status: 'available',
        images: [],
        transmission: 'automatic',
        kmDriven: '',
        colour: '',
        owners: '',
        fuelType: 'petrol',
      });
      setActiveSection('dashboard');
    } catch (error) {
      console.error('Error adding car:', error.response?.data || error.message);
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
    setNewCar({ ...newCar, images: [...newCar.images, ...validImages] });
  };

  const removeImage = (index) => {
    const updatedImages = newCar.images.filter((_, i) => i !== index);
    setNewCar({ ...newCar, images: updatedImages });
  };

  const verifyListing = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:5000/listings/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUserListings(userListings.filter(listing => listing._id !== id));
        setCars([...cars, response.data.car]);
        fetchUserListings();
        fetchCars();
      }
    } catch (error) {
      console.error('Error approving listing:', error.response?.data || error.message);
      alert('Failed to approve listing. Please try again.');
    }
  };

  const rejectListing = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/listings/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserListings(userListings.filter(listing => listing._id !== id));
      fetchUserListings();
    } catch (error) {
      console.error('Error rejecting listing:', error.response?.data || error.message);
      alert('Failed to reject listing. Please try again.');
    }
  };

  const completeRental = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/rentals/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRentals(); // Refresh rentals after completion
    } catch (error) {
      console.error('Error completing rental:', error.response?.data || error.message);
      alert('Failed to complete rental. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('adminActiveSection');
    setUsers([]);
    alert('You have been logged out');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <section className="admin-section-card">
            <h2>Car Listings</h2>
            {isLoading ? (
              <div className="admin-loading">Loading cars...</div>
            ) : cars.length === 0 ? (
              <div className="admin-empty-state">No cars available. Add new cars to get started.</div>
            ) : (
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Images</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Rent</th>
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
                    <tr key={car._id}>
                      <td>
                        {car.images && car.images.length > 0 ? (
                          <div className="admin-image-preview-container">
                            {car.images.map((img, index) => (
                              <img
                                key={index}
                                src={`http://localhost:5000${img}`}
                                alt={`${car.make} ${car.model} ${index + 1}`}
                                className="admin-car-image"
                                onError={(e) => console.log('Image load error:', e.target.src)}
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
                      <td>${Number(car.rent).toLocaleString()}</td>
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
            )}
          </section>
        );
      case 'addCar':
        return (
          <section className="admin-section-card">
            <h2>Add New Car</h2>
            <form onSubmit={handleAddCar} className="admin-car-form">
              {/* Form fields remain unchanged */}
              <div className="admin-form-row">
                <input
                  type="text"
                  placeholder="Make"
                  value={newCar.make}
                  onChange={(e) => setNewCar({ ...newCar, make: e.target.value })}
                  className="admin-input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="Model"
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  className="admin-input-field"
                  required
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={newCar.year}
                  onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                  className="admin-input-field"
                  required
                />
              </div>
              <div className="admin-form-row">
                <input
                  type="number"
                  placeholder="Price"
                  value={newCar.price}
                  onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                  className="admin-input-field"
                  required
                />
                <input
                  type="number"
                  placeholder="Rent"
                  value={newCar.rent}
                  onChange={(e) => setNewCar({ ...newCar, rent: e.target.value })}
                  className="admin-input-field"
                  required
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
                  required
                />
              </div>
              <div className="admin-form-row">
                <input
                  type="text"
                  placeholder="Colour"
                  value={newCar.colour}
                  onChange={(e) => setNewCar({ ...newCar, colour: e.target.value })}
                  className="admin-input-field"
                  required
                />
                <input
                  type="number"
                  placeholder="No. of Owners"
                  value={newCar.owners}
                  onChange={(e) => setNewCar({ ...newCar, owners: e.target.value })}
                  className="admin-input-field"
                  required
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
                            src={img instanceof File ? URL.createObjectURL(img) : img}
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
            {userListings.length === 0 ? (
              <div className="admin-empty-state">No pending user listings.</div>
            ) : (
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Images</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Year</th>
                    <th>Price</th>
                    <th>Mileage</th>
                    <th>Condition</th>
                    <th>Colour</th>
                    <th>Trans</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userListings.map(listing => (
                    <tr key={listing._id}>
                      <td>
                        {listing.images && listing.images.length > 0 ? (
                          <div className="admin-image-preview-container">
                            {listing.images.map((img, index) => (
                              <img
                                key={index}
                                src={`http://localhost:5000${img}`}
                                alt={`${listing.make} ${listing.model} ${index + 1}`}
                                className="admin-car-image"
                              />
                            ))}
                          </div>
                        ) : 'No Images'}
                      </td>
                      <td>{listing.name}</td>
                      <td>{listing.email}</td>
                      <td>{listing.phone}</td>
                      <td>{listing.make}</td>
                      <td>{listing.model}</td>
                      <td>{listing.year}</td>
                      <td>${Number(listing.price).toLocaleString()}</td>
                      <td>{Number(listing.mileage).toLocaleString()}</td>
                      <td>{listing.condition}</td>
                      <td>{listing.color}</td>
                      <td>{listing.transmission}</td>
                      <td>{listing.description}</td>
                      <td>
                        <span className={`admin-rental-status admin-status-${listing.status}`}>
                          {listing.status}
                        </span>
                      </td>
                      <td>
                        {listing.status === 'pending' && (
                          <div className="admin-action-buttons">
                            <button
                              onClick={() => verifyListing(listing._id)}
                              className="admin-action-btn admin-approve-btn"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectListing(listing._id)}
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
            )}
          </section>
        );
      case 'enquiries':
        return (
          <section className="admin-section-card">
            <h2>Buying Enquiries</h2>
            {enquiries.length === 0 ? (
              <div className="admin-empty-state">No enquiries yet.</div>
            ) : (
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Car</th>
                    <th>Message</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map(enquiry => (
                    <tr key={enquiry._id || enquiry.id}>
                      <td>{enquiry.user || enquiry.name}</td>
                      <td>{enquiry.car}</td>
                      <td>{enquiry.message}</td>
                      <td>{enquiry.email}</td>
                      <td>{enquiry.phone}</td>
                      <td>{new Date(enquiry.date || enquiry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );
      case 'rentals':
        return (
          <section className="admin-section-card">
            <h2>Active Rentals</h2>
            {rentals.length === 0 ? (
              <div className="admin-empty-state">No active rentals.</div>
            ) : (
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
                    <tr key={rental._id}>
                      <td>{rental.carId ? `${rental.carId.make} ${rental.carId.model}` : 'Unknown Car'}</td>
                      <td>{rental.name}</td>
                      <td>{new Date(rental.pickupDate).toLocaleDateString()}</td>
                      <td>{new Date(rental.returnDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`admin-rental-status admin-status-${rental.status}`}>
                          {rental.status}
                        </span>
                      </td>
                      <td>
                        {rental.status === 'pending' && (
                          <button
                            onClick={() => completeRental(rental._id)}
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
            )}
          </section>
        );
      case 'users':
        return (
          <section className="admin-section-card">
            <h2>Registered Users</h2>
            {users.length === 0 ? (
              <div className="admin-empty-state">No users registered yet.</div>
            ) : (
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registered Date</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.registered).toLocaleDateString()}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                      <td>
                        <span className={`admin-rental-status admin-status-${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
            <li className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
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