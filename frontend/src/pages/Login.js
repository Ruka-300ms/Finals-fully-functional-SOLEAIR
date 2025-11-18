import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy credentials
    if (email === "admin123" && password === "admin123") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        {/* Left side (form) */}
        <div className="login-left">
          <div className="login-container">
            <h1>Welcome back</h1>
            <p>Sign in to continue to <strong>Soleair</strong></p>

            <form onSubmit={handleSubmit}>
              <label>Email address</label>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn">Sign in</button>

              <p className="signup-text">
                Don’t have an account? <a href="#">Sign up</a>
              </p>
            </form>
          </div>
        </div>

        {/* Right side (image) */}
        <div className="login-right">
          <img src="/img/login-nike.jpg" alt="Login Visual" />
          <div className="login-overlay">
            <h2>Bring your ideas to life.</h2>
            <p>Join us and step into a world of creativity and purpose.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
