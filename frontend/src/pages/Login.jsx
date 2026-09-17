import React, { useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function sendData(e) {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage("Email and Password cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:9000/user/login', {
        email,
        password
      });

      console.log('Login response:', response.data);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);

      if (response.data.role === "admin") {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.msg ||
        error.response?.data?.errors?.[0]?.msg ||
        'Login failed. Please check your credentials.';
      setErrorMessage(errMsg);
      console.error('Login error:', error);
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

        <form onSubmit={sendData}>
          <input
            type="email"
            className="input-box"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="input-box"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Submit"}
          </button>

          <div className="links">
            <span onClick={() => navigate('/register')} className="link">Don't have an account? Sign up</span>
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

