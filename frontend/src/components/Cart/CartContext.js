import React, { createContext, useContext, useEffect, useState } from "react";

// --- START: AUTHENTICATED FETCH LOGIC ---
const API_BASE_URL = 'http://localhost:8083/api';

/**
 * Executes an API request with the user's authentication token.
 */
async function embeddedAuthFetch(endpoint, config = {}) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new Error("Authentication required. Please log in.");
    }

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

    try {
        const response = await fetch(url, { ...config, headers });
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                console.warn("[API] 401 Unauthorized - Clearing Session");
                // Force logout if token is invalid
                localStorage.removeItem('auth_token'); 
                localStorage.removeItem('user_info');
            }
            throw new Error(data.message || `API Error: ${response.status}`);
        }

        return data;

    } catch (error) {
        console.error(`Fetch to ${endpoint} failed:`, error);
        throw error;
    }
}
// --- END: AUTHENTICATED FETCH LOGIC ---


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // FIX 1: Initialize isLoggedIn directly from localStorage to prevent "false" flash on reload
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('auth_token'));
  
  const [isCartLoading, setIsCartLoading] = useState(true);

  // --- 1. INITIAL LOAD & AUTH CHECK ---
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    
    // Sync state with storage
    setIsLoggedIn(!!token);

    const fetchCart = async () => {
      if (!token) {
        setCartItems([]);
        setIsCartLoading(false);
        return;
      }
      
      try {
        const data = await embeddedAuthFetch("/cart");
        setCartItems(data); 
      } catch (error) {
        console.error("Failed to load cart from DB:", error);
        // If error was 401, AuthFetch already cleared storage, so update state
        if (!localStorage.getItem('auth_token')) {
            setIsLoggedIn(false);
        }
        setCartItems([]);
      } finally {
        setIsCartLoading(false);
      }
    };

    fetchCart();
    
  }, []); // Run once on mount

  // --- 2. CORE CRUD FUNCTIONS (API CALLS) ---

  const addToCart = async (product) => {
    // FIX 2: Double check localStorage explicitly. 
    // Sometimes React state (isLoggedIn) updates slower than the user clicks.
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      setIsLoggedIn(false); // Ensure state matches
      alert("Please log in to add items to your cart.");
      return false;
    }

    // Prepare data payload for Laravel (Must use product.id, quantity, size, color)
    const payload = {
      product_id: product.id,
      quantity: product.quantity ?? 1, 
      size: product.size || null,
      color: product.color || null,
    };
    
    try {
      const response = await embeddedAuthFetch("/cart", {
        method: "POST",
        body: payload,
      });

      setCartItems(prev => {
        const newItem = response.data;
        // Find existing item by database ID (the cart row ID)
        const existingIdx = prev.findIndex(item => item.id === newItem.id);

        if (existingIdx !== -1) {
          // Server successfully incremented quantity of an existing item
          const updatedCart = [...prev];
          updatedCart[existingIdx] = newItem;
          return updatedCart;
        } else {
          // Server created a new item
          return [...prev, newItem];
        }
      });
      return true;
      
    } catch (error) {
      // If the token was invalid, update state so UI reflects logged out
      if (!localStorage.getItem('auth_token')) {
          setIsLoggedIn(false);
      }
      alert(error.message || "Failed to add item to cart.");
      return false;
    }
  };

  // Note: This function requires the DB cart item ID, NOT the product ID
  const removeFromCart = async (cartItemId) => {
    if (!localStorage.getItem('auth_token')) return;

    try {
      await embeddedAuthFetch(`/cart/${cartItemId}`, { method: "DELETE" });
      
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));

    } catch (error) {
      alert(error.message || "Failed to remove item from cart.");
    }
  };

  // Note: This function requires the DB cart item ID, NOT the product ID
  const updateQuantity = async (cartItemId, newQty) => {
    if (!localStorage.getItem('auth_token') || newQty < 1) return;

    try {
      const response = await embeddedAuthFetch(`/cart/${cartItemId}`, {
        method: "PUT",
        body: { quantity: newQty },
      });
      
      setCartItems(prev => prev.map(item => 
        item.id === cartItemId ? response.data : item
      ));

    } catch (error) {
      alert(error.message || "Failed to update quantity.");
    }
  };

  const clearCart = async () => {
    if (!localStorage.getItem('auth_token')) return;

    // Delete items one by one via API
    const deletePromises = cartItems.map(item => 
        embeddedAuthFetch(`/cart/${item.id}`, { method: "DELETE" }).catch(e => console.error(e))
    );
    
    await Promise.all(deletePromises);
    
    setCartItems([]);
  };
  
  // CALCULATIONS
  const totalPrice = cartItems.reduce((sum, it) => {
    // Access nested product details (item.product.price)
    const price = it.product && it.product.discount 
        ? it.product.price * (1 - it.product.discount / 100) 
        : (it.product ? it.product.price : 0);
    return sum + price * (it.quantity || 1);
  }, 0);

  if (isCartLoading) return <p>Loading shopping cart...</p>;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);