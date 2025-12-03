import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import "../../styles/CartPage.css";
// Added icons for a cleaner look
import { FaTrashAlt, FaMinus, FaPlus, FaLongArrowAltLeft, FaShoppingBag } from "react-icons/fa";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  // The 'item' is now the full cart row object from the database
  const handleQuantityChange = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    const maxStock = item.product?.quantity ?? Infinity;
    updateQuantity(item.id, Math.min(newQty, maxStock)); 
  };
  
  const getItemInfo = (item) => item.product || {};

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = totalItems > 0 ? 150.00 : 0.00;
  const grandTotal = totalPrice + shippingFee;

  return (
    <>
      {/* Inject Premium Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="cart-page">
        <div className="cart-container">
            
            <div className="cart-header">
                <button className="cart-back" onClick={() => navigate("/products")}>
                <FaLongArrowAltLeft /> Continue Shopping
                </button>
                <h1 className="cart-title">Shopping Bag <span className="cart-count">({totalItems})</span></h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="cart-empty">
                    <div className="empty-icon"><FaShoppingBag /></div>
                    <h2>Your bag is empty</h2>
                    <p>Looks like you haven't made your choice yet.</p>
                    <button className="cart-btn-primary" onClick={() => navigate("/products")}>
                        Explore Collection
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                {/* --- LEFT: ITEMS LIST --- */}
                <div className="cart-items-section">
                    <div className="cart-items-header">
                        <span>Product</span>
                        <span className="mobile-hide">Quantity</span>
                        <span className="mobile-hide">Total</span>
                    </div>

                    <div className="cart-items-list">
                        {cartItems.map((item) => {
                            const productInfo = getItemInfo(item);
                            const calculatedPrice = productInfo.discount 
                                ? productInfo.price * (1 - productInfo.discount / 100) 
                                : productInfo.price;
                            const maxStock = productInfo.quantity ?? 0;
                                
                            return (
                                <div className="cart-item" key={item.id}> 
                                    <div className="item-main">
                                        <div className="item-img-wrapper">
                                            <img src={productInfo.image} alt={productInfo.name} />
                                        </div>
                                        <div className="item-details">
                                            <h3>{productInfo.name}</h3>
                                            <p className="item-brand">{productInfo.brand}</p>
                                            <div className="item-variants">
                                                <span>Size: {item.size}</span>
                                                <span className="divider">|</span>
                                                <span>Color: {item.color}</span>
                                            </div>
                                            <div className="mobile-price">
                                                ₱{(calculatedPrice * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="item-quantity">
                                        <div className="qty-selector">
                                            <button 
                                                onClick={() => handleQuantityChange(item, -1)}
                                                disabled={item.quantity <= 1}
                                            ><FaMinus size={10} /></button> 
                                            <span>{item.quantity}</span>
                                            <button 
                                                onClick={() => handleQuantityChange(item, 1)}
                                                disabled={item.quantity >= maxStock}
                                            ><FaPlus size={10} /></button>
                                        </div>
                                        {item.quantity >= maxStock && <span className="stock-limit">Max</span>}
                                    </div>

                                    <div className="item-total mobile-hide">
                                        ₱{(calculatedPrice * item.quantity).toLocaleString()}
                                    </div>

                                    <button
                                        className="item-remove"
                                        onClick={() => removeFromCart(item.id)}
                                        title="Remove Item"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --- RIGHT: SUMMARY --- */}
                <div className="cart-sidebar">
                    <div className="summary-card">
                        <h3>Order Summary</h3>
                        
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₱{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>₱{shippingFee.toLocaleString()}</span>
                        </div>
                        
                        <div className="summary-divider"></div>
                        
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₱{grandTotal.toLocaleString()}</span>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </button>

                        <button className="clear-cart-btn" onClick={clearCart}>
                            Clear Shopping Bag
                        </button>
                    </div>
                    
                    <div className="secure-badge">
                        <i className="fa-solid fa-lock"></i> Secure Checkout
                    </div>
                </div>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default CartPage;