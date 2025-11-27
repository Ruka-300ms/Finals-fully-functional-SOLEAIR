import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // load cart from localStorage or start empty
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // keep cart in sync with localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // utility: find matching cart index (match by id + size + color)
  const findMatchingIndex = (items, product) =>
    items.findIndex(
      (i) =>
        i.id === product.id &&
        (i.size || "") === (product.size || "") &&
        (i.color || "") === (product.color || "")
    );

  // add to cart (merge if same product+size+color)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const idx = findMatchingIndex(copy, product);

      if (idx >= 0) {
        // merge: increase quantity but do not exceed available stock
        const existing = copy[idx];
        const newQty = existing.quantity + (product.quantity || 1);
        // productQuantity should read from product.quantity (stock) if provided
        const maxStock = product.quantity !== undefined ? product.quantity : existing.stock ?? Infinity;
        existing.quantity = Math.min(newQty, maxStock);
        copy[idx] = { ...existing };
        return copy;
      }

      // new cart item: ensure it has quantity property
      const toAdd = {
        ...product,
        quantity: product.quantity ?? 1,
      };
      return [...copy, toAdd];
    });
  };

  const removeFromCart = (id, size = undefined, color = undefined) => {
    setCartItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.id === id &&
            (size === undefined || i.size === size) &&
            (color === undefined || i.color === color)
          )
      )
    );
  };

  const updateQuantity = (id, newQty, size = undefined, color = undefined) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.id === id &&
          (size === undefined || item.size === size) &&
          (color === undefined || item.color === color)
        ) {
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
  };

  const totalPrice = cartItems.reduce((sum, it) => {
    const price = it.discount ? it.price * (1 - it.discount / 100) : it.price;
    return sum + price * (it.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        setCartItems, // exported for convenience (admin/test)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
