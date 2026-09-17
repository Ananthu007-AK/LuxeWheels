import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

function Admin() {
  const [activeSection, setActiveSection] = useState(() => localStorage.getItem('adminActiveSection') || 'dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();
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
  const [editingCar, setEditingCar] = useState(null); // New state for editing car
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      const response = await axios.get('http://localhost:9000/cars', {
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
      const response = await axios.get('http://localhost:9000/listings/pending', {
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
      const response = await axios.get('http://localhost:9000/enquiries', {
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
      const response = await axios.get('http://localhost:9000/rentals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentals(response.data);
    } catch (error) {
      console.error('Error fetching rentals:', error.response?.data || error.message);
      setRentals([]);
    }
  };

  const approveRental = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:9000/rentals/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Rental approved successfully!', 'success');
      fetchRentals();
      fetchCars();
    } catch (error) {
      console.error('Error approving rental:', error.response?.data || error.message);
      showToast('Failed to approve rental. Please try again.', 'error');
    }
  };

  const rejectRental = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:9000/rentals/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Rental request rejected.', 'info');
      fetchRentals();
      fetchCars();
    } catch (error) {
      console.error('Error rejecting rental:', error.response?.data || error.message);
      showToast('Failed to reject rental.', 'error');
    }
  };

  const completeRental = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:9000/rentals/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast('Rental marked as completed!', 'success');
      fetchRentals();
      fetchCars();
    } catch (error) {
      console.error('Error completing rental:', error.response?.data || error.message);
      showToast('Failed to complete rental.', 'error');
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9000/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mappedUsers = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        registered: user.registered || new Date().toISOString().split('T')[0],
        phone: user.phone || 'N/A',
        address: user.address || 'N/A',
        status: user.status || 'active',
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      if (error.response?.status === 403) {
        alert('Access denied. Please log in as an admin.');
        navigate('/login');
      } else if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
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
      const response = await axios.post('http://localhost:9000/cars/add', formData, {
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
      const response = await axios.patch(`http://localhost:9000/listings/${id}/approve`, {}, {
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
      await axios.patch(`http://localhost:9000/listings/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserListings(userListings.filter(listing => listing._id !== id));
      fetchUserListings();
    } catch (error) {
      console.error('Error rejecting listing:', error.response?.data || error.message);
      alert('Failed to reject listing. Please try again.');
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

  // Helper function to get user name by userId
  const getUserNameById = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };


  const handleEditCar = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editingCar).forEach(key => {
      if (key === 'images') {
        editingCar.images.forEach(image => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      } else if (key !== '_id') {
        formData.append(key, editingCar[key]);
      }
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:9000/cars/${editingCar._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setCars(cars.map(car => car._id === editingCar._id ? response.data.car : car));
      setEditingCar(null);
      fetchCars();
    } catch (error) {
      console.error('Error updating car:', error.response?.data || error.message);
      alert('Failed to update car. Please try again.');
    }
  };

  const handleDeleteCar = async (id) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:9000/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.filter(car => car._id !== id));
    } catch (error) {
      console.error('Error deleting car:', error.response?.data || error.message);
      alert('Failed to delete car. Please try again.');
    }
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    if (files.length + editingCar.images.length > maxImages) {
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
    setEditingCar({ ...editingCar, images: [...editingCar.images, ...validImages] });
  };

  const removeEditImage = (index) => {
    const updatedImages = editingCar.images.filter((_, i) => i !== index);
    setEditingCar({ ...editingCar, images: updatedImages });
  };

  const startEditing = (car) => {
    setEditingCar({
      ...car,
      images: car.images || [],
    });
  };

  const cancelEditing = () => {
    setEditingCar(null);
  };


  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': {
        const pendingRentals = rentals.filter(r => r.status === 'pending');
        const activeRentals = rentals.filter(r => r.status === 'approved' || r.status === 'confirmed');
        const displayedCars = cars.filter(c => {
          if (statusFilter === 'all') return true;
          return (c.status || '').toLowerCase() === statusFilter;
        });

        return (
          <>
            {/* KPI Metric Overview */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">🏎️</div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-val">{cars.length}</span>
                  <span className="admin-kpi-label">Total Fleet</span>
                  <span className="admin-kpi-sub">{cars.filter(c => c.status === 'available').length} Available</span>
                </div>
              </div>

              <div className="admin-kpi-card" onClick={() => setActiveSection('rentals')} style={{ cursor: 'pointer' }}>
                <div className="admin-kpi-icon">🔑</div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-val">{activeRentals.length}</span>
                  <span className="admin-kpi-label">Active Bookings</span>
                  <span className="admin-kpi-sub" style={{ color: pendingRentals.length > 0 ? '#d97706' : '#16a34a' }}>
                    {pendingRentals.length} Pending Approval
                  </span>
                </div>
              </div>

              <div className="admin-kpi-card" onClick={() => setActiveSection('enquiries')} style={{ cursor: 'pointer' }}>
                <div className="admin-kpi-icon">📬</div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-val">{enquiries.length}</span>
                  <span className="admin-kpi-label">Buying Enquiries</span>
                  <span className="admin-kpi-sub">Direct Requests</span>
                </div>
              </div>

              <div className="admin-kpi-card" onClick={() => setActiveSection('users')} style={{ cursor: 'pointer' }}>
                <div className="admin-kpi-icon">👥</div>
                <div className="admin-kpi-content">
                  <span className="admin-kpi-val">{users.length}</span>
                  <span className="admin-kpi-label">Registered Clients</span>
                  <span className="admin-kpi-sub">{users.filter(u => u.status === 'active').length} Active</span>
                </div>
              </div>
            </div>

            <section className="admin-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ margin: 0 }}>Fleet Management</h2>
                <div className="admin-filter-bar" style={{ margin: 0 }}>
                  {['all', 'available', 'rented', 'sold'].map(s => (
                    <button
                      key={s}
                      className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`}
                      onClick={() => setStatusFilter(s)}
                      type="button"
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? cars.length : cars.filter(c => (c.status || '').toLowerCase() === s).length})
                    </button>
                  ))}
                </div>
              </div>
              {editingCar ? (
                <div className="admin-edit-form">
                  <h3>Edit Car</h3>
                  <form onSubmit={handleEditCar} className="admin-car-form">
                    <div className="admin-form-row">
                      <input
                        type="text"
                        placeholder="Make"
                        value={editingCar.make}
                        onChange={(e) => setEditingCar({ ...editingCar, make: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Model"
                        value={editingCar.model}
                        onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Year"
                        value={editingCar.year}
                        onChange={(e) => setEditingCar({ ...editingCar, year: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                    </div>
                    <div className="admin-form-row">
                      <input
                        type="number"
                        placeholder="Price"
                        value={editingCar.price}
                        onChange={(e) => setEditingCar({ ...editingCar, price: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Rent"
                        value={editingCar.rent}
                        onChange={(e) => setEditingCar({ ...editingCar, rent: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                      <select
                        value={editingCar.transmission}
                        onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value })}
                        className="admin-input-field"
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                      <input
                        type="number"
                        placeholder="KM Driven"
                        value={editingCar.kmDriven}
                        onChange={(e) => setEditingCar({ ...editingCar, kmDriven: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                    </div>
                    <div className="admin-form-row">
                      <input
                        type="text"
                        placeholder="Colour"
                        value={editingCar.colour}
                        onChange={(e) => setEditingCar({ ...editingCar, colour: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                      <input
                        type="number"
                        placeholder="No. of Owners"
                        value={editingCar.owners}
                        onChange={(e) => setEditingCar({ ...editingCar, owners: e.target.value })}
                        className="admin-input-field"
                        required
                      />
                      <select
                        value={editingCar.fuelType}
                        onChange={(e) => setEditingCar({ ...editingCar, fuelType: e.target.value })}
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
                          onChange={handleEditImageChange}
                          className="admin-input-field"
                        />
                        <small>Max 5 images (5MB each)</small>
                        {editingCar.images.length > 0 && (
                          <div className="admin-image-preview">
                            {editingCar.images.map((img, index) => (
                              <div key={index} className="admin-image-preview-item">
                                <img
                                  src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:9000${img}`}
                                  alt={`Preview ${index + 1}`}
                                  className="admin-car-image"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeEditImage(index)}
                                  className="admin-remove-image-btn"
                                >
                                  ├ù
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <button type="submit" className="admin-submit-btn">Update Car</button>
                      <button type="button" onClick={cancelEditing} className="admin-cancel-btn">Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <div className="admin-loading">Loading cars...</div>
                  ) : displayedCars.length === 0 ? (
                    <div className="admin-empty-state">No cars matching the selected filter.</div>
                  ) : (
                    <div className="admin-table-responsive">
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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedCars.map(car => (
                            <tr key={car._id}>
                              <td>
                                {car.images && car.images.length > 0 ? (
                                  <div className="admin-image-preview-container">
                                    {car.images.map((img, index) => (
                                      <img
                                        key={index}
                                        src={`http://localhost:9000${img}`}
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
                              <td>₹{Number(car.price).toLocaleString('en-IN')}</td>
                              <td>₹{Number(car.rent).toLocaleString('en-IN')}</td>
                              <td>{car.transmission}</td>
                              <td>{Number(car.kmDriven).toLocaleString('en-IN')}</td>
                              <td>{car.colour}</td>
                              <td>{car.owners}</td>
                              <td>{car.fuelType}</td>
                              <td>
                                <span className={`admin-rental-status admin-status-${car.status}`}>
                                  {car.status}
                                </span>
                              </td>
                              <td>
                                <div className="admin-action-buttons">
                                  <button
                                    onClick={() => startEditing(car)}
                                    className="admin-action-btn admin-edit-btn"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCar(car._id)}
                                    className="admin-action-btn admin-delete-btn"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        );
      }
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
                            ├ù
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
              <div className="admin-table-responsive">
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
                                  src={`http://localhost:9000${img}`}
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
              </div>
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
              <div className="admin-table-responsive">
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
              </div>
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
              <div className="admin-table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Car</th>
                      <th>Renter</th>
                      <th>User</th> {/* New column for signed-in user */}
                      <th>Phone</th>
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
                        <td>{rental.userId ? getUserNameById(rental.userId) : 'Unknown User'}</td> {/* Display user name */}
                        <td>{rental.phone}</td>
                        <td>{new Date(rental.pickupDate).toLocaleDateString()}</td>
                        <td>{new Date(rental.returnDate).toLocaleDateString()}</td>
                        <td>
                          <span className={`admin-rental-status admin-status-${rental.status}`}>
                            {rental.status}
                          </span>
                        </td>
                        <td>
                          {rental.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => approveRental(rental._id)}
                                className="admin-action-btn admin-approve-btn"
                                title="Approve rental"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectRental(rental._id)}
                                className="admin-action-btn admin-reject-btn"
                                title="Reject rental"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (rental.status === 'approved' || rental.status === 'confirmed') ? (
                            <button
                              onClick={() => completeRental(rental._id)}
                              className="admin-complete-btn"
                            >
                              Mark Completed
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#888' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              <div className="admin-table-responsive">
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
              </div>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-main-container">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="admin-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            ×
          </button>
        </div>
        <nav className="admin-nav">
          <ul className="admin-nav-list">
            <li
              className={`admin-nav-item ${activeSection === 'dashboard' ? 'admin-nav-active' : ''}`}
              onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">📊</span>
              <span className="admin-nav-text">Dashboard</span>
            </li>
            <li
              className={`admin-nav-item ${activeSection === 'addCar' ? 'admin-nav-active' : ''}`}
              onClick={() => { setActiveSection('addCar'); setIsSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">➕</span>
              <span className="admin-nav-text">Add New Car</span>
            </li>
            <li
              className={`admin-nav-item ${activeSection === 'userListings' ? 'admin-nav-active' : ''}`}
              onClick={() => { setActiveSection('userListings'); setIsSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">📋</span>
              <span className="admin-nav-text">User Listings</span>
            </li>
            <li
              className={`admin-nav-item ${activeSection === 'enquiries' ? 'admin-nav-active' : ''}`}
              onClick={() => { setActiveSection('enquiries'); setIsSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">📬</span>
              <span className="admin-nav-text">Enquiries</span>
            </li>
            <li
              className={`admin-nav-item ${activeSection === 'rentals' ? 'admin-nav-active' : ''}`}
              onClick={() => { setActiveSection('rentals'); setIsSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">🔑</span>
              <span className="admin-nav-text">Rentals</span>
            </li>
            <li
              className={`admin-nav-item ${activeSection === 'users' ? 'admin-nav-active' : ''}`}
              onClick={() => { setActiveSection('users'); setIsSidebarOpen(false); }}
            >
              <span className="admin-nav-icon">👥</span>
              <span className="admin-nav-text">Users</span>
            </li>
            <li className="admin-nav-item admin-logout-btn" onClick={handleLogout}>
              <span className="admin-nav-icon">🚪</span>
              <span className="admin-nav-text">Logout</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="admin-content-wrapper">
        <header className="admin-header">
          <div className="admin-header-title-group">
            <button
              className="admin-mobile-toggle"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Toggle Navigation Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
          </div>
          <div className="admin-user-info">Welcome, Admin</div>
        </header>
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;
