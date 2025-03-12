import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  async function handleForgotPassword(e) {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/forgot-password", { email });
      alert(response.data.msg);
      navigate("/"); // Navigate to login or another page after success
    } catch (error) {
      console.error(error);
      alert("Error: Unable to process request");
    }
  }

  return (
    <div className="forgot-password-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          className="input-box"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="submit-btn" type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
