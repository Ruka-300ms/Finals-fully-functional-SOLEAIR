import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  // 1. Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "", // Required for Laravel 'confirmed' validation
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle state

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend Validation
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 2. Connect to Laravel Backend
      const response = await fetch("http://localhost:8083/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json", // Crucial for Laravel API responses
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation, // Sent to backend
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Save token & Redirect
        localStorage.setItem("auth_token", data.access_token);
        alert("Account created successfully!");
        navigate("/login");
      } else {
        // Handle Backend Validation Errors
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Register Error:", err);
      setError("Server error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        
        {/* Left Side: Form */}
        <div className="register-left">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join <strong>Soleair</strong> today.</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Row */}
            <div className="row-inputs">
              <div className="input-group">
                <label>Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="8+ chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Confirm</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="Repeat"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Show Password Toggle */}
            <div className="show-password-toggle">
                <label className="checkbox-container">
                    <input 
                        type="checkbox" 
                        checked={showPassword} 
                        onChange={togglePasswordVisibility} 
                    />
                    <span className="checkmark"></span>
                    Show Passwords
                </label>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "Sign Up"}
            </button>

            <p className="login-text">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>

        {/* Right Side: Image */}
        <div className="register-right">
          <img src="/img/login-nike.jpg" alt="Register Visual" />
          <div className="register-overlay">
            <div className="overlay-content">
                <h2>Step into Style.</h2>
                <p>Exclusive drops and premium gear await.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;