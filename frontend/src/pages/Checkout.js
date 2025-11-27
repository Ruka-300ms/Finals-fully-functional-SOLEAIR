import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/Cart/CartContext";
import "../styles/Checkout.css";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [payment, setPayment] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  // Save order to localStorage history
  const saveOrderToHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem("orderHistory")) || [];
      const newOrders = cartItems.map((item) => ({
        ...item,
        orderDate: new Date().toISOString(),
        payment,
        shipping: shippingInfo,
      }));
      localStorage.setItem("orderHistory", JSON.stringify([...history, ...newOrders]));
    } catch (err) {
      console.error("Saving order history failed", err);
    }
  };

  // Update products' quantity (stock) in localStorage
  const updateProductStock = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("products")) || [];
      const updated = stored.map((p) => {
        const ordered = cartItems.find((c) => c.id === p.id && (c.size ? c.size === c.size : true));
        if (ordered) {
          const newQty = Number(p.quantity ?? 0) - Number(ordered.quantity ?? 0);
          return { ...p, quantity: Math.max(0, newQty) };
        }
        return p;
      });
      localStorage.setItem("products", JSON.stringify(updated));
      // trigger storage event for other tabs/components
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("updateProductStock error", err);
    }
  };

  const handlePlaceOrder = () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      alert("Please fill in all shipping details!");
      return;
    }
    if (!payment) {
      alert("Please select a payment method!");
      return;
    }

    // Save + update stock + clear cart
    saveOrderToHistory();
    updateProductStock();
    clearCart();
    setOrderPlaced(true);
  };

  const total = cartItems.reduce((sum, item) => {
    const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
    return sum + price * (item.quantity || 0);
  }, 0);

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Order Confirmed</h2>
          <p>
            Thank you for shopping with <strong>Soleair</strong>.<br />
            Your order has been placed successfully.
          </p>

          <div className="order-details">
            <p><strong>Estimated Delivery:</strong> 3–5 days</p>
            <p><strong>Payment Method:</strong> {payment === "COD" ? "Cash on Delivery" : "Bank Transfer"}</p>
          </div>

          <div className="success-buttons">
            <button className="continue-btn" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
            <button className="home-btn" onClick={() => navigate("/home")}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>Checkout</h2>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <input name="name" placeholder="Full Name" onChange={handleInputChange} value={shippingInfo.name} />
            <input name="address" placeholder="Complete Address" onChange={handleInputChange} value={shippingInfo.address} />
            <input name="phone" placeholder="Contact Number" onChange={handleInputChange} value={shippingInfo.phone} />
          </div>

          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label>
              <input type="radio" value="COD" checked={payment === "COD"} onChange={(e) => setPayment(e.target.value)} />
              Cash on Delivery
            </label>

            <label>
              <input type="radio" value="Bank" checked={payment === "Bank"} onChange={(e) => setPayment(e.target.value)} />
              Bank Transfer
            </label>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>

          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${item.size}-${item.color}-${idx}`} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-info">
                    <p className="item-name">{item.name}</p>
                    <p>Color: {item.color || "N/A"}</p>
                    <p>Size: {item.size || "N/A"}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>₱{(item.discount ? (item.price * (1 - item.discount / 100)).toFixed(2) : item.price.toFixed(2))}</p>
                  </div>
                </div>
              ))}

              <hr />

              <div className="summary-total">
                <h4>Total</h4>
                <h4>₱{total.toFixed(2)}</h4>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
