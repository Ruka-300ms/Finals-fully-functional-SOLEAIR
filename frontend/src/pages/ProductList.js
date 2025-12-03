import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/ProductList.css";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // --- INTEGRATION: Fetch from Backend ---
  useEffect(() => {
    fetch('http://localhost:8083/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Respond to query params (category/search)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    const search = params.get("search");
    if (category) setSelectedCategory(category.toLowerCase());
    if (search) setSearchTerm(search.toLowerCase());
  }, [location.search]);

  // Filter logic
  const filtered = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="product-list-container loading-container">
        <div className="loader"></div>
        <p>Loading collection...</p>
    </div>
  );

  return (
    // Inject fonts
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <div className="product-list-container">
        <div className="list-header">
            <h1 className="product-list-title">Soleair Collection</h1>
            <p className="product-list-subtitle">Discover the latest trends in footwear.</p>
        </div>

        <div className="category-buttons">
          {["all", "men", "women", "kids"].map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                <div className="image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  {product.discount > 0 && <span className="discount-tag">-{product.discount}%</span>}
                </div>

                <div className="product-info">
                  <div className="info-top">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-brand">{product.brand}</p>
                  </div>

                  <div className="info-bottom">
                    <p className="product-price">
                      ₱
                      {product.discount
                        ? (product.price - product.price * (product.discount / 100)).toLocaleString()
                        : Number(product.price).toLocaleString()}
                      {product.discount > 0 && <span className="old-price">₱{Number(product.price).toLocaleString()}</span>}
                    </p>

                    <div className="stock-badge">
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
                <p>No shoes found matching your criteria.</p>
                <button onClick={() => setSelectedCategory("all")}>View All</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;