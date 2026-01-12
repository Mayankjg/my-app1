// @/app/manageitem/lead-source/page.js
"use client";

import { useState, useEffect } from "react";
import { FaTrash, FaPen, FaEye } from "react-icons/fa";
import LeadSourceModal from "./LeadSourceModal";

export default function LeadSource() {
  const [leadSources, setLeadSources] = useState([]);
  const [selected, setSelected] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLeadSource, setNewLeadSource] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("leadSources") || "[]");
    setLeadSources(saved);
  }, []);

  const saveLeadSources = (list) => {
    setLeadSources(list);
    localStorage.setItem("leadSources", JSON.stringify(list));
  };

  const filteredLeadSources = leadSources.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddLeadSource = () => {
    if (!newLeadSource.trim()) return alert("Please enter lead source");
    const newItem = { id: Date.now(), name: newLeadSource.trim() };
    saveLeadSources([...leadSources, newItem]);
    setNewLeadSource("");
    setShowAddForm(false);
  };

  const handleUpdate = (id) => {
    if (!editedName.trim()) return alert("Please enter lead source name");
    saveLeadSources(leadSources.map((item) => item.id === id ? { ...item, name: editedName.trim() } : item));
    setEditingId(null);
    setEditedName("");
  };

  const handleDeleteSingle = (id) => {
    if (confirm("Are you sure?")) {
      saveLeadSources(leadSources.filter((l) => l.id !== id));
      setSelected((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return alert("Please select items to delete");
    if (confirm(`Delete ${selected.length} item(s)?`)) {
      saveLeadSources(leadSources.filter((lead) => !selected.includes(lead.id)));
      setSelected([]);
    }
  };

  const handleSelectAll = (e) => {
    setSelected(e.target.checked ? filteredLeadSources.map((lead) => lead.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen w-full h-screen overflow-y-auto">
      <style>{`*{scrollbar-width:none!important;-ms-overflow-style:none!important}*::-webkit-scrollbar{display:none!important}`}</style>
      
      <div className="flex justify-center py-4 sm:py-8 px-2 sm:px-4">
        <div className="bg-white border border-[#d9d9d9] w-full max-w-7xl p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Lead Source</h2>
            <button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-900 hover:bg-blue-800 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded font-medium text-sm w-full sm:w-auto transition">
              {showAddForm ? "Close" : "Add Lead Source"}
            </button>
          </div>

          {/* Modal Component */}
          <LeadSourceModal
            showModal={showAddForm}
            setShowModal={setShowAddForm}
            newLeadName={newLeadSource}
            setNewLeadName={setNewLeadSource}
            handleAddLeadSource={handleAddLeadSource}
          />

          <div className="flex justify-end mb-4">
            <input type="text" placeholder="Search Lead Source..." value={search} onChange={(e) => setSearch(e.target.value)} className="border text-black border-[#d9d9d9] rounded px-3 py-2 text-sm w-full sm:w-64 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse text-gray-700">
              <thead>
                <tr className="bg-gray-200 text-gray-800 font-medium">
                  <th className="border px-3 py-2"><input type="checkbox" checked={selected.length === filteredLeadSources.length && filteredLeadSources.length > 0} onChange={handleSelectAll} /></th>
                  <th className="border px-3 py-2">SR. NO.</th>
                  <th className="border px-3 py-2">LEAD SOURCE</th>
                  <th className="border px-3 py-2 text-center">EDIT</th>
                  <th className="border px-3 py-2 text-center">DELETE</th>
                  <th className="border px-3 py-2 text-center">VIEW LEADS</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeadSources.length === 0 ? (
                  <tr><td colSpan="6" className="border px-3 py-8 text-center text-gray-400">No lead sources found.</td></tr>
                ) : (
                  filteredLeadSources.map((lead, index) => (
                    <tr key={lead.id} className="text-center hover:bg-gray-50">
                      <td className="border px-3 py-2"><input type="checkbox" checked={selected.includes(lead.id)} onChange={() => handleSelectRow(lead.id)} /></td>
                      <td className="border px-3 py-2">{index + 1}</td>
                      <td className="border px-3 py-2 text-left">{editingId === lead.id ? <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border px-2 py-1 rounded w-full focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /> : lead.name}</td>
                      <td className="border px-3 py-2">{editingId === lead.id ? (<><button className="text-blue-600 font-semibold mr-2 hover:text-blue-700" onClick={() => handleUpdate(lead.id)}>Update</button><button className="text-red-600 font-semibold hover:text-red-700" onClick={() => { setEditingId(null); setEditedName(""); }}>Cancel</button></>) : (<button className="text-gray-600 hover:text-blue-600" onClick={() => { setEditingId(lead.id); setEditedName(lead.name); }}><FaPen /></button>)}</td>
                      <td className="border px-3 py-2"><button className="text-red-600 hover:text-red-700" onClick={() => handleDeleteSingle(lead.id)}><FaTrash /></button></td>
                      <td className="border px-3 py-2"><button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">View Leads</button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredLeadSources.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No lead sources found.</div>
            ) : (
              filteredLeadSources.map((lead, index) => (
                <div key={lead.id} className="border border-gray-300 bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => handleSelectRow(lead.id)} className="mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 mb-1">SR. NO. {index + 1}</div>
                        {editingId === lead.id ? <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="border border-gray-300 px-2 py-1.5 rounded w-full text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" /> : <div className="font-medium text-gray-800 text-sm leading-relaxed break-words">{lead.name}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 p-2 sm:p-3 bg-gray-50 flex items-center justify-between gap-2">
                    {editingId === lead.id ? (
                      <div className="flex gap-2 w-full">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium flex-1" onClick={() => handleUpdate(lead.id)}>Update</button>
                        <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded text-xs font-medium flex-1" onClick={() => { setEditingId(null); setEditedName(""); }}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                          <button className="text-gray-600 hover:text-blue-600 p-1.5 sm:p-2" onClick={() => { setEditingId(lead.id); setEditedName(lead.name); }}><FaPen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                          <button className="text-gray-600 hover:text-red-600 p-1.5 sm:p-2" onClick={() => handleDeleteSingle(lead.id)}><FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-2.5 sm:px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 sm:gap-1.5 flex-shrink-0"><FaEye className="w-3 h-3" /><span className="whitespace-nowrap">View Leads</span></button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <button onClick={handleDeleteSelected} className="bg-red-600 text-white px-6 sm:px-8 py-2 rounded hover:bg-red-700 text-sm sm:text-base w-full sm:w-auto font-medium">Delete ({selected.length})</button>
          </div>
        </div>
      </div>
    </div>
  );
}