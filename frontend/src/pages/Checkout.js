import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // Check for Direct Buy item
  const directItem = location.state?.directItem;
  const checkoutItems = directItem ? [directItem] : cartItems;

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
  
  // State to hold the final amount so it doesn't disappear when cart is cleared
  const [finalAmountPaid, setFinalAmountPaid] = useState(0);

  // --- NEW: AUTO-FILL SHIPPING INFO FROM PROFILE ---
  useEffect(() => {
    const userRaw = localStorage.getItem('user_info');
    if (userRaw) {
        try {
            const user = JSON.parse(userRaw);
            // Pre-fill the form with saved user details
            setShippingInfo(prev => ({
                ...prev,
                name: user.name || "",
                address: user.address || "", // Pulls address saved in Account Page
                phone: user.phone || ""      // Pulls phone saved in Account Page
            }));
        } catch (e) { 
            console.error("Error parsing user info for checkout auto-fill"); 
        }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };
  
  const handlePaymentChange = (method) => {
    setPayment(method);
    setPaymentAccount(""); 
  };

  // CALCULATE TOTALS based on the correct list (cart or direct item)
  const total = checkoutItems.reduce((sum, item) => {
    const productInfo = item.product || {}; 
    const price = productInfo.discount 
        ? productInfo.price * (1 - productInfo.discount / 100) 
        : productInfo.price;
    return sum + price * (item.quantity || 0);
  }, 0);
  
  const shippingFee = 150.00;
  const currentOrderTotal = total + shippingFee;

  // --- INTEGRATION: Place Order API Call ---
  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      alert("No items to checkout.");
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
        payment_details: payment === "Bank" ? paymentAccount : null,
        
        // Send direct item details if applicable
        direct_item: directItem ? {
            product_id: directItem.product_id,
            quantity: directItem.quantity,
            size: directItem.size,
            color: directItem.color
        } : null
      };

      const data = await embeddedAuthFetch("/checkout", {
        method: "POST",
        body: payload,
      });

      console.log("Order placed successfully:", data.order);
      
      // 1. Save the total BEFORE clearing the cart/state
      setFinalAmountPaid(currentOrderTotal);

      // 2. Clear cart ONLY if it was a cart checkout
      if (!directItem) {
          clearCart(); 
      }
      
      // 3. Show success screen
      setOrderPlaced(true);

    } catch (error) {
      console.error("Checkout Failed:", error);
      setErrorMessage(error.message || "An unknown error occurred during checkout.");
    } finally {
      setLoading(false);
    }
  };

  // EMPTY STATE (Only show if NOT direct buy and NO order placed)
  if (checkoutItems.length === 0 && !orderPlaced) {
    return (
        <div className="checkout-page">
            <div className="checkout-empty">
                <div className="empty-icon"><FaStore /></div>
                <h2>Your bag is empty</h2>
                <p>Fill it with exclusive styles before checking out.</p>
                <button className="co-btn-primary" onClick={() => navigate("/products")}>
                    Return to Shop
                </button>
            </div>
        </div>
    );
  }

  // SUCCESS STATE
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
            <div className="success-card">
            <div className="success-icon"><FaCheckCircle /></div>
            <h2>Order Confirmed</h2>
            <p className="success-msg">
                Thank you, <strong>{shippingInfo.name}</strong>. Your order has been received.
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
                    {/* FIX: Display the saved final total (including shipping) */}
                    <span>₱{finalAmountPaid.toLocaleString()}</span>
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
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="checkout-page">
        <div className="checkout-container">
            
            <button className="checkout-back" onClick={() => navigate(-1)}>
                <FaLongArrowAltLeft /> {directItem ? "Back to Product" : "Back to Cart"}
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
                                    <p className="bank-label">Transfer Amount: <strong>₱{currentOrderTotal.toLocaleString()}</strong></p>
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
                        <h3>Order Summary {directItem && "(Direct Buy)"}</h3>
                        
                        <div className="co-items-scroll">
                            {checkoutItems.map((item, idx) => {
                                const productInfo = item.product || {};
                                const price = productInfo.discount ? (productInfo.price * (1 - productInfo.discount / 100)) : productInfo.price;
                                return (
                                    <div key={idx} className="co-summary-item">
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
                            <span>₱{currentOrderTotal.toLocaleString()}</span>
                        </div>

                        <button 
                            className="co-place-order-btn" 
                            onClick={handlePlaceOrder} 
                            disabled={loading}
                        >
                            {loading ? "Processing..." : `Pay ₱${currentOrderTotal.toLocaleString()}`}
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