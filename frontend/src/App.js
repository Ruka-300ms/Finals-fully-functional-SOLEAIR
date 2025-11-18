import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Shared components/pages
import Navbar from "./pages/Navbar";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import Account from "./pages/AccountPage";
import Checkout from "./pages/Checkout";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AccountPage from "./pages/AccountPage";


// Product & Cart pages
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./components/Cart/CartPage";
import { CartProvider } from "./components/Cart/CartContext";

import "./App.css";

function AppContent() {
  const location = useLocation();

  const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/admin";
  
  const showFooter = location.pathname === "/" || location.pathname === "/about";

  return (
    <>
      {/*Hide Navbar on /login */}
      {!hideNavAndFooter && <Navbar />}

      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/account" element={<AccountPage />} />
      </Routes>

      {/*Hide footer on /login*/}
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
