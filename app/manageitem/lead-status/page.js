// @/app/manageitem/lead-status/page.js
"use client";

import { useState, useEffect } from "react";
import { FaPen, FaTrash, FaEye } from "react-icons/fa";
import LeadStatusModal from "./LeadStatusModal";

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
      const defaultStatuses = [{ id: 1, name: "Closed" }, { id: 2, name: "Open" }, { id: 3, name: "Pending" }, { id: 4, name: "Special" }];
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

  const filtered = statuses.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      saveStatuses(statuses.filter((status) => status.id !== id));
      setSelected(selected.filter((sid) => sid !== id));
    }
  };

  const handleSelectAll = () => {
    const selectable = filtered.filter((status) => status.name === "Special").map((status) => status.id);
    const allSelected = selectable.every((id) => selected.includes(id));
    setSelected(allSelected ? selected.filter((id) => !selectable.includes(id)) : [...new Set([...selected, ...selectable])]);
  };

  const handleSelect = (id) => {
    setSelected(selected.includes(id) ? selected.filter((sid) => sid !== id) : [...selected, id]);
  };

  const handleAddStatus = () => {
    if (!newStatusName.trim()) return alert("Please enter lead status");
    saveStatuses([...statuses, { id: Date.now(), name: newStatusName.trim() }]);
    setNewStatusName("");
    setShowAddModal(false);
  };

  const handleUpdate = (id) => {
    if (!editedName.trim()) return alert("Please enter lead status");
    saveStatuses(statuses.map((s) => s.id === id ? { ...s, name: editedName.trim() } : s));
    setEditingId(null);
    setEditedName("");
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return alert("Please select Special lead status to delete");
    if (confirm(`Delete ${selected.length} lead status(es)?`)) {
      saveStatuses(statuses.filter((s) => !selected.includes(s.id)));
      setSelected([]);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen w-full h-screen overflow-y-auto">
      <style>{`*{scrollbar-width:none!important;-ms-overflow-style:none!important}*::-webkit-scrollbar{display:none!important}`}</style>

      <div className="flex justify-center py-4 sm:py-8 px-2 sm:px-4">
        <div className="bg-white border border-[#d9d9d9] w-full max-w-7xl p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Lead Status</h2>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-900 hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded font-medium text-sm w-full sm:w-auto transition">Add Lead Status</button>
          </div>

          {/* Modal Component */}
          <LeadStatusModal
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            newLeadStatus={newStatusName}
            setNewLeadStatus={setNewStatusName}
            handleAddLeadStatus={handleAddStatus}
          />

          <div className="flex justify-end mb-4">
            <input type="text" placeholder="Search Lead Status..." value={search} onChange={(e) => setSearch(e.target.value)} className="border text-black border-[#d9d9d9] rounded px-3 py-2 text-sm w-full sm:w-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-gray-700">
              <thead>
                <tr className="bg-gray-200 text-gray-800 font-medium">
                  <th className="border px-3 py-2"><input type="checkbox" checked={filtered.filter((s) => s.name === "Special").every((s) => selected.includes(s.id)) && filtered.some((s) => s.name === "Special")} onChange={handleSelectAll} /></th>
                  <th className="border px-3 py-2">SR. NO.</th>
                  <th className="border px-3 py-2">LEAD STATUS</th>
                  <th className="border px-3 py-2 text-center">EDIT</th>
                  <th className="border px-3 py-2 text-center">DELETE</th>
                  <th className="border px-3 py-2 text-center">VIEW LEADS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="6" className="border px-3 py-8 text-center text-gray-400">No lead statuses found.</td></tr>
                ) : (
                  filtered.map((status, index) => (
                    <tr key={status.id} className="text-center hover:bg-gray-50">
                      <td className="border px-3 py-2">{status.name === "Special" ? <input type="checkbox" checked={selected.includes(status.id)} onChange={() => handleSelect(status.id)} /> : <span className="text-gray-400">--</span>}</td>
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2 text-left">{status.name === "Special" && editingId === status.id ? <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border px-2 py-1 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /> : status.name}</td>
                      <td className="border px-3 py-2">{status.name !== "Special" ? <span className="text-gray-400">--</span> : editingId === status.id ? (<><button className="text-blue-600 font-semibold mr-2 hover:text-blue-700" onClick={() => handleUpdate(status.id)}>Update</button><button className="text-red-600 font-semibold hover:text-red-700" onClick={() => { setEditingId(null); setEditedName(""); }}>Cancel</button></>) : <button className="text-gray-600 hover:text-blue-600" onClick={() => { setEditingId(status.id); setEditedName(status.name); }}><FaPen /></button>}</td>
                      <td className="border px-3 py-2">{status.name === "Special" ? <button className="text-red-600 hover:text-red-700" onClick={() => handleDelete(status.id)}><FaTrash /></button> : <span className="text-gray-400">--</span>}</td>
                      <td className="border px-3 py-2"><button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">View Leads</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No lead statuses found.</div>
            ) : (
              filtered.map((status, index) => (
                <div key={status.id} className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      {status.name === "Special" ? <input type="checkbox" checked={selected.includes(status.id)} onChange={() => handleSelect(status.id)} className="mt-1 flex-shrink-0" /> : <span className="text-gray-400 mt-1 text-sm">--</span>}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">SR. NO. {index + 1}</div>
                        {status.name === "Special" && editingId === status.id ? <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /> : <div className="font-medium text-gray-800 text-sm leading-relaxed break-words">{status.name}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 p-2 sm:p-3 bg-gray-50 flex items-center justify-between gap-2">
                    {status.name === "Special" && editingId === status.id ? (
                      <div className="flex gap-2 w-full">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium flex-1" onClick={() => handleUpdate(status.id)}>Update</button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-xs font-medium flex-1" onClick={() => { setEditingId(null); setEditedName(""); }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">{status.name === "Special" ? (<><button className="text-gray-600 hover:text-blue-600 p-1.5 sm:p-2" onClick={() => { setEditingId(status.id); setEditedName(status.name); }}><FaPen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button><button className="text-gray-600 hover:text-red-600 p-1.5 sm:p-2" onClick={() => handleDelete(status.id)}><FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button></>) : <span className="text-gray-400 text-sm px-2">--</span>}</div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-1.5 flex-shrink-0"><FaEye className="w-3 h-3" /><span className="whitespace-nowrap">View Leads</span></button>
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