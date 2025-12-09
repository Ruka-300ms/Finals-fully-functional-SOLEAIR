import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../components/Cart/CartContext";
import "../styles/ProductDetails.css";
// FIX: Corrected import from 'FarulerCombined' to 'FaRulerCombined'
import { FaChevronLeft, FaChevronRight, FaStar, FaRulerCombined } from "react-icons/fa";

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
  const [loading, setLoading] = useState(true);

  // --- INTEGRATION: Fetch All Products ---
  useEffect(() => {
    fetch('http://localhost:8083/api/products')
      .then(res => res.json())
      .then(data => {
        setProductList(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading products", err);
        setLoading(false);
      });
  }, []);

  // Find specific product
  useEffect(() => {
    if (productList.length > 0) {
      const found = productList.find((p) => Number(p.id) === Number(id));
      setProduct(found || null);
      
      // Reset selection
      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);
    }
  }, [id, productList]);

  if (loading) return <div className="pd-loading">Loading Collection...</div>;

  if (!product) {
    return (
      <div className="pd-empty">
        <p>Product not found.</p>
        <button className="pd-back-btn" onClick={() => navigate("/products")}>
          Back to Collection
        </button>
      </div>
    );
  }

  // Handle default sizes/colors
  const sizes = product.sizes ? (Array.isArray(product.sizes) ? product.sizes : JSON.parse(product.sizes)) : ["6", "7", "8", "9", "10", "11"];
  const colors = ["black", "white", "red", "blue", "green"];
  const availableStock = Number(product.quantity ?? 0);

  // --- HANDLERS ---
  const handleAddToCart = async () => {
    if (!selectedSize) return alert("Please select a size.");
    if (quantity > availableStock) return alert(`Only ${availableStock} left in stock.`);

    const success = await addToCart({
      id: product.id,
      size: selectedSize,
      color: selectedColor || "Default",
      quantity: quantity,
    });

    if (success) {
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    }
  };

  // FIX: Direct Buy Logic (Does NOT add to DB Cart)
  // This sends the user directly to checkout with ONLY this item
  const handleCheckout = () => {
    if (!selectedSize) return alert("Please select a size.");
    if (quantity > availableStock) return alert(`Only ${availableStock} left in stock.`);
    
    // Pass item details directly to checkout page via state
    const directItem = {
        product_id: product.id,
        product: product, // Pass full product object for display
        quantity: quantity,
        size: selectedSize,
        color: selectedColor || "Default"
    };

    navigate("/checkout", { state: { directItem } });
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
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      
      <div className="pd-page">
        {/* Navigation Header */}
        <div className="pd-nav-header">
            <button className="pd-back-link" onClick={() => navigate("/products")}>
                &larr; Back to Shop
            </button>
            <div className="pd-nav-controls">
                <button onClick={goPrev} disabled={productList.length <= 1}>Prev</button>
                <span>|</span>
                <button onClick={goNext} disabled={productList.length <= 1}>Next</button>
            </div>
        </div>

        <div className="pd-container">
          
          {/* Left Column: Image */}
          <div className="pd-image-section">
            <div className="pd-image-card">
                <img src={product.image} alt={product.name} className="pd-main-image" />
                {product.discount > 0 && <span className="pd-badge">-{product.discount}% OFF</span>}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="pd-info-section">
            <div className="pd-header">
                <p className="pd-brand">{product.brand}</p>
                <h1 className="pd-title">{product.name}</h1>
                <div className="pd-meta">
                    <div className="pd-rating">
                        <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar className="star-muted"/> 
                        <span>(4.0)</span>
                    </div>
                    <span className="pd-stock-status">
                        {availableStock > 0 ? `${availableStock} in Stock` : "Out of Stock"}
                    </span>
                </div>
            </div>

            <div className="pd-price-block">
                {product.discount > 0 ? (
                    <>
                        <span className="pd-price-new">₱{(product.price * (1 - product.discount / 100)).toLocaleString()}</span>
                        <span className="pd-price-old">₱{Number(product.price).toLocaleString()}</span>
                    </>
                ) : (
                    <span className="pd-price-new">₱{Number(product.price).toLocaleString()}</span>
                )}
            </div>

            <p className="pd-description">{product.description}</p>

            <div className="pd-options">
                {/* Colors */}
                <div className="pd-option-group">
                    <span className="pd-option-label">Select Color</span>
                    <div className="pd-color-list">
                        {colors.map((c) => (
                            <button
                                key={c}
                                className={`pd-color-btn ${c} ${selectedColor === c ? "active" : ""}`}
                                onClick={() => setSelectedColor(c)}
                                title={c}
                            />
                        ))}
                    </div>
                </div>

                {/* Sizes */}
                <div className="pd-option-group">
                    <div className="pd-option-header">
                        <span className="pd-option-label">Select Size</span>
                        <button className="pd-size-guide"><FaRulerCombined /> Size Guide</button>
                    </div>
                    <div className="pd-size-list">
                        {sizes.map((s) => (
                            <button
                                key={s}
                                className={`pd-size-btn ${selectedSize === s ? "active" : ""}`}
                                onClick={() => setSelectedSize(s)}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="pd-footer">
                <div className="pd-quantity-selector">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}>+</button>
                </div>

                <div className="pd-buttons">
                    <button 
                        className="pd-btn-cart" 
                        onClick={handleAddToCart}
                        disabled={availableStock === 0}
                    >
                        Add to Cart
                    </button>
                    <button 
                        className="pd-btn-buy" 
                        onClick={handleCheckout}
                        disabled={availableStock === 0}
                    >
                        Buy Now
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            <div className={`pd-toast ${showAdded ? "show" : ""}`}>
                Added to Cart Successfully!
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;