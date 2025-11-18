import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";

function HomePage() {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/products");
  };

  return (
    <div className="home-hero">
      <div className="home-content">
        <div className="text-section">
          <h1 className="headline">
            Step into <br />
            <span className="legend">Legend.</span>
          </h1>
          <p className="subtitle">
            Where every step defines your story. <br />
          </p>
          <button className="shop-btn" onClick={handleShopNowClick}>
            SHOP NOW
          </button>
        </div>

        <div className="image-section">
          <div className="image-bg"></div>
          <img
            src="../img/HomePageShoes.png"
            alt="Soleair Shoe"
            className="shoe-image"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
