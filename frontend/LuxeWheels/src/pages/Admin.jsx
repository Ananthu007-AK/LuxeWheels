import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const [userListings, setUserListings] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [cars, setCars] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  

  // Fetch data when component mounts
  useEffect(() => {
    fetchCars();
    fetchUserListings();
    fetchEnquiries();
    fetchRentals();
    fetchUsers();
  }, []);

  // Fetch cars from backend
  const fetchCars = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user listings from backend
  const fetchUserListings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/listings/pending');
      setUserListings(response.data);
    } catch (error) {
      console.error('Error fetching user listings:', error);
    }
  };

  // Fetch enquiries from backend
  const fetchEnquiries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/enquiries');
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      // Fallback to sample data if API fails
      setEnquiries([
        { id: 1, user: 'Mike Johnson', car: 'BMW X5', message: 'Is this still available?', date: '2025-03-15' }
      ]);
    }
  };

  // Fetch rentals from backend
  const fetchRentals = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rentals');
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      // Fallback to sample data if API fails
      setRentals([
        { id: 1, car: 'Mercedes S-Class 2023', renter: 'Sarah Williams', startDate: '2025-03-14', endDate: '2025-03-21', status: 'active' },
        { id: 2, car: 'Tesla Model 3 2022', renter: 'James Brown', startDate: '2025-03-15', endDate: '2025-03-18', status: 'active' }
      ]);
    }
  };

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to sample data if API fails
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', registered: '2025-01-15', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', registered: '2025-02-01', status: 'active' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', registered: '2025-02-20', status: 'active' }
      ]);
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
      const response = await axios.post('http://localhost:5000/cars/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCars([...cars, response.data.car]);
      setNewCar({
        make: '', model: '', year: '', price: '', status: 'available', images: [],
        transmission: 'automatic', kmDriven: '', colour: '', owners: '', fuelType: 'petrol'
      });
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

    // Keep the File objects for upload
    setNewCar({ ...newCar, images: [...newCar.images, ...validImages] });
  };

  const removeImage = (index) => {
    const updatedImages = newCar.images.filter((_, i) => i !== index);
    setNewCar({ ...newCar, images: updatedImages });
  };

  const verifyListing = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:5000/listings/${id}/approve`);
      if (response.data.success) {
        setUserListings(userListings.filter(listing => listing._id !== id));
        setCars([...cars, response.data.car]);
        fetchUserListings(); // Refresh listings
        fetchCars(); // Refresh cars
      }
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('Failed to approve listing. Please try again.');
    }
  };

  const rejectListing = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/listings/${id}/reject`);
      setUserListings(userListings.filter(listing => listing._id !== id));
      fetchUserListings(); // Refresh listings
    } catch (error) {
      console.error('Error rejecting listing:', error);
      alert('Failed to reject listing. Please try again.');
    }
  };

  const completeRental = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/rentals/${id}/complete`);
      // Refresh rentals
      fetchRentals();
    } catch (error) {
      console.error('Error completing rental:', error);
      // Fallback to client-side update if API fails
      setRentals(rentals.map(rental =>
        rental.id === id ? { ...rental, status: 'completed' } : rental
      ));
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Add your logout logic here, e.g., clear tokens, redirect, etc.
    alert('You have been logged out');
    setActiveSection('dashboard');
    navigate('/');
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
                        {car.images && car.images.length > 0 ? (
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
            )}
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
                    <tr key={enquiry.id}>
                      <td>{enquiry.user}</td>
                      <td>{enquiry.car}</td>
                      <td>{enquiry.message}</td>
                      <td>{enquiry.email}</td>
                      <td>{enquiry.phone}</td>
                      <td>{enquiry.date}</td>
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