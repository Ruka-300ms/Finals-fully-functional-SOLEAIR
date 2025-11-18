import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import productsData from "../data/products.json";
import { useCart } from "../components/Cart/CartContext";
import "../styles/ProductDetails.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const productList = Array.isArray(productsData) ? productsData : [];
  const index = productList.findIndex((p) => p.id === parseInt(id, 10));
  const product = index >= 0 ? productList[index] : null;

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // color string like "black"
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);

  if (!product) {
    return (
      <div className="pd-empty">
        <p>Product not found.</p>
        <button className="pd-back" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>
      </div>
    );
  }

  const sizes = product.sizes && product.sizes.length ? product.sizes : ["6","7","8","9","10","11"];
  // color options - you can change or derive from product if you store colors in products.json
  const colors = ["black", "white", "red", "blue", "green"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please choose a size before adding to cart.");
      return;
    }
    // attach color and quantity
    addToCart({ ...product, size: selectedSize, color: selectedColor || "Default", quantity });
    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1700);
  };

  const handleProceed = () => {
    if (!selectedSize) {
      alert("Please choose a size before proceeding to checkout.");
      return;
    }
    addToCart({ ...product, size: selectedSize, color: selectedColor || "Default", quantity });
    navigate("/checkout");
  };

  const goPrev = () => {
    const prevIndex = (index - 1 + productList.length) % productList.length;
    navigate(`/product/${productList[prevIndex].id}`);
  };

  const goNext = () => {
    const nextIndex = (index + 1) % productList.length;
    navigate(`/product/${productList[nextIndex].id}`);
  };

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <div className="pd-card">
        {/* Left arrow outside card */}
        <button className="pd-arrow left" onClick={goPrev} aria-label="Previous product">
          <FaChevronLeft />
        </button>

        <div className="pd-image-col">
          <div className="pd-image-wrap">
            <img src={product.image} alt={product.name} className="pd-image" />
          </div>
        </div>

        <div className="pd-info-col">
          {product.discount ? <span className="pd-discount">-{product.discount}%</span> : null}

          <h1 className="pd-title">{product.name}</h1>
          <p className="pd-brand">Brand: {product.brand}</p>

          <div className="pd-price-row">
            {product.discount ? (
              <>
                <span className="pd-old">₱{product.price.toLocaleString()}</span>
                <span className="pd-price">
                  ₱{(product.price * (1 - product.discount / 100)).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="pd-price">₱{product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="pd-desc">{product.description}</p>

          {/* Color picker */}
          <div className="pd-section">
            <div className="pd-section-title">Color</div>
            <div className="pd-colors">
              {colors.map((c) => (
                <button
                  key={c}
                  className={`pd-color ${c} ${selectedColor === c ? "selected" : ""}`}
                  onClick={() => setSelectedColor(c)}
                  aria-label={`Choose ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Size picker */}
          <div className="pd-section">
            <div className="pd-section-title">Size</div>
            <div className="pd-sizes">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={`pd-size ${selectedSize === s ? "selected" : ""}`}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="pd-section quantity-wrap">
            <div className="pd-section-title">Quantity</div>
            <div className="pd-qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pd-actions">
            <button className="pd-btn pd-add" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="pd-btn pd-checkout" onClick={handleProceed}>
              Proceed to Checkout →
            </button>
          </div>

          {showAdded && <div className="pd-toast">✅ Added to cart</div>}
        </div>

        {/* Right arrow outside card */}
        <button className="pd-arrow right" onClick={goNext} aria-label="Next product">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
