import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/Cart/CartContext";
import "../styles/AccountPage.css";

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


const AccountPage = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart(); 

    // Dynamic State for the logged-in user
    const [userProfile, setUserProfile] = useState(null);
    const [orders, setOrders] = useState([]); // Will hold orders from API
    const [activeSection, setActiveSection] = useState("none");
    const [loadingOrders, setLoadingOrders] = useState(false);


    // --- 1. LOAD USER PROFILE & INITIAL DATA ---
    useEffect(() => {
        const userInfoRaw = localStorage.getItem("user_info");
        const token = localStorage.getItem("auth_token");

        if (userInfoRaw && token) {
            try {
                const userInfo = JSON.parse(userInfoRaw);
                setUserProfile(userInfo);
                fetchOrderHistory(token); // Fetch orders once user is loaded
            } catch (error) {
                console.error("Failed to parse user info:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);
    
    // --- 2. FETCH ORDERS FROM BACKEND API ---
    const fetchOrderHistory = async (token) => {
        setLoadingOrders(true);
        try {
            // Using the embedded authenticated fetch function
            const data = await embeddedAuthFetch('/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch order history:", error);
            // Handle specific redirect if needed
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleLogout = () => {
        // Clear Authentication tokens and user data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_info");
        
        clearCart(); // Clear cart context
        navigate("/login");
    };
    
    // --- HELPER FUNCTION: Get joined date string ---
    const getJoinedDate = (createdAt) => {
        if (!createdAt) return "N/A";
        const date = new Date(createdAt);
        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }

    // --- SECTION CONTENT RENDERER (Updated to use DB orders) ---
    const renderSection = () => {
        const profile = userProfile;
        
        switch (activeSection) {
            case "orders":
                return (
                    <div className="section-box">
                        <h2>Your Orders</h2>
                        {loadingOrders && <p>Loading order history...</p>}

                        {!loadingOrders && orders.length === 0 ? (
                            <p>You have no orders yet.</p>
                        ) : (
                            orders.map((order, index) => (
                                <div key={order.id} className="order-card">
                                    <p className="order-id">Order ID: #{order.id}</p>
                                    <p className="order-status">Status: {order.status}</p>
                                    <p className="order-date">Placed: {new Date(order.created_at).toLocaleDateString()}</p>
                                    <h4 className="order-total-amount">Total: ₱{Number(order.total_amount).toLocaleString()}</h4>

                                    <div className="order-items-list">
                                        {/* Assuming your order has an 'items' relation that contains product info */}
                                        {order.items && order.items.map(item => (
                                            <div key={item.id} className="order-item-detail">
                                                <img src={item.product.image} alt={item.product.name} />
                                                <p>{item.product.name} ({item.size}) x {item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );

            case "billing":
                return (
                    <div className="section-box">
                        <h2>Billing Address</h2>
                        <p>Name: {profile.name}</p>
                        <p>Email: {profile.email}</p>
                        <p>Address: 123 Main Street, Manila (Placeholder)</p>
                        <p>Phone: 0912 345 6789 (Placeholder)</p>
                        <button className="edit-btn" onClick={() => alert('Editing feature not implemented yet.')}>Update Billing</button>
                    </div>
                );

            case "shipping":
                return (
                    <div className="section-box">
                        <h2>Shipping Address</h2>
                        <p>Name: {profile.name}</p>
                        <p>Address: 123 Main Street, Manila (Placeholder)</p>
                        <p>Phone: 0912 345 6789 (Placeholder)</p>
                        <button className="edit-btn" onClick={() => alert('Editing feature not implemented yet.')}>Update Shipping</button>
                    </div>
                );

            case "password":
                return (
                    <div className="section-box">
                        <h2>Change Password</h2>
                        <input type="password" placeholder="Current Password" />
                        <input type="password" placeholder="New Password" />
                        <input type="password" placeholder="Confirm Password" />
                        <button className="save-btn" onClick={() => alert('Password update logic requires API implementation.')}>Update Password</button>
                    </div>
                );

            default:
                return (
                    <div className="section-box">
                        <h2>Select an option to view details</h2>
                    </div>
                );
        }
    };
    
    if (!userProfile) {
        return <div className="account-loading">Redirecting to login...</div>;
    }
    
    // --- Dynamic Profile Variables ---
    const userName = userProfile.name || userProfile.username || "Guest User";
    const userEmail = userProfile.email || "N/A";
    const userJoined = getJoinedDate(userProfile.created_at);
    // Note: Phone/Address are still static as the user DB table doesn't save them from register yet


    return (
        <div className="account-body">
            <div className="account-container">

                {/* LEFT PANEL */}
                <div className="profile-section">
                    {/* SVG User Icon (Anonymous Placeholder) */}
                    <svg className="profile-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.93 12 12 12 8.5 10.43 8.5 8.5 10.07 5 12 5zm0 14.2c-2.5 0-4.71-1.35-5.96-3.38.03-2.42 4.04-3.53 5.96-3.53 1.93 0 5.94 1.11 5.96 3.53-1.25 2.03-3.46 3.38-5.96 3.38z"/>
                    </svg>

                    {/* Dynamic Profile Data */}
                    <h2>{userName}</h2>
                    <p>{userEmail}</p>
                    <p><i className="fa-solid fa-phone"></i> {userProfile.phone || "0912 345 6789"}</p>
                    <p><i className="fa-solid fa-house"></i> {userProfile.address || "123 Main Street, Manila"}</p>
                    <p>Joined: {userJoined}</p>
                    <div className="role">{userProfile.role || "Customer"}</div>

                    <button className="edit-btn" onClick={() => alert('Profile editing is not implemented yet.')}>
                        Edit Profile
                    </button>
                    
                </div>

                {/* RIGHT PANEL */}
                <div className="functions-section">

                    {/* DYNAMIC GREETING */}
                    <h1>Welcome back, {userName.split(" ")[0]}!</h1>

                    <div className="button-grid">
                        <div className="function-btn" onClick={() => setActiveSection("orders")}>
                            <i className="fa-solid fa-box"></i>
                            <p>Orders</p>
                        </div>

                        <div className="function-btn" onClick={() => setActiveSection("billing")}>
                            <i className="fa-solid fa-file-invoice"></i>
                            <p>Billing Address</p>
                        </div>

                        <div className="function-btn" onClick={() => setActiveSection("shipping")}>
                            <i className="fa-solid fa-truck"></i>
                            <p>Shipping Address</p>
                        </div>

                        <div className="function-btn" onClick={() => setActiveSection("password")}>
                            <i className="fa-solid fa-lock"></i>
                            <p>Change Password</p>
                        </div>

                        <div className="function-btn" onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <p>Logout</p>
                        </div>
                    </div>

                    {/* Dynamic Section Content */}
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};

export default AccountPage;