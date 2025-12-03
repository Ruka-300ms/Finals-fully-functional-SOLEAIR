import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Homepage.css";

function HomePage() {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/products");
  };

  return (
    <>
      {/* Import premium fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,700&family=Poppins:wght@300;400;600;800&display=swap" rel="stylesheet" />

      <div className="home-container">
        {/* Background Watermark */}
        <div className="bg-watermark">SOLEAIR</div>

        <div className="home-hero">
          
          {/* Left: Text Content */}
          <div className="hero-text">
            <div className="badge-pill">New Collection 2025</div>
            <h1 className="headline">
              Walk on, <span className="highlight">Legend.</span>
            </h1>
            <p className="subtitle">
              Experience the perfect fusion of heritage craftsmanship and future-forward design. 
              Your journey to greatness begins with the first step.
            </p>
            
            <div className="cta-group">
              <button className="shop-btn primary" onClick={handleShopNowClick}>
                Shop Collection
              </button>
              <button className="shop-btn secondary" onClick={() => navigate("/about")}>
                About Soleair
              </button>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-num">50k+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-num">100+</span>
                <span className="stat-label">Exclusive Designs</span>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Image Composition */}
          <div className="hero-visual">
            <div className="circle-bg"></div>
            <img
              src="../img/HomePageShoes.png"
              alt="Soleair Flagship Shoe"
              className="shoe-image"
            />
            
            {/* Floating Cards for 3D effect */}
            <div className="float-card card-top">
              <span className="card-icon">🔥</span>
              <div>
                <p className="card-title">Trending</p>
                <p className="card-sub">Nike Jordan 1 Blacktoe</p>
              </div>
            </div>

            <div className="float-card card-bottom">
              <p className="card-price">₱5,899</p>
              <p className="card-sub">In Stock</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default HomePage;