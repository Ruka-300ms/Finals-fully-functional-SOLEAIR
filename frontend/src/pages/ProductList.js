import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/ProductList.css";
import productsJson from "../data/products.json";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const location = useLocation();

  // initialize products in localStorage if not present (one-time)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("products"));
      if (!stored || !Array.isArray(stored) || stored.length === 0) {
        // transform JSON to include `quantity` (already present) and ensure numbers
        const normalized = (productsJson || []).map((p) => ({
          ...p,
          quantity: Number(p.quantity ?? 0),
        }));
        localStorage.setItem("products", JSON.stringify(normalized));
        setProducts(normalized);
      } else {
        setProducts(stored);
      }
    } catch (err) {
      // fallback to bundled JSON
      setProducts(productsJson);
      localStorage.setItem("products", JSON.stringify(productsJson));
    }
  }, []);

  // respond to query params (category/search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");
    if (category) setSelectedCategory(category.toLowerCase());
    if (search) setSearchTerm(search.toLowerCase());
  }, [location.search]);

  // keep products in sync in case localStorage changed elsewhere
  useEffect(() => {
    const handleStorage = () => {
      const stored = JSON.parse(localStorage.getItem("products"));
      if (stored) setProducts(stored);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const filtered = products.filter((product) => {
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
        {["all", "men", "women", "kids"].map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.toUpperCase()} SHOES
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.length > 0 ? (
          filtered.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
              <div className="image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                {product.discount && <span className="discount-tag">-{product.discount}%</span>}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brand">{product.brand}</p>

                <p className="product-price">
                  ₱
                  {product.discount
                    ? (product.price - product.price * (product.discount / 100)).toLocaleString()
                    : product.price.toLocaleString()}
                  {product.discount && <span className="old-price">₱{product.price.toLocaleString()}</span>}
                </p>

                <p className="product-quantity">
                  Stock: <span className="quantity-value">{product.quantity}</span>
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No shoes found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
