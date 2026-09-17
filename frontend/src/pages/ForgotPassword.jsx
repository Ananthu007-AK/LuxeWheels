import React, { useState } from 'react'
import './Login.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(e);

    if (email === '') {
      setMessage("Email cannot be empty");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:9000/users/forgot-password', {
        email: email
      });

      setMessage(response.data.msg || "Password reset email sent. Check your inbox.");
      setIsLoading(false);

      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setIsLoading(false);

      if (error.response && error.response.data) {
        setMessage(error.response.data.msg || "An error occurred");
      } else {
        console.error(error);
        setMessage("An unexpected error occurred");
      }
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
        <h2>Reset Your Password</h2>
        <p>Enter your email to receive a password reset link</p>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="input-box"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="login-btn"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </button>
          <div className="links">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword

