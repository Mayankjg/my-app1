"use client";

import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function LeadStatus() {
  const [statuses, setStatuses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("leadStatuses") || "[]");
    if (saved.length === 0) {
    
      const defaultStatuses = [
        { id: 1, name: "Closed" },
        { id: 2, name: "Open" },
        { id: 3, name: "Pending" },
        { id: 4, name: "Special" },
      ];
      setStatuses(defaultStatuses);
      localStorage.setItem("leadStatuses", JSON.stringify(defaultStatuses));
    } else {
      setStatuses(saved);
    }
  }, []);

  const saveStatuses = (list) => {
    setStatuses(list);
    localStorage.setItem("leadStatuses", JSON.stringify(list));
  };

  const filtered = statuses.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      const updated = statuses.filter((status) => status.id !== id);
      saveStatuses(updated);
      setSelected(selected.filter((sid) => sid !== id));
    }
  };

  const handleSelectAll = () => {
    const selectable = filtered
      .filter((status) => status.name === "Special")
      .map((status) => status.id);
    const allSelected = selectable.every((id) => selected.includes(id));

    if (allSelected) {
      setSelected(selected.filter((id) => !selectable.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...selectable])]);
    }
  };

  const handleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((sid) => sid !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleAddStatus = () => {
    if (!newStatusName.trim()) {
      alert("Please enter lead status");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newStatusName.trim(),
    };

    const updated = [...statuses, newItem];
    saveStatuses(updated);
    setNewStatusName("");
    setShowAddModal(false);
  };

  const handleUpdate = (id) => {
    if (!editedName.trim()) {
      alert("Please enter lead status");
      return;
    }

    const updated = statuses.map((s) =>
      s.id === id ? { ...s, name: editedName.trim() } : s
    );

    saveStatuses(updated);
    setEditingId(null);
    setEditedName("");
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) {
      alert("Please select Special lead status to delete");
      return;
    }
    if (confirm(`Delete ${selected.length} lead status(es)?`)) {
      const updated = statuses.filter((s) => !selected.includes(s.id));
      saveStatuses(updated);
      setSelected([]);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-2">
      <div className="bg-white w-full max-w-7xl rounded-md shadow-md border border-gray-400">
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 py-3 gap-2"
          style={{ borderBottom: "1px solid #e6e6e6" }}
        >
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
            Lead <span className="font-normal">Status</span>
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto"
          >
            Add Lead Status
          </button>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-end items-center px-3 sm:px-6 py-3 gap-3"
          style={{
            borderTop: "1px solid #e6e6e6",
            borderBottom: "1px solid #e6e6e6",
          }}
        >
          <input
            type="text"
            placeholder="Search Lead Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 w-full sm:w-64 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            style={{ borderColor: "#e6e6e6" }}
          />
        </div>

        <div className="overflow-x-auto w-full">
          <div className="min-w-[500px] sm:min-w-full">
            <table
              className="w-full text-xs sm:text-sm text-gray-700 border-collapse"
              style={{ border: "1px solid #e6e6e6" }}
            >
              <thead
                className="bg-gray-100"
                style={{ borderBottom: "1px solid #e6e6e6" }}
              >
                <tr>
                  <th className="py-2 px-3 text-left">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-600"
                      checked={
                        filtered
                          .filter((s) => s.name === "Special")
                          .every((s) => selected.includes(s.id)) &&
                        filtered.some((s) => s.name === "Special")
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">
                    SR. NO.
                  </th>
                  <th className="py-2 px-3 text-left font-semibold">
                    LEAD STATUS
                  </th>
                  <th className="py-2 text-center font-semibold">EDIT</th>
                  <th className="py-2 text-center font-semibold">DELETE</th>
                  <th className="py-2 text-center font-semibold w-[10%]">
                    VIEW LEAD
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((status, index) => (
                  <tr
                    key={status.id}
                    className="hover:bg-gray-50 transition"
                    style={{ borderTop: "1px solid #e6e6e6" }}
                  >
                    <td
                      className="py-2 px-3 text-left"
                      style={{ borderRight: "1px solid #e6e6e6" }}
                    >
                      {status.name === "Special" ? (
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-blue-600"
                          checked={selected.includes(status.id)}
                          onChange={() => handleSelect(status.id)}
                        />
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>

                    <td
                      className="py-2 px-3"
                      style={{ borderRight: "1px solid #e6e6e6" }}
                    >
                      {index + 1}
                    </td>

                    <td
                      className="py-2 px-3"
                      style={{ borderRight: "1px solid #e6e6e6" }}
                    >
                      {status.name === "Special" && editingId === status.id ? (
                        <input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="border px-2 py-1 w-full rounded text-gray-700"
                          style={{ borderColor: "#e6e6e6" }}
                        />
                      ) : (
                        status.name
                      )}
                    </td>

                    <td
                      className="py-2 text-center"
                      style={{ borderRight: "1px solid #e6e6e6" }}
                    >
                      {status.name !== "Special" ? (
                        <span className="text-gray-400">--</span>
                      ) : editingId === status.id ? (
                        <>
                          <button
                            className="text-blue-600 font-semibold mr-2"
                            onClick={() => handleUpdate(status.id)}
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
                            setEditingId(status.id);
                            setEditedName(status.name);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </td>

                    <td
                      className="py-2 text-center"
                      style={{ borderRight: "1px solid #e6e6e6" }}
                    >
                      {status.name === "Special" ? (
                        <button
                          onClick={() => handleDelete(status.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>

                    <td className="py-2 text-center">
                      <button className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-5 py-1 rounded text-[10px] sm:text-sm w-full sm:w-auto">
                        View Lead
                      </button>
                    </td>
                  </tr>
                ))}

                <tr style={{ borderTop: "1px solid #e6e6e6" }}>
                  <td colSpan="6" className="py-4 px-3 text-left">
                    <button
                      onClick={handleBulkDelete}
                      className="bg-red-500 hover:bg-red-700 text-white px-6 sm:px-12 py-2 rounded-md text-xs sm:text-base"
                    >
                      Delete ({selected.length})
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
              Add New Lead Status
            </h3>

            <label className="block mb-2 text-sm text-gray-700">
              Lead Status Name
            </label>
            <input
              type="text"
              placeholder="Lead Status"
              value={newStatusName}
              onChange={(e) => setNewStatusName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded text-gray-700 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewStatusName("");
                }}
                className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddStatus}
                className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}