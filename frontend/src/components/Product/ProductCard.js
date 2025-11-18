import React from "react";
import "../../styles/ProductCard.css";


const ProductCard = ({ product }) => {
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>

        {hasDiscount ? (
          <p className="product-price">
            <span className="old-price">
              ₱{product.price.toLocaleString()}
            </span>
            <span className="new-price">
              ₱{discountedPrice.toLocaleString()}
            </span>
          </p>
        ) : (
          <p className="product-price">₱{product.price.toLocaleString()}</p>
        )}

        <p className="product-stock">Stock: {product.quantity || 0}</p>
      </div>
    </div>
  );
};

export default ProductCard;
