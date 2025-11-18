import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "../../styles/CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const newQty = Math.max(1, item.quantity + delta);
      updateQuantity(id, newQty);
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="cart-back" onClick={() => navigate("/products")}>
          ← Back to Products
        </button>
        <h1 className="cart-title">Your Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty 🛒</p>
          <button className="cart-btn" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h2>{item.name}</h2>
                  <p>Size: {item.size}</p>
                  <p>Color: {item.color}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </div>

                  <p className="cart-item-price">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <p>
                Items:{" "}
                <span>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </p>
              <p>
                Total: <span>₱{totalPrice.toLocaleString()}</span>
              </p>
            </div>
            <div className="summary-actions">
              <button className="clear-cart" onClick={clearCart}>
                Clear Cart
              </button>
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
