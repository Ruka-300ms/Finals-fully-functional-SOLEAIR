import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import productsData from "../data/products.json";

const AdminDashboard = () => {
  const navigate = useNavigate(); // used for logout redirect
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    image: ""
  });

  // Load from JSON
  useEffect(() => {
    setProducts(productsData);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add or update product
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.brand || !form.price || !form.image) {
      return alert("Please fill in all required fields.");
    }

    if (editingId) {
      const updatedProducts = products.map((p) =>
        p.id === editingId ? { ...p, ...form, price: parseFloat(form.price) } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setEditingId(null);
    } else {
      const newProduct = {
        id: products.length ? products[products.length - 1].id + 1 : 1,
        ...form,
        price: parseFloat(form.price),
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }

    // Reset form
    setForm({
      name: "",
      brand: "",
      price: "",
      category: "",
      quantity: "",
      image: ""
    });
  };

  // Edit handler
  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      image: product.image
    });
  };

  // Delete handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
    }
  };

  // Logout handler
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  return (
    <div className="admin-page">
      <div className="adminHeader">
        <div className="admin-header-top">
          <h1>Product Management</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-split">
        {/* LEFT SIDE — Add/Edit Form */}
        <div className="admin-form-section">
          <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={form.brand}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>

            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              onChange={handleChange}
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL or path"
              value={form.image}
              onChange={handleChange}
            />

            <button type="submit" className="save-btn">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    name: "",
                    brand: "",
                    price: "",
                    category: "",
                    quantity: "",
                    image: ""
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* RIGHT SIDE — Product Table */}
        <div className = "scrollable-panel">
          <div className="admin-table-section">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price (₱)</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-img"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>{product.price.toLocaleString()}</td>
                      <td>{product.quantity}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
