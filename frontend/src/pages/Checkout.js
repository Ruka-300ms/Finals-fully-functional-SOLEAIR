import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/Cart/CartContext";
import "../styles/Checkout.css";
// Added icons for a cleaner look
import { FaLongArrowAltLeft, FaShippingFast, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaStore, FaLock } from "react-icons/fa";

// --- AUTHENTICATED FETCH LOGIC (MUST MATCH CartContext) ---
const API_BASE_URL = 'http://localhost:8083/api';

async function embeddedAuthFetch(endpoint, config = {}) {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error("Authentication required. Please log in.");
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(config.headers || {}),
    };
    const url = `${API_BASE_URL}${endpoint}`;
    
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, { ...config, headers });
    const data = await response.json();

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('auth_token'); 
            localStorage.removeItem('user_info');
        }
        throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }
    return data;
}
// --- END AUTHENTICATED FETCH LOGIC ---


const Checkout = () => {
  const { cartItems, clearCart } = useCart(); 
  const navigate = useNavigate();

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [payment, setPayment] = useState("COD");
  const [paymentAccount, setPaymentAccount] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  
  const handlePaymentChange = (method) => {
    setPayment(method);
    setPaymentAccount(""); 
  };

  // --- INTEGRATION: Place Order API Call ---
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Cannot place an order.");
      return;
    }
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.phone) {
      alert("Please fill in all shipping details!");
      return;
    }
    
    if (payment === "Bank" && !paymentAccount) {
        alert("Please enter the Bank/Gcash account number.");
        return;
    }
    
    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        shipping_address: shippingInfo.address,
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        payment_method: payment,
        payment_details: payment === "Bank" ? paymentAccount : null
      };

      const data = await embeddedAuthFetch("/checkout", {
        method: "POST",
        body: payload,
      });

      console.log("Order placed successfully:", data.order);
      
      clearCart(); 
      setOrderPlaced(true);

    } catch (error) {
      console.error("Checkout Failed:", error);
      setErrorMessage(error.message || "An unknown error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const total = cartItems.reduce((sum, item) => {
    const productInfo = item.product || {}; 
    const price = productInfo.discount 
        ? productInfo.price * (1 - productInfo.discount / 100) 
        : productInfo.price;
    return sum + price * (item.quantity || 0);
  }, 0);
  
  const shippingFee = 150.00;
  const orderTotal = total + shippingFee;

  if (cartItems.length === 0 && !orderPlaced) {
    return (
        <div className="checkout-empty">
            <div className="empty-icon"><FaStore /></div>
            <h2>Your bag is empty</h2>
            <p>Fill it with exclusive styles before checking out.</p>
            <button className="co-btn-primary" onClick={() => navigate("/products")}>
                Return to Shop
            </button>
        </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <div className="success-card">
          <div className="success-icon"><FaCheckCircle /></div>
          <h2>Order Confirmed</h2>
          <p className="success-msg">
            Thank you, <strong>{shippingInfo.name}</strong>. Your order has been received and is being processed.
          </p>

          <div className="order-receipt">
            <div className="receipt-row">
                <span>Payment Method</span>
                <strong>{payment === "COD" ? "Cash on Delivery" : "Bank Transfer"}</strong>
            </div>
            <div className="receipt-row">
                <span>Estimated Delivery</span>
                <strong>3–5 Business Days</strong>
            </div>
            <div className="receipt-total">
                <span>Amount Paid</span>
                <span>₱{orderTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="success-buttons">
            <button className="co-btn-secondary" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
            <button className="co-btn-primary" onClick={() => navigate("/home")}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="checkout-page">
        <div className="checkout-container">
            
            <button className="checkout-back" onClick={() => navigate(-1)}>
                <FaLongArrowAltLeft /> Back to Cart
            </button>
            
            <h1 className="checkout-title">Secure Checkout</h1>

            <div className="checkout-layout">
                {/* --- LEFT COLUMN: FORMS --- */}
                <div className="checkout-main">
                    
                    {/* STEP 1 */}
                    <div className="checkout-section">
                        <div className="section-header">
                            <span className="step-num">1</span>
                            <h3>Shipping Information</h3>
                        </div>
                        
                        {errorMessage && <div className="co-error">{errorMessage}</div>}
                        
                        <div className="co-form-grid">
                            <div className="co-input-group full">
                                <label>Full Name</label>
                                <input name="name" placeholder="e.g. Juan Dela Cruz" onChange={handleInputChange} value={shippingInfo.name} />
                            </div>
                            <div className="co-input-group full">
                                <label>Complete Address</label>
                                <input name="address" placeholder="Unit, Street, Barangay, City, Province" onChange={handleInputChange} value={shippingInfo.address} />
                            </div>
                            <div className="co-input-group full">
                                <label>Contact Number</label>
                                <input name="phone" placeholder="09xxxxxxxxx" onChange={handleInputChange} value={shippingInfo.phone} />
                            </div>
                        </div>
                    </div>

                    {/* STEP 2 */}
                    <div className="checkout-section">
                        <div className="section-header">
                            <span className="step-num">2</span>
                            <h3>Payment Method</h3>
                        </div>

                        <div className="payment-options">
                            <div 
                                className={`payment-card ${payment === "COD" ? "active" : ""}`}
                                onClick={() => handlePaymentChange("COD")}
                            >
                                <div className="radio-circle"></div>
                                <div className="payment-info">
                                    <span className="payment-title"><FaMoneyBillWave /> Cash on Delivery</span>
                                    <span className="payment-desc">Pay safely upon delivery.</span>
                                </div>
                            </div>

                            <div 
                                className={`payment-card ${payment === "Bank" ? "active" : ""}`}
                                onClick={() => handlePaymentChange("Bank")}
                            >
                                <div className="radio-circle"></div>
                                <div className="payment-info">
                                    <span className="payment-title"><FaCreditCard /> Bank Transfer / GCash</span>
                                    <span className="payment-desc">Direct transfer for faster processing.</span>
                                </div>
                            </div>
                        </div>

                        {/* DYNAMIC PAYMENT DETAILS */}
                        <div className="payment-content-area">
                            {payment === "COD" && (
                                <div className="info-box cod-box">
                                    <p className="confirm-label"><FaShippingFast /> <strong>Confirm Shipping Details:</strong></p>
                                    <div className="confirm-details">
                                        <p>{shippingInfo.name || "Full Name"}</p>
                                        <p>{shippingInfo.address || "Address"}</p>
                                        <p>{shippingInfo.phone || "Phone"}</p>
                                    </div>
                                </div>
                            )}

                            {payment === "Bank" && (
                                <div className="info-box bank-box">
                                    <p className="bank-label">Transfer Amount: <strong>₱{orderTotal.toLocaleString()}</strong></p>
                                    <div className="bank-details">
                                        <p><strong>BDO:</strong> 0012-3456-7890 (Soleair Inc.)</p>
                                        <p><strong>GCash:</strong> 0917-123-4567 (Billing)</p>
                                    </div>
                                    <label className="ref-label">Enter Reference No. / Account Name</label>
                                    <input 
                                        type="text" 
                                        className="co-input-ref"
                                        placeholder="e.g. Ref: 10023485" 
                                        value={paymentAccount} 
                                        onChange={(e) => setPaymentAccount(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: SUMMARY --- */}
                <div className="checkout-sidebar">
                    <div className="co-summary-card">
                        <h3>Order Summary</h3>
                        
                        <div className="co-items-scroll">
                            {cartItems.map((item) => {
                                const productInfo = item.product || {};
                                const price = productInfo.discount ? (productInfo.price * (1 - productInfo.discount / 100)) : productInfo.price;
                                return (
                                    <div key={item.id} className="co-summary-item">
                                        <div className="co-img-box">
                                            <img src={productInfo.image} alt={productInfo.name} />
                                            <span className="co-qty-badge">{item.quantity}</span>
                                        </div>
                                        <div className="co-item-details">
                                            <p className="co-item-name">{productInfo.name}</p>
                                            <p className="co-item-variant">{item.size} / {item.color}</p>
                                        </div>
                                        <p className="co-item-price">₱{(price * item.quantity).toLocaleString()}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="co-divider"></div>

                        <div className="co-row">
                            <span>Subtotal</span>
                            <span>₱{total.toLocaleString()}</span>
                        </div>
                        <div className="co-row">
                            <span>Shipping</span>
                            <span>₱{shippingFee.toLocaleString()}</span>
                        </div>
                        
                        <div className="co-divider"></div>

                        <div className="co-row total">
                            <span>Total</span>
                            <span>₱{orderTotal.toLocaleString()}</span>
                        </div>

                        <button 
                            className="co-place-order-btn" 
                            onClick={handlePlaceOrder} 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Pay ₱${orderTotal.toLocaleString()}`}
                        </button>

                        <div className="co-security">
                            <FaLock /> SSL Secure Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;