import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function sendData() {
    setErrorMessage('');
    if (!username || !email || !password) {
      setErrorMessage('All fields are required!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:9000/user/register', {
        username,
        email,
        password,
      });
      console.log('Registration response:', response.data);
      alert(response.data.msg || 'User registered successfully!');
      navigate('/login');
    } catch (error) {
      const errMsg =
        error.response?.data?.msg ||
        error.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.';
      setErrorMessage(errMsg);
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="login-container">
        <button className="auth-back-btn" onClick={() => navigate('/')} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <h2>Welcome to LuxeWheels</h2>
        <p>Where Elegance Meets the Road</p>

        {errorMessage && (
          <div className="message" style={{ color: "#dc3545", background: "#fce8e6", border: "1px solid #f5c6cb" }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); sendData(); }}>
          <input type="text" className="input-box" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="email" className="input-box" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="input-box" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;

