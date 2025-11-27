import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Shared components/pages
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import AccountPage from "./pages/AccountPage";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

// Product & Cart pages
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./components/Cart/CartPage";
import { CartProvider } from "./components/Cart/CartContext";

import "./App.css";

function AppContent() {
  const location = useLocation();

  // Hide Navbar & Footer on login and admin pages
  const hideNavAndFooter =
    location.pathname === "/login" || location.pathname === "/admin";

  // Footer only on homepage and about page
  const showFooter =
    location.pathname === "/" || location.pathname === "/about";

  return (
    <>
      {/* Hide Navbar on /login and /admin */}
      {!hideNavAndFooter && <Navbar />}

      <Routes>
        {/* Homepage is now the real "/" page */}
        <Route path="/" element={<Homepage />} />

        <Route path="/home" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {/* Footer only shows on homepage and about */}
      {!hideNavAndFooter && showFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
