import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import productsData from "../data/products.json";
import "../styles/ProductList.css";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");

    if (category) setSelectedCategory(category.toLowerCase());
    if (search) setSearchTerm(search.toLowerCase());
  }, [location.search]);

  // ilter logic
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Soleair Shoe Collection</h1>

      <div className="category-buttons">
        <button
          className={selectedCategory === "all" ? "active" : ""}
          onClick={() => setSelectedCategory("all")}
        >
          ALL PRODUCTS
        </button>
        <button
          className={selectedCategory === "men" ? "active" : ""}
          onClick={() => setSelectedCategory("men")}
        >
          MEN SHOES
        </button>
        <button
          className={selectedCategory === "women" ? "active" : ""}
          onClick={() => setSelectedCategory("women")}
        >
          WOMEN SHOES
        </button>
        <button
          className={selectedCategory === "kids" ? "active" : ""}
          onClick={() => setSelectedCategory("kids")}
        >
          KIDS SHOES
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link
                to={`/product/${product.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.discount && (
                    <span className="discount-tag">-{product.discount}%</span>
                  )}
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-brand">{product.brand}</p>

                  <p className="product-price">
                    ₱
                    {product.discount
                      ? (
                          product.price -
                          product.price * (product.discount / 100)
                        ).toLocaleString()
                      : product.price.toLocaleString()}
                    {product.discount && (
                      <span className="old-price">
                        ₱{product.price.toLocaleString()}
                      </span>
                    )}
                  </p>

                  <p className="product-quantity">
                    Quantity Available:{" "}
                    <span className="quantity-value">{product.quantity}</span>
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-results">No shoes found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
