import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/Cart/CartContext";
import "../styles/ProductDetails.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import productsJson from "../data/products.json";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [productList, setProductList] = useState([]);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showAdded, setShowAdded] = useState(false);

  // load product list from localStorage or fallback to bundled JSON
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products"));
    const base = stored && stored.length ? stored : productsJson;
    setProductList(base);

    const found = base.find((p) => Number(p.id) === Number(id));
    setProduct(found || null);
    // reset selection when id changes
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  }, [id]);

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

  const sizes = product.sizes && product.sizes.length ? product.sizes : ["6", "7", "8", "9", "10", "11"];
  const colors = ["black", "white", "red", "blue", "green"];

  const availableStock = Number(product.quantity ?? 0);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please choose a size before adding to cart.");
      return;
    }
    if (quantity > availableStock) {
      alert(`Only ${availableStock} left in stock. Please reduce quantity.`);
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor || "Default",
      quantity,
    });

    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 1400);
  };

  const handleCheckout = () => {
    if (!selectedSize) {
      alert("Please choose a size before proceeding to checkout.");
      return;
    }
    if (quantity > availableStock) {
      alert(`Only ${availableStock} left in stock. Please reduce quantity.`);
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor || "Default",
      quantity,
    });

    navigate("/checkout");
  };

  const goPrev = () => {
    const index = productList.findIndex((p) => Number(p.id) === Number(product.id));
    if (index === -1) return;
    const prevIndex = (index - 1 + productList.length) % productList.length;
    navigate(`/product/${productList[prevIndex].id}`);
  };

  const goNext = () => {
    const index = productList.findIndex((p) => Number(p.id) === Number(product.id));
    if (index === -1) return;
    const nextIndex = (index + 1) % productList.length;
    navigate(`/product/${productList[nextIndex].id}`);
  };

  return (
    <div className="pd-page">
      <button className="pd-back" onClick={() => navigate("/products")}>
        ← Back to Products
      </button>

      <div className="pd-card">
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

          <div className="pd-section">
            <div className="pd-section-title">Size</div>
            <div className="pd-sizes">
              {sizes.map((s) => (
                <button
                  key={s}
                  className={selectedSize === s ? "pd-size selected" : "pd-size"}
                  onClick={() => setSelectedSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pd-section quantity-wrap">
            <div className="pd-section-title">Quantity</div>
            <div className="pd-qty">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}>+</button>
            </div>
            <div style={{ marginTop: 8, color: availableStock === 0 ? "#d33" : "#666" }}>
              {availableStock === 0 ? "Out of stock" : `Available: ${availableStock}`}
            </div>
          </div>

          <div className="pd-actions">
            <button
              className="pd-btn pd-add"
              onClick={handleAddToCart}
              disabled={availableStock === 0}
              style={availableStock === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              Add to Cart
            </button>

            <button
              className="pd-btn pd-checkout"
              onClick={handleCheckout}
              disabled={availableStock === 0}
              style={availableStock === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
              Proceed to Checkout
            </button>
          </div>

          {showAdded && <div className="pd-toast">Added to cart</div>}
        </div>

        <button className="pd-arrow right" onClick={goNext} aria-label="Next product">
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
