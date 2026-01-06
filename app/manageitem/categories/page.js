"use client";

import { useState, useEffect } from "react";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("categories") || "[]");
    setCategories(saved);
  }, []);

  const saveCategories = (list) => {
    setCategories(list);
    localStorage.setItem("categories", JSON.stringify(list));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      alert("Please enter category name");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newCategory.trim(),
    };

    const updated = [...categories, newItem];
    saveCategories(updated);

    setNewCategory("");
    setShowAddForm(false);
  };

  const handleUpdateCategory = (id) => {
    if (!editedName.trim()) {
      alert("Please enter category name");
      return;
    }

    const updated = categories.map((cat) =>
      cat.id === id ? { ...cat, name: editedName.trim() } : cat
    );

    saveCategories(updated);
    setEditingId(null);
    setEditedName("");
  };

  const handleDeleteSingle = (id) => {
    if (confirm("Are you sure?")) {
      const updated = categories.filter((cat) => cat.id !== id);
      saveCategories(updated);
      setSelected((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      alert("Please select items to delete");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selected.length} item(s)?`)) {
      const updated = categories.filter((cat) => !selected.includes(cat.id));
      saveCategories(updated);
      setSelected([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredCategories.map((cat) => cat.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen w-full h-screen overflow-y-auto overflow-x-hidden">
      <style>{`
        /* Hide all scrollbars globally */
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        body::-webkit-scrollbar,
        html::-webkit-scrollbar {
          display: none !important;
        }
        
        body,
        html {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      <div className="flex justify-center py-4 sm:py-8 px-2 sm:px-4 w-full">
        <div className="bg-white border border-[#d9d9d9] w-full max-w-7xl p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Categories</h2>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-900 hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded font-medium text-sm w-full sm:w-auto transition"
            >
              {showAddForm ? "Close" : "Add Category"}
            </button>
          </div>

          {showAddForm && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
              <div className="bg-white w-full max-w-md rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                  Add New Category
                </h3>

                <label className="block mb-2 text-sm text-gray-700">
                  Category Name
                </label>

                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-black mb-4 text-sm sm:text-base focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter category name"
                />

                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-3">
                  <button
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 sm:px-5 py-2 rounded text-sm sm:text-base w-full sm:w-auto transition order-1 sm:order-2"
                    onClick={handleAddCategory}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 hover:bg-gray-400 px-4 sm:px-5 py-2 rounded text-sm sm:text-base w-full sm:w-auto transition order-2 sm:order-1"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewCategory("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mb-4 w-full">
            <input
              type="text"
              placeholder="Search Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border text-black border-[#d9d9d9] rounded px-3 py-2 text-sm w-full sm:w-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-gray-700">
              <thead>
                <tr className="bg-gray-200 text-gray-800 font-medium">
                  <th className="border px-3 py-2">
                    <input
                      type="checkbox"
                      checked={
                        selected.length === filteredCategories.length && filteredCategories.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="border px-3 py-2">SR. NO.</th>
                  <th className="border px-3 py-2">CATEGORY NAME</th>
                  <th className="border px-3 py-2 text-center">EDIT</th>
                  <th className="border px-3 py-2 text-center">DELETE</th>
                  <th className="border px-3 py-2 text-center">VIEW LEADS</th>
                </tr>
              </thead>

              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="border px-3 py-8 text-center text-gray-400">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat, index) => (
                    <tr key={cat.id} className="text-center hover:bg-gray-50 transition">
                      <td className="border px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selected.includes(cat.id)}
                          onChange={() => handleSelectRow(cat.id)}
                        />
                      </td>

                      <td className="border px-3 py-2">{index + 1}</td>

                      <td className="border px-3 py-2 text-left">
                        {editingId === cat.id ? (
                          <input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border px-2 py-1 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          cat.name
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        {editingId === cat.id ? (
                          <>
                            <button
                              className="text-blue-600 font-semibold mr-2 hover:text-blue-700"
                              onClick={() => handleUpdateCategory(cat.id)}
                            >
                              Update
                            </button>

                            <button
                              className="text-red-600 font-semibold hover:text-red-700"
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
                            className="text-gray-600 hover:text-blue-600 transition"
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditedName(cat.name);
                            }}
                          >
                            <FaPen />
                          </button>
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        <button
                          className="text-red-600 hover:text-red-700 transition"
                          onClick={() => handleDeleteSingle(cat.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>

                      <td className="border px-3 py-2">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition">
                          View Leads
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3 w-full">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No categories found.
              </div>
            ) : (
              filteredCategories.map((cat, index) => (
                <div
                  key={cat.id}
                  className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm w-full"
                >
                  <div className="p-3 sm:p-4 w-full">
                    <div className="flex items-start gap-2 sm:gap-3 w-full">
                      <input
                        type="checkbox"
                        checked={selected.includes(cat.id)}
                        onChange={() => handleSelectRow(cat.id)}
                        className="mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">
                          SR. NO. {index + 1}
                        </div>
                        {editingId === cat.id ? (
                          <input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          <div className="font-medium text-gray-800 text-sm leading-relaxed break-words">
                            {cat.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 p-2 sm:p-3 bg-gray-50 flex items-center justify-between gap-2 w-full">
                    {editingId === cat.id ? (
                      <div className="flex gap-2 w-full">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium flex-1 transition"
                          onClick={() => handleUpdateCategory(cat.id)}
                        >
                          Update
                        </button>
                        <button
                          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-xs font-medium flex-1 transition"
                          onClick={() => {
                            setEditingId(null);
                            setEditedName("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                          <button
                            className="text-gray-600 hover:text-blue-600 transition p-1.5 sm:p-2"
                            onClick={() => {
                              setEditingId(cat.id);
                              setEditedName(cat.name);
                            }}
                            title="Edit"
                          >
                            <FaPen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-red-600 transition p-1.5 sm:p-2"
                            onClick={() => handleDeleteSingle(cat.id)}
                            title="Delete"
                          >
                            <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition flex-shrink-0">
                          <FaEye className="w-3 h-3" />
                          <span className="whitespace-nowrap">View Leads</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 w-full">
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-6 sm:px-8 py-2 rounded hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto transition font-medium"
            >
              Delete ({selected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}