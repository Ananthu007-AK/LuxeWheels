import React from 'react'
import './Admin.css'



function Admin() {
  return (
    <>
      <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LuxeWheels Admin Dashboard</title>
  <link rel="stylesheet" href="no.css" />
  <div className="container">
    {/* Sidebar */}
    <div className="sidebar">
      <div className="logo">
        <h1>LuxeWheels</h1>
      </div>
      <div className="nav-menu">
        <div className="nav-item active">
          <i>📊</i>
          <span>Dashboard</span>
        </div>
        <div className="menu-heading">Inventory</div>
        <div className="nav-item">
          <i>🚗</i>
          <span>All Cars</span>
        </div>
        <div className="nav-item">
          <i>➕</i>
          <span>Add New Car</span>
        </div>
        <div className="nav-item">
          <i>🏷</i>
          <span>Categories</span>
        </div>
        <div className="menu-heading">Transactions</div>
        <div className="nav-item">
          <i>💰</i>
          <span>Sales</span>
        </div>
        <div className="nav-item">
          <i>🔄</i>
          <span>Rentals</span>
        </div>
        <div className="nav-item">
          <i>📝</i>
          <span>Inquiries</span>
        </div>
        <div className="menu-heading">Users</div>
        <div className="nav-item">
          <i>👥</i>
          <span>Customers</span>
        </div>
        <div className="nav-item">
          <i>👤</i>
          <span>Staff</span>
        </div>
        <div className="menu-heading">Settings</div>
        <div className="nav-item">
          <i>⚙</i>
          <span>General</span>
        </div>
        <div className="nav-item">
          <i>📤</i>
          <span>Logout</span>
        </div>
      </div>
    </div>
    {/* Main Content */}
    <div className="main-content">
      <div className="header">
        <div className="page-title">
          <h2>Dashboard</h2>
          <p>Welcome back, Admin</p>
        </div>
        <div className="user-profile">
          <img src="/api/placeholder/40/40" alt="Admin Profile" />
          <span>Admin User</span>
        </div>
      </div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <div className="stat-value">$4.5M</div>
          <div className="stat-info">
            <span className="growth">↑ 12%</span> vs last month
          </div>
        </div>
        <div className="stat-card">
          <h3>Active Listings</h3>
          <div className="stat-value">124</div>
          <div className="stat-info">
            <span className="growth">↑ 5%</span> vs last month
          </div>
        </div>
        <div className="stat-card">
          <h3>Active Rentals</h3>
          <div className="stat-value">38</div>
          <div className="stat-info">
            <span className="decline">↓ 3%</span> vs last month
          </div>
        </div>
        <div className="stat-card">
          <h3>New Inquiries</h3>
          <div className="stat-value">56</div>
          <div className="stat-info">
            <span className="growth">↑ 8%</span> vs last month
          </div>
        </div>
      </div>
      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Listings */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Listings</h3>
              <a href="#" className="view-all">
                View All
              </a>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Price</th>
                    <th>Added</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img src="/api/placeholder/50/35" alt="Porsche 911" />
                        <div>
                          <div>Porsche 911</div>
                          <small>2023</small>
                        </div>
                      </div>
                    </td>
                    <td>$128,500</td>
                    <td>Mar 02, 2025</td>
                    <td>
                      <span className="status available">Available</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img src="/api/placeholder/50/35" alt="Ferrari F8" />
                        <div>
                          <div>Ferrari F8</div>
                          <small>2022</small>
                        </div>
                      </div>
                    </td>
                    <td>$315,000</td>
                    <td>Feb 28, 2025</td>
                    <td>
                      <span className="status pending">Reserved</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img src="/api/placeholder/50/35" alt="Audi R8" />
                        <div>
                          <div>Audi R8</div>
                          <small>2023</small>
                        </div>
                      </div>
                    </td>
                    <td>$182,700</td>
                    <td>Feb 25, 2025</td>
                    <td>
                      <span className="status sold">Sold</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img
                          src="/api/placeholder/50/35"
                          alt="Lamborghini Huracan"
                        />
                        <div>
                          <div>Lamborghini Huracan</div>
                          <small>2022</small>
                        </div>
                      </div>
                    </td>
                    <td>$276,000</td>
                    <td>Feb 22, 2025</td>
                    <td>
                      <span className="status available">Available</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img
                          src="/api/placeholder/50/35"
                          alt="Mercedes AMG GT"
                        />
                        <div>
                          <div>Mercedes AMG GT</div>
                          <small>2023</small>
                        </div>
                      </div>
                    </td>
                    <td>$165,900</td>
                    <td>Feb 20, 2025</td>
                    <td>
                      <span className="status pending">Reserved</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button className="btn btn-primary">Edit</button>
                        <button className="btn btn-danger">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Active Rentals</h3>
              <a href="#" className="view-all">
                View All
              </a>
            </div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>Car</th>
                    <th>Customer</th>
                    <th>Duration</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img src="/api/placeholder/50/35" alt="BMW M4" />
                        <div>BMW M4</div>
                      </div>
                    </td>
                    <td>James Wilson</td>
                    <td>7 days</td>
                    <td>Mar 10, 2025</td>
                    <td>
                      <span className="status available">Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img src="/api/placeholder/50/35" alt="Jaguar F-Type" />
                        <div>Jaguar F-Type</div>
                      </div>
                    </td>
                    <td>Emma Rodriguez</td>
                    <td>3 days</td>
                    <td>Mar 07, 2025</td>
                    <td>
                      <span className="status available">Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="car-info">
                        <img
                          src="/api/placeholder/50/35"
                          alt="Maserati Ghibli"
                        />
                        <div>Maserati Ghibli</div>
                      </div>
                    </td>
                    <td>Michael Chen</td>
                    <td>5 days</td>
                    <td>Mar 09, 2025</td>
                    <td>
                      <span className="status pending">Late</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div>
          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activity</h3>
            </div>
            <div className="card-body">
              <ul className="activity-list">
                <li className="activity-item">
                  <div className="activity-icon activity-sale">💰</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>McLaren 720S</strong> was sold for{" "}
                      <strong>$297,500</strong>
                    </div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon activity-listing">🚗</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      New car <strong>Bentley Continental GT</strong> added to
                      inventory
                    </div>
                    <div className="activity-time">5 hours ago</div>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon activity-return">🔄</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>Porsche Taycan</strong> returned from rental
                    </div>
                    <div className="activity-time">6 hours ago</div>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      New inquiry for <strong>Aston Martin DB11</strong>
                    </div>
                    <div className="activity-time">8 hours ago</div>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon activity-sale">💰</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <strong>Ferrari Roma</strong> was sold for{" "}
                      <strong>$245,000</strong>
                    </div>
                    <div className="activity-time">Yesterday</div>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <div className="activity-text">
                      New customer <strong>Sarah Johnson</strong> registered
                    </div>
                    <div className="activity-time">Yesterday</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-body">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10
                }}
              >
                <button
                  className="btn btn-primary"
                  style={{ padding: 15, textAlign: "center" }}
                >
                  Add New Car
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: 15, textAlign: "center" }}
                >
                  Process Rental
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: 15, textAlign: "center" }}
                >
                  Record Sale
                </button>
                <button
                  className="btn btn-primary"
                  style={{ padding: 15, textAlign: "center" }}
                >
                  Manage Inquiries
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</>

    </>
  )
}

export default Admin