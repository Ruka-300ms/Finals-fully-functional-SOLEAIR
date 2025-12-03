import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        
        {/* 1. Brand Section */}
        <div className="footer-brand">
          <h2>Soleair.</h2>
          <p>
            Elevate your step. Discover premium shoes designed for comfort, style, and the journey ahead.
          </p>
          <div className="social-links">
            {/* Replace '#' with actual links */}
            <a href="#" className="social-icon" aria-label="Instagram">IG</a>
            <a href="#" className="social-icon" aria-label="Facebook">FB</a>
            <a href="#" className="social-icon" aria-label="Twitter">TW</a>
          </div>
        </div>

        {/* 2. Shop Links */}
        <div className="footer-column">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/products?category=men">Men's Shoes</Link></li>
            <li><Link to="/products?category=women">Women's Shoes</Link></li>
            <li><Link to="/products?category=new">New Arrivals</Link></li>
            <li><Link to="/products?category=sale">Sale</Link></li>
          </ul>
        </div>

        {/* 3. Support Links */}
        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li><Link to="/faq">Help Center</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/shipping">Shipping Info</Link></li>
            <li><Link to="/track">Order Tracker</Link></li>
          </ul>
        </div>

        {/* 4. Newsletter */}
        <div className="footer-column newsletter-column">
          <h3>Stay in the loop</h3>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '15px' }}>
            Sign up for exclusive drops and 10% off your first order.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input" 
                required
            />
            <button type="submit" className="subscribe-btn">Subscribe</button>
          </form>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Soleair. All Rights Reserved.</p>
        <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;