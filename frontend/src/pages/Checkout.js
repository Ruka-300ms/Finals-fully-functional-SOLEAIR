import React, { useContext, useState } from "react";
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

  const handlePlaceOrder = () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      alert("Please fill in all shipping details!");
      return;
    }
    if (!payment) {
      alert("Please select a payment method!");
      return;
    }
    setOrderPlaced(true);
    clearCart();
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.discount
          ? item.price * (1 - item.discount / 100)
          : item.price),
    0
  );

if (orderPlaced) {
  return (
    <div className="checkout-success">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h2>Order Confirmed</h2>
        <p>
          Thank you for shopping with <strong>Soleair</strong>.<br />
          Your order has been successfully placed and is now being processed.
        </p>

        <div className="order-details">
          <p><strong>Estimated Delivery:</strong> 3–5 business days</p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {payment === "COD" ? "Cash on Delivery" : "Bank Transfer"}
          </p>
        </div>

        <div className="success-buttons">
          <button
            className="continue-btn"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
          <button className="home-btn" onClick={() => navigate("/")}>
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
        {/* Left section: form */}
        <div className="checkout-form">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={shippingInfo.name}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Complete Address"
              value={shippingInfo.address}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Contact Number"
              value={shippingInfo.phone}
              onChange={handleInputChange}
            />
          </div>

          <h3>Payment Method</h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                value="COD"
                checked={payment === "COD"}
                onChange={(e) => setPayment(e.target.value)}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="Bank"
                checked={payment === "Bank"}
                onChange={(e) => setPayment(e.target.value)}
              />
              Bank Transfer
            </label>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>

        {/* Right section: order summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="summary-info">
                    <p className="item-name">{item.name}</p>
                    <p>Color: {item.color || "N/A"}</p>
                    <p>Size: {item.size || "N/A"}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>
                      ₱
                      {item.discount
                        ? (item.price * (1 - item.discount / 100)).toFixed(2)
                        : item.price.toFixed(2)}
                    </p>
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
