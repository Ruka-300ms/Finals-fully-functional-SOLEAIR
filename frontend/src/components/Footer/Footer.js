import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section brand">
          <h2 className="footer-logo">Soleair</h2>
          <p className="footer-description">
            Elevate your step. Discover premium shoes designed for comfort and style.
          </p>
        </div>

        <div className="footer-section">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/account">My Account</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact</h3>
          <p>Email: support@soleair.com</p>
          <p>Phone: +63 912 345 6789</p>
          <p>Address: Manila, Philippines</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Soleair. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
