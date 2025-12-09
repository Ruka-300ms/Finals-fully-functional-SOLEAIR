import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/Cart/CartContext";
import "../styles/AccountPage.css";
import { FaBox, FaMapMarkerAlt, FaLock, FaSignOutAlt, FaUser, FaHistory, FaTimesCircle, FaCheckCircle, FaEdit, FaSave } from "react-icons/fa";

// --- AUTHENTICATED FETCH LOGIC ---
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
        throw new Error(data.message || `API Error: ${response.status}`);
    }
    return data;
}
// --- END AUTHENTICATED FETCH LOGIC ---

const AccountPage = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart(); 

    const [userProfile, setUserProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [activeSection, setActiveSection] = useState("orders");
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Profile Editing State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        address: "",
        phone: ""
    });

    // Change Password State
    const [cpStep, setCpStep] = useState(1); 
    const [cpToken, setCpToken] = useState("");
    const [cpPassword, setCpPassword] = useState("");
    const [cpConfirm, setCpConfirm] = useState("");
    const [cpMsg, setCpMsg] = useState("");
    const [cpError, setCpError] = useState("");

    useEffect(() => {
        const userInfoRaw = localStorage.getItem("user_info");
        const token = localStorage.getItem("auth_token");

        if (userInfoRaw && token) {
            try {
                const userInfo = JSON.parse(userInfoRaw);
                setUserProfile(userInfo);
                // Initialize form with existing data
                setProfileForm({
                    address: userInfo.address || "",
                    phone: userInfo.phone || ""
                });
                fetchOrderHistory();
            } catch (error) {
                console.error("Failed to parse user info:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);
    
    const fetchOrderHistory = async () => {
        setLoadingOrders(true);
        try {
            const data = await embeddedAuthFetch('/orders');
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch order history:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    // --- UPDATE PROFILE (ADDRESS/PHONE) ---
    const handleUpdateProfile = async () => {
        try {
            const res = await embeddedAuthFetch('/user/profile', {
                method: 'PUT',
                body: profileForm
            });
            
            // Update local state and storage
            const updatedUser = { ...userProfile, ...profileForm };
            setUserProfile(updatedUser);
            localStorage.setItem("user_info", JSON.stringify(updatedUser));
            
            setIsEditingProfile(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert("Failed to update profile: " + error.message);
        }
    };

    const handleLogout = () => {
        if(window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");
            clearCart();
            navigate("/login");
        }
    };
    
    const handleCancelOrder = async (orderId) => {
        if(!window.confirm("Are you sure you want to cancel this order? Stock will be restored.")) return;
        try {
            await embeddedAuthFetch(`/orders/${orderId}/cancel`, { method: 'PUT' });
            alert("Order cancelled successfully.");
            fetchOrderHistory(); 
        } catch (error) {
            alert(error.message);
        }
    };

    const requestChangeToken = async () => {
        setCpError(""); setCpMsg("");
        try {
            const res = await embeddedAuthFetch('/user/request-password-change', { method: 'POST' });
            alert(`DEV MODE TOKEN: ${res.token}`); 
            setCpStep(2);
            setCpMsg("Token sent! Check your console/alert.");
        } catch (error) {
            setCpError(error.message);
        }
    };

    const submitPasswordChange = async () => {
        setCpError(""); setCpMsg("");
        if (cpPassword !== cpConfirm) return setCpError("Passwords do not match");
        
        try {
            await embeddedAuthFetch('/user/change-password', {
                method: 'POST',
                body: { token: cpToken, password: cpPassword, password_confirmation: cpConfirm }
            });
            alert("Password changed successfully!");
            setCpStep(1);
            setCpPassword(""); setCpConfirm(""); setCpToken("");
        } catch (error) {
            setCpError(error.message);
        }
    };

    if (!userProfile) return <div className="account-loading">Loading...</div>;
    
    const userName = userProfile.name || userProfile.username || "Guest";
    const userEmail = userProfile.email || "N/A";

    const renderSection = () => {
        switch (activeSection) {
            case "orders":
                return (
                    <div className="content-panel">
                        <h2><FaHistory /> Order History</h2>
                        {loadingOrders ? <div className="loader"></div> : (
                            orders.length === 0 ? <div className="empty-state"><p>You haven't placed any orders yet.</p><button onClick={() => navigate('/products')}>Start Shopping</button></div> : 
                            <div className="orders-grid">
                                {orders.map(order => (
                                    <div key={order.id} className="order-item-card">
                                        <div className="order-header">
                                            <span className="order-id">Order #{order.id}</span>
                                            <span className={`status-tag ${order.status}`}>{order.status}</span>
                                        </div>
                                        
                                        <div className="order-meta">
                                            <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                            <p>Total: <strong>₱{Number(order.total_amount).toLocaleString()}</strong></p>
                                            <div className="shipping-box">
                                                <FaMapMarkerAlt className="icon"/>
                                                <span>{order.shipping_address || "No address provided"}</span>
                                            </div>
                                        </div>

                                        <div className="order-products">
                                            {order.items && order.items.map(item => (
                                                <div key={item.id} className="op-item">
                                                    <img src={item.product?.image} alt={item.product?.name} />
                                                    <div>
                                                        <p className="op-name">{item.product?.name}</p>
                                                        <p className="op-qty">x{item.quantity} ({item.size || 'N/A'})</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {(order.status === 'processing' || order.status === 'pending') && (
                                            <button className="cancel-order-btn" onClick={() => handleCancelOrder(order.id)}>
                                                <FaTimesCircle /> Cancel Order
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );

            case "shipping":
                return (
                    <div className="content-panel">
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px', borderBottom:'1px solid #eee', paddingBottom:'15px'}}>
                            <h2 style={{margin:0, border:0, padding:0}}><FaMapMarkerAlt /> Shipping Profile</h2>
                            {!isEditingProfile ? (
                                <button className="ap-btn primary" style={{width:'auto'}} onClick={() => setIsEditingProfile(true)}>
                                    <FaEdit /> Edit Details
                                </button>
                            ) : (
                                <button className="ap-btn primary" style={{width:'auto'}} onClick={handleUpdateProfile}>
                                    <FaSave /> Save Changes
                                </button>
                            )}
                        </div>

                        <div className="cp-step-box">
                            <p style={{marginBottom:'20px'}}>These details will be automatically used for your future checkouts.</p>
                            
                            <div className="ap-input-group">
                                <label>Full Name</label>
                                <input type="text" value={userProfile.name} disabled className="disabled-input"/>
                                <small style={{color:'#999'}}>To change name, please contact support.</small>
                            </div>

                            <div className="ap-input-group">
                                <label>Complete Address</label>
                                <input 
                                    type="text" 
                                    value={isEditingProfile ? profileForm.address : (userProfile.address || "Not set")} 
                                    onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                                    disabled={!isEditingProfile}
                                    placeholder="Unit, Street, Barangay, City, Province"
                                />
                            </div>

                            <div className="ap-input-group">
                                <label>Phone Number</label>
                                <input 
                                    type="text" 
                                    value={isEditingProfile ? profileForm.phone : (userProfile.phone || "Not set")} 
                                    onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                    disabled={!isEditingProfile}
                                    placeholder="09xxxxxxxxx"
                                />
                            </div>
                            
                            {isEditingProfile && (
                                <button className="ap-btn text" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                            )}
                        </div>
                    </div>
                );

            case "password":
                return (
                    <div className="content-panel password-panel">
                        <h2><FaLock /> Change Password</h2>
                        {cpStep === 1 ? (
                            <div className="cp-step-box">
                                <p>To secure your account, we need to verify it's you. Click below to generate a secure change token.</p>
                                <button className="ap-btn primary" onClick={requestChangeToken}>Get Change Token</button>
                                {cpError && <p className="error-text">{cpError}</p>}
                            </div>
                        ) : (
                            <div className="cp-step-box form-step">
                                {cpMsg && <p className="success-msg"><FaCheckCircle/> {cpMsg}</p>}
                                {cpError && <p className="error-text">{cpError}</p>}
                                
                                <div className="ap-input-group">
                                    <label>Security Token</label>
                                    <input type="text" value={cpToken} onChange={e => setCpToken(e.target.value)} placeholder="Paste token here" />
                                </div>
                                <div className="ap-input-group">
                                    <label>New Password</label>
                                    <input type="password" value={cpPassword} onChange={e => setCpPassword(e.target.value)} placeholder="New password" />
                                </div>
                                <div className="ap-input-group">
                                    <label>Confirm Password</label>
                                    <input type="password" value={cpConfirm} onChange={e => setCpConfirm(e.target.value)} placeholder="Confirm password" />
                                </div>
                                <div className="cp-actions">
                                    <button className="ap-btn primary" onClick={submitPasswordChange}>Update Password</button>
                                    <button className="ap-btn text" onClick={() => setCpStep(1)}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default: return null;
        }
    };

    return (
        <div className="account-page-wrapper">
            <div className="account-sidebar">
                <div className="user-snapshot">
                    <div className="avatar-circle">{userName.charAt(0).toUpperCase()}</div>
                    <div className="user-text">
                        <h3>{userName}</h3>
                        <p>{userEmail}</p>
                    </div>
                </div>
                <nav className="account-nav">
                    <button className={activeSection === "orders" ? "active" : ""} onClick={() => setActiveSection("orders")}>
                        <FaBox /> My Orders
                    </button>
                    <button className={activeSection === "shipping" ? "active" : ""} onClick={() => setActiveSection("shipping")}>
                        <FaMapMarkerAlt /> Shipping Info
                    </button>
                    <button className={activeSection === "password" ? "active" : ""} onClick={() => setActiveSection("password")}>
                        <FaLock /> Security
                    </button>
                    <button className="logout-link" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </nav>
            </div>

            <div className="account-content">
                <div className="account-header-mobile">
                    <h1>Account Overview</h1>
                </div>
                {renderSection()}
            </div>
        </div>
    );
};

export default AccountPage;