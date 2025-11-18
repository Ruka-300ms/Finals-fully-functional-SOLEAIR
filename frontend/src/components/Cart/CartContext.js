import React, { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  //Add product to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  //Remove product from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  //Update quantity manually (ex: in cart page)
  const updateQuantity = (id, newQty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: newQty > 0 ? newQty : 1 }
          : item
      )
    );
  };

  //Compute totals dynamically
  const { totalItems, totalPrice } = useMemo(() => {
    const totals = cartItems.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.totalPrice += item.price * item.quantity;
        return acc;
      },
      { totalItems: 0, totalPrice: 0 }
    );
    return totals;
  }, [cartItems]);

  //Clear entire cart
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
export const useCart = () => useContext(CartContext);
