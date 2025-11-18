import React from "react";
import "../styles/About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-wrapper">
        <div className="about-text">
          <h1 className="about-title">
            About <span>Soleair</span>
          </h1>
          <p className="about-intro">
            At <strong>Soleair</strong>, we believe shoes are more than just what you wear —
            they represent confidence, comfort, and movement. Every design is crafted with
            simplicity, performance, and purpose in mind.
          </p>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              To redefine everyday footwear through minimalist design and lasting comfort.
              Each pair we create is made to move with you — wherever life takes you.
            </p>
          </section>

          <section className="about-section">
            <h2>What Sets Us Apart</h2>
            <ul>
              <li>✔ Sustainable materials</li>
              <li>✔ Comfort-driven design</li>
              <li>✔ Modern and versatile style</li>
            </ul>
          </section>

          <section className="about-cta">
            <a href="/products" className="about-btn">
              Explore Our Collection
            </a>
          </section>
        </div>

        <div className="about-image">
          <img
            src="../img/storeFront.png"
            alt="Soleair Collection"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
