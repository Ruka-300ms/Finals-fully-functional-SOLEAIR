import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { FaShoppingCart, FaRegUser, FaSearch } from "react-icons/fa";
import { useCart } from "../components/Cart/CartContext";

function NavBar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // handle search
  const handleSearch = () => {
    const searchInput = document.getElementById("search-input").value.trim();
    if (searchInput) {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`);
      document.getElementById("search-input").value = "";
    } else {
      alert("Please enter a search term.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Soleair</Link>

      <ul className="nav-links">
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/about">ABOUT US</Link></li>
        <li><Link to="/products?category=men">MEN</Link></li>
        <li><Link to="/products?category=women">WOMEN</Link></li>
        <li><Link to="/products?category=kids">KIDS</Link></li>
      </ul>

      <div className="nav-icons">
        <div className="cart-container">
          <Link to="/cart" aria-label="Shopping Cart">
            <FaShoppingCart className="nav-icon" />
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </Link>
        </div>

        <Link to="/account" aria-label="Account">
          <FaRegUser className="nav-icon" />
        </Link>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            id="search-input"
            onKeyDown={handleKeyDown}
          />
          <FaSearch
            className="search-icon-inside"
            onClick={handleSearch}
          />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
