"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaPen } from "react-icons/fa";

export default function LeadSource() {
  const [leadSources, setLeadSources] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLeadSource, setNewLeadSource] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("leadSources") || "[]");
    setLeadSources(saved);
  }, []);

  // Save to localStorage
  const saveLeadSources = (list) => {
    setLeadSources(list);
    localStorage.setItem("leadSources", JSON.stringify(list));
  };

  // Filter lead sources based on search
  const filteredLeadSources = leadSources.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddLeadSource = () => {
    if (!newLeadSource.trim()) {
      alert("Please enter lead source");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newLeadSource.trim(),
    };

    const updated = [...leadSources, newItem];
    saveLeadSources(updated);

    setNewLeadSource("");
    setShowAddForm(false);
  };

  const handleUpdate = (id) => {
    const updated = leadSources.map((item) =>
      item.id === id ? { ...item, name: editedName.trim() } : item
    );

    saveLeadSources(updated);
    setEditingId(null);
    setEditedName("");
  };

  const handleDeleteSingle = (id) => {
    if (confirm("Are you sure?")) {
      const updated = leadSources.filter((l) => l.id !== id);
      saveLeadSources(updated);
      setSelected((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      alert("Please select items to delete");
      return;
    }

    if (confirm(`Are you sure you want to delete ${selected.length} item(s)?`)) {
      const updated = leadSources.filter((lead) => !selected.includes(lead.id));
      saveLeadSources(updated);
      setSelected([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredLeadSources.map((lead) => lead.id));
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
    <div className="bg-[#f9f9f9] min-h-screen flex justify-center py-8">
      <div className="bg-white border border-[#d9d9d9] w-[95%] md:w-[90%] p-6 rounded-lg shadow-sm">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Lead Source</h2>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            {showAddForm ? "Close" : "Add Lead Source"}
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] md:w-[430px] rounded-lg shadow-[0_0_25px_rgba(0,0,0,0.3)]">
              <div className="border-b px-6 py-3">
                <h2 className="text-xl font-semibold text-gray-800">Add New Lead Source</h2>
              </div>

              <div className="px-6 py-4">
                <label className="block mb-2 text-sm text-gray-700">
                  Lead Source Name
                </label>

                <input
                  type="text"
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded text-black"
                  placeholder="Enter lead source name"
                />
              </div>

              <div className="px-6 py-4 flex justify-end gap-3 border-t">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-5 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddLeadSource}
                  className="px-5 py-2 rounded bg-sky-600 hover:bg-sky-700 text-white"
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
            placeholder="Lead Source"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border text-black border-[#d9d9d9] rounded-sm px-3 py-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto border border-[#d9d9d9] rounded-md">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-[#f1f1f1] text-gray-800 font-semibold">
              <tr>
                <th className="border p-2 text-center" style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    checked={selected.length === filteredLeadSources.length && filteredLeadSources.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-4 mx-auto"
                  />
                </th>
                <th className="border p-2">SR. NO.</th>
                <th className="border p-2">LEAD SOURCE</th>
                <th className="border p-2 text-center">EDIT</th>
                <th className="border p-2 text-center">DELETE</th>
                <th className="border p-2 text-center">VIEW LEADS</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeadSources.map((lead, index) => (
                <tr key={lead.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="border p-2 text-center" style={{ width: "20px" }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(lead.id)}
                      onChange={() => handleSelectRow(lead.id)}
                      className="w-3.5 h-4 mx-auto"
                    />
                  </td>

                  <td className="border p-2">{index + 1}</td>

                  <td className="border p-2">
                    {editingId === lead.id ? (
                      <input
                        className="border px-2 py-1 w-full rounded"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      lead.name
                    )}
                  </td>

                  <td className="border p-2 text-center">
                    {editingId === lead.id ? (
                      <>
                        <button
                          className="text-blue-600 font-semibold mr-2"
                          onClick={() => handleUpdate(lead.id)}
                        >
                          Update
                        </button>
                        <button
                          className="text-red-600 font-semibold"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => {
                          setEditingId(lead.id);
                          setEditedName(lead.name);
                        }}
                      >
                        <FaPen />
                      </button>
                    )}
                  </td>

                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeleteSingle(lead.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>

                  <td className="border p-2 text-center">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm">
                      View Leads
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4">
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-sm"
            >
              Delete ({selected.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}