import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AccountPage.css";

const AccountPage = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+63 912 345 6789",
    address: "123 Main Street, Manila",
    joined: "January 2023",
    role: "Customer",
    image: "https://i.pravatar.cc/150?img=12",
  });

  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("none");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load previous orders from localStorage (cart history)
    const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(orderHistory);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const saveProfile = () => {
    alert("Profile updated successfully!");
    setEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  // SECTION CONTENT RENDERER
  const renderSection = () => {
    switch (activeSection) {
   case "orders":
  return (
    <div className="section-box">
      <h2>Your Orders</h2>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((item, index) => (
          <div key={index} className="order-card">
            <img src={item.image} alt={item.name} />

            <div className="order-info">
              <h3>{item.name}</h3>
              <p>Size: {item.size}</p>
              <p>Color: {item.color}</p>
              <p>Quantity: {item.quantity}</p>
              <p className="order-total">
                Total: ₱{(item.price * item.quantity).toLocaleString()}
              </p>
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
            <p>{profile.name}</p>
            <p>{profile.address}</p>
            <p>{profile.phone}</p>
          </div>
        );

      case "shipping":
        return (
          <div className="section-box">
            <h2>Shipping Address</h2>
            <p>{profile.name}</p>
            <p>{profile.address}</p>
          </div>
        );

      case "password":
        return (
          <div className="section-box">
            <h2>Change Password</h2>
            <input type="password" placeholder="Current Password" />
            <input type="password" placeholder="New Password" />
            <input type="password" placeholder="Confirm Password" />
            <button className="save-btn">Update Password</button>
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

  return (
    <div className="account-body">
      <div className="account-container">

        {/* LEFT PANEL */}
        <div className="profile-section">
          <img src={profile.image} alt="User Profile" />
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          <p><i className="fa-solid fa-phone"></i> {profile.phone}</p>
          <p><i className="fa-solid fa-house"></i> {profile.address}</p>
          <p>Joined: {profile.joined}</p>
          <div className="role">{profile.role}</div>

          {!editing && (
            <button className="edit-btn" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          )}

          {editing && (
            <div className="edit-form">
              <input id="name" value={profile.name} onChange={handleChange} />
              <input id="email" value={profile.email} onChange={handleChange} />
              <input id="phone" value={profile.phone} onChange={handleChange} />
              <input
                id="address"
                value={profile.address}
                onChange={handleChange}
              />
              <button onClick={saveProfile}>Save</button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="functions-section">

          <h1>Welcome back, {profile.name.split(" ")[0]}!</h1>

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
