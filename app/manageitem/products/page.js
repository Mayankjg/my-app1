// @/app/manageitem/products/page.js
"use client";

import { useState, useEffect } from "react";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import ProductsTableModal from "./ProductsTableModal";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("products");
      if (saved && saved !== "undefined") {
        setProducts(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
      localStorage.removeItem("products");
    }
  }, []);

  const saveProducts = (list) => {
    setProducts(list);
    localStorage.setItem("products", JSON.stringify(list));
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.trim()) return alert("Please enter product name");
    saveProducts([...products, { id: Date.now(), name: newProduct.trim() }]);
    setNewProduct("");
    setShowAddForm(false);
  };

  const handleUpdate = (id) => {
    if (!editedName.trim()) return alert("Please enter product name");
    saveProducts(products.map((item) => item.id === id ? { ...item, name: editedName.trim() } : item));
    setEditingId(null);
    setEditedName("");
  };

  const handleSelectRow = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filtered.map((p) => p.id) : []);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      saveProducts(products.filter((p) => p.id !== id));
      setSelected(selected.filter((sid) => sid !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return alert("Please select items to delete");
    if (confirm(`Are you sure you want to delete ${selected.length} item(s)?`)) {
      saveProducts(products.filter((p) => !selected.includes(p.id)));
      setSelected([]);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen w-full h-screen overflow-y-auto">
      <style>{`*{scrollbar-width:none!important;-ms-overflow-style:none!important}*::-webkit-scrollbar{display:none!important}`}</style>

      <div className="flex justify-center py-4 sm:py-8 px-2 sm:px-4 w-full">
        <div className="bg-white border border-[#d9d9d9] w-full max-w-7xl p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Products</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-900 hover:bg-blue-800 text-white px-4 sm:px-6 py-2 rounded font-medium text-sm w-full sm:w-auto">
              {showAddForm ? "Close" : "Add Product"}
            </button>
          </div>

          {/* Modal Component */}
          <ProductsTableModal
            showPopup={showAddForm}
            setShowPopup={setShowAddForm}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            handleSaveProduct={handleAddProduct}
          />

          <div className="flex justify-end mb-4">
            <input type="text" placeholder="Search Product..." value={search} onChange={(e) => setSearch(e.target.value)} className="border text-black border-[#d9d9d9] rounded px-3 py-2 text-sm w-full sm:w-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-gray-700">
              <thead>
                <tr className="bg-gray-200 text-gray-800 font-medium">
                  <th className="border px-3 py-2"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={handleSelectAll} /></th>
                  <th className="border px-3 py-2">SR. NO.</th>
                  <th className="border px-3 py-2">PRODUCT NAME</th>
                  <th className="border px-3 py-2 text-center">EDIT</th>
                  <th className="border px-3 py-2 text-center">DELETE</th>
                  <th className="border px-3 py-2 text-center">VIEW LEADS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="border px-3 py-8 text-center text-gray-400">No products found.</td></tr>
                ) : (
                  filtered.map((p, index) => (
                    <tr key={p.id} className="text-center hover:bg-gray-50">
                      <td className="border px-3 py-2"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => handleSelectRow(p.id)} /></td>
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2 text-left">
                        {editingId === p.id ? <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border px-2 py-1 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /> : p.name}
                      </td>
                      <td className="border px-3 py-2">
                        {editingId === p.id ? (
                          <>
                            <button className="text-blue-600 font-semibold mr-2 hover:text-blue-700" onClick={() => handleUpdate(p.id)}>Update</button>
                            <button className="text-red-600 font-semibold hover:text-red-700" onClick={() => { setEditingId(null); setEditedName(""); }}>Cancel</button>
                          </>
                        ) : (
                          <button className="text-gray-600 hover:text-blue-600" onClick={() => { setEditingId(p.id); setEditedName(p.name); }}><FaPen /></button>
                        )}
                      </td>
                      <td className="border px-3 py-2"><button className="text-red-600 hover:text-red-700" onClick={() => handleDelete(p.id)}><FaTrash /></button></td>
                      <td className="border px-3 py-2"><button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">View Leads</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No products found.</div>
            ) : (
              filtered.map((p, index) => (
                <div key={p.id} className="border border-gray-300 bg-white rounded-lg shadow-sm">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input type="checkbox" checked={selected.includes(p.id)} onChange={() => handleSelectRow(p.id)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">SR. NO. {index + 1}</div>
                        {editingId === p.id ? (
                          <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                        ) : (
                          <div className="font-medium text-gray-800 text-sm break-words">{p.name}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 p-2 sm:p-3 bg-gray-50 flex items-center justify-between gap-2">
                    {editingId === p.id ? (
                      <div className="flex gap-2 w-full">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium flex-1" onClick={() => handleUpdate(p.id)}>Update</button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-xs font-medium flex-1" onClick={() => { setEditingId(null); setEditedName(""); }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1.5 sm:gap-2">
                          <button className="text-gray-600 hover:text-blue-600 p-1.5 sm:p-2" onClick={() => { setEditingId(p.id); setEditedName(p.name); }}><FaPen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                          <button className="text-gray-600 hover:text-red-600 p-1.5 sm:p-2" onClick={() => handleDelete(p.id)}><FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1"><FaEye className="w-3 h-3" /><span>View Leads</span></button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <button onClick={handleBulkDelete} className="bg-red-600 text-white px-6 sm:px-8 py-2 rounded hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto font-medium">Delete ({selected.length})</button>
          </div>
        </div>
      </div>
    </div>
  );
}