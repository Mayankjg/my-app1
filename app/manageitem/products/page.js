"use client";

import React, { useState, useEffect } from "react";
import { FaPen, FaTrash } from "react-icons/fa";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("products") || "[]");
    if (saved.length === 0) {
      // Initialize with default data if empty
      const defaultProducts = [
        { id: 1, name: "Bandhani" },
        { id: 2, name: "Galaxy S1" },
        { id: 3, name: "Galaxy S2" },
        { id: 4, name: "Lenovo Ideapad" },
      ];
      setProducts(defaultProducts);
      localStorage.setItem("products", JSON.stringify(defaultProducts));
    } else {
      setProducts(saved);
    }
  }, []);

  // Save to localStorage
  const saveProducts = (list) => {
    setProducts(list);
    localStorage.setItem("products", JSON.stringify(list));
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.trim()) {
      alert("Please enter product name");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newProduct.trim(),
    };

    const updated = [...products, newItem];
    saveProducts(updated);
    setNewProduct("");
    setShowAddForm(false);
  };

  const handleUpdate = (id) => {
    if (!editedName.trim()) {
      alert("Please enter product name");
      return;
    }

    const updated = products.map((item) =>
      item.id === id ? { ...item, name: editedName.trim() } : item
    );

    saveProducts(updated);
    setEditingId(null);
    setEditedName("");
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filtered.map((p) => p.id));
    } else {
      setSelected([]);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      setSelected(selected.filter((sid) => sid !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) {
      alert("Please select items to delete");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selected.length} item(s)?`)) {
      const updated = products.filter((p) => !selected.includes(p.id));
      saveProducts(updated);
      setSelected([]);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen flex justify-center py-8">
      <div className="bg-white border border-[#d9d9d9] w-[95%] md:w-[90%] p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Products</h2>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            {showAddForm ? "Close" : "Add Product"}
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-md rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                Add New Product
              </h3>

              <label className="block mb-2 text-sm text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded text-black mb-4"
                placeholder="Enter product name"
              />

              <div className="flex justify-end gap-3 mt-3">
                <button
                  className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProduct("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded"
                  onClick={handleAddProduct}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mb-4">
          <input
            type="text"
            placeholder="Product Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border text-black border-[#d9d9d9] rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <table className="w-full border-collapse text-gray-700">
          <thead>
            <tr className="bg-gray-200 text-gray-800 font-medium">
              <th className="border px-3 py-2">
                <input
                  type="checkbox"
                  checked={
                    selected.length === filtered.length && filtered.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>

              <th className="border px-3 py-2">SR. NO.</th>
              <th className="border px-3 py-2">PRODUCT NAME</th>
              <th className="border px-3 py-2 text-center">EDIT</th>
              <th className="border px-3 py-2 text-center">DELETE</th>
              <th className="border px-3 py-2 text-center">VIEW LEADS</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p, index) => (
              <tr key={p.id} className="text-center hover:bg-gray-50 transition">
                <td className="border px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => handleSelectRow(p.id)}
                  />
                </td>

                <td className="border px-3 py-2">{index + 1}</td>

                <td className="border px-3 py-2 text-left">
                  {editingId === p.id ? (
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    p.name
                  )}
                </td>

                <td className="border px-3 py-2">
                  {editingId === p.id ? (
                    <>
                      <button
                        className="text-blue-600 font-semibold mr-2"
                        onClick={() => handleUpdate(p.id)}
                      >
                        Update
                      </button>

                      <button
                        className="text-red-600 font-semibold"
                        onClick={() => {
                          setEditingId(null);
                          setEditedName("");
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setEditingId(p.id);
                        setEditedName(p.name);
                      }}
                    >
                      <FaPen />
                    </button>
                  )}
                </td>

                <td className="border px-3 py-2">
                  <button
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(p.id)}
                  >
                    <FaTrash />
                  </button>
                </td>

                <td className="border px-3 py-2">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
                    View Leads
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4">
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-8 py-2 rounded hover:bg-red-700"
          >
            Delete ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}