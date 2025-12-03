import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
// Added icons for a professional look
import { FaSignOutAlt, FaEdit, FaTrash, FaPlus, FaBoxOpen } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    quantity: "",
    image: "",
    description: ""
  });

  const API_URL = 'http://localhost:8083/api/products';

  const fetchProducts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.brand || !form.price || !form.image || !form.description) {
      return alert("Please fill in all required fields.");
    }

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity)
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        alert(editingId ? "Product updated!" : "Product added!");
        fetchProducts();
        resetForm();
      } else {
        console.error("Server Error Details:", data);
        alert("Error: " + (data.message || JSON.stringify(data)));
      }
    })
    .catch(err => {
      console.error("Network Error:", err);
      alert("Network Error: " + err.message);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => {
        if(res.ok) fetchProducts();
        else alert("Error deleting product.");
      })
      .catch(err => console.error(err));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      brand: "",
      price: "",
      category: "",
      quantity: "",
      image: "",
      description: "" 
    });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      image: product.image,
      description: product.description || "" 
    });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/login");
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="admin-page">
        <div className="adminHeader">
          <div className="header-content">
            <div className="logo-area">
                <h1>Soleair <span className="admin-badge">Admin</span></h1>
                <p>Manage your inventory and products</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <div className="admin-split">
          {/* LEFT SIDE — Add/Edit Form */}
          <div className="admin-form-section">
            <div className="form-header">
                <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
                <p>{editingId ? "Update product details below" : "Fill in the details to create a new item"}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Product Name</label>
                <input type="text" name="name" placeholder="e.g. Nike Air Max" value={form.name} onChange={handleChange} />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                    <label>Brand</label>
                    <input type="text" name="brand" placeholder="e.g. Nike" value={form.brand} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                    <label>Price</label>
                    <input type="number" name="price" placeholder="0.00" value={form.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" name="quantity" placeholder="0" value={form.quantity} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="image" placeholder="https://..." value={form.image} onChange={handleChange} />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                    name="description" 
                    placeholder="Product details..." 
                    value={form.description} 
                    onChange={handleChange}
                    rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                    {editingId ? <><FaEdit /> Update Product</> : <><FaPlus /> Add Product</>}
                </button>
                {editingId && (
                    <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT SIDE — Product Table */}
          <div className="scrollable-panel">
            <div className="admin-table-section">
                <div className="table-header-row">
                    <h3>Inventory List</h3>
                    <span className="count-badge">{products.length} Items</span>
                </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th className="actions-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="id-col">#{product.id}</td>
                        <td className="product-col">
                            <div className="product-cell">
                                <img src={product.image} alt={product.name} className="product-img" />
                                <div className="product-info">
                                    <span className="p-name">{product.name}</span>
                                    <span className="p-brand">{product.brand}</span>
                                </div>
                            </div>
                        </td>
                        <td><span className="category-tag">{product.category}</span></td>
                        <td className="price-col">₱{Number(product.price).toLocaleString()}</td>
                        <td>
                            <span className={`stock-badge ${product.quantity < 5 ? 'low' : ''}`}>
                                {product.quantity}
                            </span>
                        </td>
                        <td className="actions-col">
                          <button onClick={() => handleEdit(product)} className="edit-btn" title="Edit">
                            <FaEdit />
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="delete-btn" title="Delete">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td colSpan="6" className="empty-state">
                            <FaBoxOpen className="empty-icon"/>
                            <p>No products found in inventory.</p>
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;