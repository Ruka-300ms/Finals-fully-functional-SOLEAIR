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
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Ensure premium fonts are loaded */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />

      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="logo">Soleair</Link>
        </div>

        <div className="nav-center">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/products?category=men">Men</Link></li>
            <li><Link to="/products?category=women">Women</Link></li>
            <li><Link to="/products?category=kids">Kids</Link></li>
          </ul>
        </div>

        <div className="nav-right">
          {/* Minimalist Search */}
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

          <div className="icon-group">
            <div className="cart-container">
              <Link to="/cart" aria-label="Shopping Cart">
                <FaShoppingCart className="nav-icon" />
                {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
              </Link>
            </div>

            <Link to="/account" aria-label="Account">
              <FaRegUser className="nav-icon" />
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;