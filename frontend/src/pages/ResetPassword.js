import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "../styles/Login.css"; // Reuse Login styles for consistent design

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- NEW: Show Password State ---
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Auto-fill email and token from URL parameters if available
  useEffect(() => {
    const urlEmail = searchParams.get("email");
    const urlToken = searchParams.get("token");
    if (urlEmail) setEmail(urlEmail);
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
        setError("Passwords do not match.");
        return;
    }
    
    if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8083/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            email, 
            token, 
            password, 
            password_confirmation: passwordConfirmation 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successful! Please login with your new password.");
        navigate("/login");
      } else {
        setError(data.message || "Reset failed. Token may be invalid or expired.");
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
            <h1>Reset Password</h1>
            <p>Create a strong new password for your account.</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
                <label>Email Address</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="name@example.com"
                />
            </div>

            <div className="input-group">
                <label>Reset Token</label>
                <input 
                    type="text" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    required 
                    placeholder="Paste the token you received"
                />
            </div>

            <div className="input-group">
                <label>New Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="Min. 8 characters" 
                />
            </div>

            <div className="input-group">
                <label>Confirm New Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    value={passwordConfirmation} 
                    onChange={(e) => setPasswordConfirmation(e.target.value)} 
                    required 
                    placeholder="Repeat password" 
                />
            </div>

            {/* Show Password Toggle */}
            <div className="actions-row" style={{ marginTop: "-10px", marginBottom: "20px" }}>
                <div className="show-password-toggle">
                    <label className="checkbox-container">
                        <input 
                            type="checkbox" 
                            checked={showPassword} 
                            onChange={togglePasswordVisibility} 
                        />
                        <span className="checkmark"></span>
                        Show Password
                    </label>
                </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
                {loading ? <span className="loader"></span> : "Reset Password"}
            </button>
            
             <p className="signup-text">
              <Link to="/login">Cancel</Link>
            </p>
          </form>
        </div>

        {/* Right side (image) */}
        <div className="login-right">
          <img src="/img/login-nike.jpg" alt="Visual" />
          <div className="login-overlay">
            <div className="overlay-content">
                <h2>Secure Your Account.</h2>
                <p>Set a new password to protect your profile and order history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;