import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Reuse Login styles for consistency

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8083/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // IN REAL APP: This happens silently via email.
        // IN DEV: We show the token so you can use it.
        console.log("RESET TOKEN:", data.token);
        alert("Your Reset Token is: " + data.token);
        
        // Redirect to reset page passing the email
        navigate(`/reset-password?email=${email}&token=${data.token}`);
      } else {
        setError(data.message || "Request failed.");
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        
        {/* Left side (form) */}
        <div className="login-left">
          <div className="login-header">
            <h1>Forgot Password?</h1>
            <p>Enter your email to receive a reset token.</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="loader"></span> : "Get Reset Token"}
            </button>
            
            <p className="signup-text">
              Remembered it? <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>

        {/* Right side (image) */}
        <div className="login-right">
          <img src="/img/login-nike.jpg" alt="Visual" />
          <div className="login-overlay">
            <div className="overlay-content">
                <h2>Recover Access.</h2>
                <p>Get back to exploring our exclusive collection.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;