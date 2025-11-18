import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AccountPage.css";

const AccountPage = () => {
  const navigate = useNavigate();

  // initial profile info
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
      // You can clear stored session data here if you use localStorage
      // localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className = "account-body">
    <div className="account-container">
      {/* LEFT SIDE: USER PROFILE */}
      <div className="profile-section">
        <img src={profile.image} alt="User Profile" />
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
        <p>
          <i className="fa-solid fa-phone"></i> {profile.phone}
        </p>
        <p>
          <i className="fa-solid fa-house"></i> {profile.address}
        </p>
        <p>Joined: {profile.joined}</p>
        <div className="role">{profile.role}</div>

        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
        )}

        {editing && (
          <div className="edit-form">
            <input
              type="text"
              id="name"
              value={profile.name}
              placeholder="Full Name"
              onChange={handleChange}
            />
            <input
              type="email"
              id="email"
              value={profile.email}
              placeholder="Email"
              onChange={handleChange}
            />
            <input
              type="text"
              id="phone"
              value={profile.phone}
              placeholder="Phone Number"
              onChange={handleChange}
            />
            <input
              type="text"
              id="address"
              value={profile.address}
              placeholder="Address"
              onChange={handleChange}
            />
            <button onClick={saveProfile}>Save</button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE: FUNCTION BUTTONS */}
      <div className="functions-section">
        <h1>Welcome back, {profile.name.split(" ")[0]}!</h1>
        <div className="button-grid">
          <div className="function-btn">
            <i className="fa-solid fa-box"></i>
            <p>Orders</p>
          </div>
          <div className="function-btn">
            <i className="fa-solid fa-file-invoice"></i>
            <p>Billing Address</p>
          </div>
          <div className="function-btn">
            <i className="fa-solid fa-truck"></i>
            <p>Shipping Address</p>
          </div>
          <div className="function-btn">
            <i className="fa-solid fa-lock"></i>
            <p>Change Password</p>
          </div>
          <div className="function-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i>
            <p>Logout</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AccountPage;
