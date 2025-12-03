import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      // 1. Send credentials to Laravel
      const response = await fetch("http://localhost:8083/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Login Successful! Save the token.
        localStorage.setItem("auth_token", data.access_token);
        localStorage.setItem("user_info", JSON.stringify(data.user));

        console.log("Logged in user:", data.user); 

        // --- REDIRECTION LOGIC ---
        const username = data.user.username ? data.user.username.toLowerCase() : "";
        const userEmail = data.user.email ? data.user.email.toLowerCase() : "";

        // If the username OR email contains the word "admin", go to Dashboard
        if (username.includes("admin") || userEmail.includes("admin")) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
        // -------------------------
      } else {
        // 4. Handle Errors
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Unable to connect to the server.");
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
            <h1>Welcome back</h1>
            <p>Sign in to continue to <strong>Soleair</strong></p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>Email or Username</label>
              <input
                type="text"
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
            </div>

            <div className="actions-row">
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
                <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? <span className="loader"></span> : "Sign in"}
            </button>

            <p className="signup-text">
              Don’t have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </div>

        {/* Right side (image) */}
        <div className="login-right">
          <img src="/img/login-nike.jpg" alt="Login Visual" />
          <div className="login-overlay">
            <div className="overlay-content">
                <h2>Bring your ideas to life.</h2>
                <p>Join us and step into a world of creativity and purpose.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;