import React from "react";
import { Link } from "react-router-dom"; 
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        
        {/* 1. Hero Section: Split View */}
        <div className="about-hero">
          <div className="about-content">
            <h5 className="sub-title">About us</h5>
            <h1 className="main-title">
              Crafting movement, <br />
              defining <span>style.</span>
            </h1>
            <p className="description">
              At <strong>Soleair</strong>, we believe shoes are more than just what you wear —
              they represent confidence, comfort, and movement. Every design is crafted with
              simplicity, performance, and purpose in mind.
            </p>
            
            <Link to="/products" className="primary-btn">
              Explore Collection
            </Link>
          </div>
          
          <div className="about-visual">
            <div className="image-wrapper">
                {/* Ensure this path matches your public folder structure */}
                <img src="/img/storeFront.png" alt="Soleair Store Front" />
            </div>
          </div>
        </div>

        {/* 2. Mission Statement */}
        <div className="mission-section">
             <div className="mission-box">
                <h2>Our Mission</h2>
                <p>
                  To redefine everyday footwear through minimalist design and lasting comfort.
                  Each pair we create is made to move with you — wherever life takes you.
                </p>
             </div>
        </div>

        {/* 3. Features Grid (Replaces the simple list) */}
        <div className="features-section">
          <div className="feature-card">
            <div className="icon">🌿</div>
            <h3>Sustainable</h3>
            <p>Eco-friendly materials that respect the planet without compromising on durability.</p>
          </div>
          <div className="feature-card">
            <div className="icon">👟</div>
            <h3>Comfort-First</h3>
            <p>Engineered soles designed for all-day wear, reducing fatigue for the modern explorer.</p>
          </div>
          <div className="feature-card">
            <div className="icon">✨</div>
            <h3>Modern Style</h3>
            <p>Versatile, timeless designs that fit any occasion, from the streets to the office.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;