// frontend/app/leads/TodaysLeadsTable.jsx - FINAL FIXED VERSION
"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaClipboard } from "react-icons/fa";

export default function TodaysLeadsTable({ leads = [], onDelete, onEdit }) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("Ascending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [tags, setTags] = useState([]);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://crm-tenacious-techies-pro-1.onrender.com";

  // Fetch tags on mount for color mapping
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/manage-items/tags/get-tags`);
        setTags(res.data || []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, [API_BASE]);

  // Unique Products
  const products = useMemo(() => {
    const p = [...new Set(leads.map((lead) => lead.product).filter(Boolean))];
    return p.length ? p : ["No Product"];
  }, [leads]);

  // Unique Status
  const statuses = useMemo(() => {
    const s = [
      ...new Set(leads.map((lead) => lead.leadStatus).filter(Boolean)),
    ];
    return s.length ? s : ["N/A"];
  }, [leads]);

  // FILTER + SEARCH + SORT
  const filteredLeads = useMemo(() => {
    let filtered = leads;

    if (selectedProduct && selectedProduct !== "All") {
      filtered = filtered.filter((lead) => lead.product === selectedProduct);
    }

    if (selectedStatus && selectedStatus !== "All") {
      filtered = filtered.filter((lead) => lead.leadStatus === selectedStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.firstName?.toLowerCase().includes(term) ||
          lead.lastName?.toLowerCase().includes(term) ||
          lead.company?.toLowerCase().includes(term) ||
          lead.email?.toLowerCase().includes(term) ||
          lead.phone?.toLowerCase().includes(term) ||
          lead.city?.toLowerCase().includes(term) ||
          lead.leadStatus?.toLowerCase().includes(term)
      );
    }

    filtered = filtered.sort((a, b) =>
      sortOrder === "Ascending"
        ? a.firstName?.localeCompare(b.firstName)
        : b.firstName?.localeCompare(a.firstName)
    );

    return filtered;
  }, [leads, selectedProduct, selectedStatus, searchTerm, sortOrder]);

  // SELECT ALL
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map((lead) => lead._id));
    } else {
      setSelectedLeads([]);
    }
  };

  // SELECT ONE
  const handleSelectOne = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ASSIGN
  const handleAssign = () => {
    if (selectedLeads.length === 0)
      return alert("Please select at least one lead to assign!");
    alert(` ${selectedLeads.length} lead(s) assigned successfully!`);
  };

  // DELETE
  const handleDeleteSelected = () => {
    if (selectedLeads.length === 0)
      return alert("Please select at least one lead to delete!");

    const message =
      selectedLeads.length === filteredLeads.length
        ? "Are you sure you want to delete ALL leads?"
        : `Are you sure you want to delete ${selectedLeads.length} lead(s)?`;

    if (window.confirm(message)) {
      onDelete?.(selectedLeads);
      setSelectedLeads([]);
    }
  };

  // Export CSV with proper tag names
  const handleExport = () => {
    if (filteredLeads.length === 0) return alert("No leads to export!");

    const csv = [
      [
        "First Name",
        "Last Name",
        "Company",
        "Email",
        "Phone",
        "City",
        "Status",
        "Tags",
      ].join(","),

      ...filteredLeads.map((l) =>
        [
          l.firstName || "",
          l.lastName || "",
          l.company || "",
          l.email || "",
          l.phone || "",
          l.city || "",
          l.leadStatus || "",
          (l.tags || []).join("; "),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "leads_export.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] p-2 text-black">
      {/* HEADER */}
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center sm:text-left">
        All <span className="font-bold">Leads</span>
      </h2>

      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between bg-white p-3 sm:p-4 rounded shadow-md mb-4 gap-3">
        <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
          <button
            onClick={handleAssign}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 sm:px-6 py-2 rounded-sm font-semibold text-xs sm:text-sm"
          >
            Assign
          </button>

          <button
            onClick={handleDeleteSelected}
            className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-sm font-semibold text-xs sm:text-sm"
          >
            Delete
          </button>

          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-sm font-semibold text-xs sm:text-sm"
          >
            Export
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center sm:justify-end">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="border border-gray-300 rounded px-2 py-3 text-gray-700 text-xs sm:text-sm"
          >
            <option value="All">Select Product</option>
            {products.map((p, idx) => (
              <option key={idx} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-300 rounded px-2 py-3 text-gray-700 text-xs sm:text-sm"
          >
            <option value="All">Please Select</option>
            {statuses.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-3 text-gray-700 text-xs sm:text-sm"
          >
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 rounded px-2 py-2 w-40 sm:w-48 text-xs sm:text-sm"
          />

          <button
            onClick={() => setSearchTerm("")}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-semibold text-xs sm:text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* HINT */}
      <p className="text-[11px] sm:text-[13px] text-red-600 text-right pr-3 mb-2">
        (Notes: Search By - Contact person, Company, Phone No, Email, City, Status)
      </p>

      {/*  FINAL FIX: DESKTOP TABLE - Proper Width Management */}
      <div className="w-full overflow-x-auto bg-white shadow-md hidden md:block">
        <table className="min-w-full border-collapse border border-gray-200 text-xs sm:text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-3 w-[50px]">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredLeads.length > 0 &&
                    selectedLeads.length === filteredLeads.length
                  }
                />
              </th>

              <th className="border p-2 text-left whitespace-nowrap w-[150px]">
                CONTACT PERSON
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[180px]">
                COMPANY
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[130px]">
                PHONE NO
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[200px] hidden md:table-cell">
                EMAIL ID
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[100px]">
                CITY
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[120px]">
                STATUS
              </th>

              {/*  FIXED: TAGS COLUMN - Controlled Width */}
              <th className="border p-3 text-center whitespace-nowrap w-[160px] hidden lg:table-cell">
                TAGS
              </th>

              <th className="border p-2 text-center whitespace-nowrap w-[110px] hidden lg:table-cell">
                DUE DATE
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[150px] hidden lg:table-cell">
                COMMENTS
              </th>
              <th className="border p-3 text-center whitespace-nowrap w-[120px]">
                ACTION
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead, idx) => (
                <tr key={lead._id || idx} className="hover:bg-gray-50">
                  <td className="border p-3 text-center w-[50px]">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => handleSelectOne(lead._id)}
                    />
                  </td>

                  <td className="border p-3 w-[150px]">
                    <div className="truncate" title={(lead.firstName || "") + " " + (lead.lastName || "")}>
                      {(lead.firstName || "") + " " + (lead.lastName || "")}
                    </div>
                  </td>

                  <td className="border p-3 w-[180px]">
                    <div className="truncate" title={lead.company}>
                      {lead.company}
                    </div>
                  </td>

                  <td className="border p-3 w-[130px]">
                    <div className="break-all text-[11px]">{lead.phone}</div>
                  </td>

                  <td className="border p-3 w-[200px] hidden md:table-cell">
                    <div className="truncate text-[11px]" title={lead.email}>
                      {lead.email}
                    </div>
                  </td>

                  <td className="border p-3 w-[100px]">
                    <div className="truncate" title={lead.city}>
                      {lead.city}
                    </div>
                  </td>

                  <td className="border p-3 w-[120px]">
                    <div className="flex justify-center">
                      <span
                        className={`px-2 py-1 rounded text-white text-[10px] font-semibold whitespace-nowrap ${
                          lead.leadStatus === "Open"
                            ? "bg-emerald-500"
                            : lead.leadStatus === "Closed"
                            ? "bg-indigo-600"
                            : "bg-gray-400"
                        }`}
                      >
                        {lead.leadStatus}
                      </span>
                    </div>
                  </td>

                  {/*  FIXED: TAGS CELL - Proper Wrapping Inside Fixed Width */}
                  <td className="border p-2 w-[160px] hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1 justify-center items-center max-h-[60px] overflow-y-auto">
                      {lead.tags && lead.tags.length > 0 ? (
                        lead.tags.map((tagName, tagIdx) => {
                          const fullTag = tags.find((t) => t.name === tagName);
                          const tagColor = fullTag?.color || "#3B82F6";

                          return (
                            <span
                              key={`${lead._id}-tag-${tagIdx}`}
                              className="px-2 py-1 rounded text-white text-[9px] font-semibold whitespace-nowrap inline-block"
                              style={{ backgroundColor: tagColor }}
                              title={tagName}
                            >
                              {tagName.length > 12 ? tagName.substring(0, 12) + "..." : tagName}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-[10px]">No tags</span>
                      )}
                    </div>
                  </td>

                  <td className="border p-2 w-[110px] hidden lg:table-cell">
                    <div className="text-[10px] whitespace-nowrap">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString()
                        : ""}
                    </div>
                  </td>

                  <td className="border p-2 w-[150px] hidden lg:table-cell">
                    <textarea
                      value={lead.comment || ""}
                      readOnly
                      className="border w-full p-1 text-[10px] rounded resize-none bg-gray-50 cursor-not-allowed h-[50px]"
                    />
                  </td>

                  <td className="border p-3 w-[120px]">
                    <div className="flex justify-center gap-2">
                      <button className="bg-gray-200 p-2 rounded hover:bg-gray-300 transition-colors">
                        <FaClipboard className="text-sm" />
                      </button>

                      <button
                        onClick={() => onEdit?.(lead)}
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                      >
                        <FaEdit className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-6 text-gray-500">
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE HEADER */}
      <div className="block md:hidden overflow-x-auto bg-white border border-gray-300 rounded mt-3">
        <table className="min-w-full text-[10px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-2 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedLeads.length > 0 &&
                    selectedLeads.length === filteredLeads.length
                  }
                />
              </th>

              <th className="border p-2 text-left">PERSON</th>
              <th className="border p-2 text-left">COMPANY</th>
              <th className="border p-2 text-left">PHONE</th>
              <th className="border p-2 text-left">CITY</th>
              <th className="border p-2 text-left">STATUS</th>
              <th className="border p-2 text-center">ACT</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* MOBILE CARD LIST */}
      <div className="block md:hidden space-y-4 mt-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead, idx) => (
            <div
              key={lead._id || idx}
              className="bg-white rounded border border-[1.5px] border-black shadow-sm overflow-hidden"
            >
              <div className="border-b p-2 flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedLeads.includes(lead._id)}
                  onChange={() => handleSelectOne(lead._id)}
                />
                <span className="font-semibold text-gray-800 text-sm break-words">
                  {lead.firstName} {lead.lastName}
                </span>
              </div>

              <div className="border-b p-2 text-xs">
                <strong>Company :</strong>{" "}
                <span className="break-words">{lead.company}</span>
              </div>

              <div className="border-b p-2 text-xs">
                <strong>Phone No :</strong>{" "}
                <span className="break-all">{lead.phone}</span>
              </div>

              <div className="border-b p-2 text-xs">
                <strong>Email ID :</strong>{" "}
                <span className="break-all">{lead.email}</span>
              </div>

              <div className="border-b p-2 text-xs">
                <strong>City :</strong> {lead.city}
              </div>

              <div className="border-b p-2 text-xs flex items-center gap-2 flex-wrap">
                <strong>Status :</strong>
                <span
                  className={`px-2 py-1 rounded text-white text-[10px] ${
                    lead.leadStatus === "Open"
                      ? "bg-emerald-500"
                      : lead.leadStatus === "Closed"
                      ? "bg-indigo-600"
                      : "bg-gray-400"
                  }`}
                >
                  {lead.leadStatus}
                </span>
              </div>

              {/*  FIXED: TAGS IN MOBILE VIEW */}
              <div className="border-b p-2 text-xs">
                <strong>Tags :</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.tags && lead.tags.length > 0 ? (
                    lead.tags.map((tagName, tagIdx) => {
                      const fullTag = tags.find((t) => t.name === tagName);
                      const tagColor = fullTag?.color || "#3B82F6";

                      return (
                        <span
                          key={`${lead._id}-mobile-tag-${tagIdx}`}
                          className="px-2 py-1 rounded text-white text-[10px] break-words"
                          style={{ backgroundColor: tagColor }}
                        >
                          {tagName}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-gray-400 text-[10px]">No tags</span>
                  )}
                </div>
              </div>

              <div className="border-b p-2 text-xs">
                <strong>Due Date :</strong>{" "}
                {lead.createdAt
                  ? new Date(lead.createdAt).toLocaleDateString()
                  : ""}
              </div>

              <div className="border-b p-2 text-xs">
                <strong>Comments :</strong>
                <textarea
                  value={lead.comment || ""}
                  readOnly
                  className="border w-full p-1 text-xs mt-1 rounded resize-none bg-gray-50 cursor-not-allowed break-words"
                  rows="2"
                />
              </div>

              <div className="p-2 flex gap-3">
                <button className="bg-gray-200 p-2 rounded hover:bg-gray-300">
                  <FaClipboard />
                </button>

                <button
                  onClick={() => onEdit?.(lead)}
                  className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                  <FaEdit />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No leads found.
          </p>
        )}
      </div>
    </div>
  );
}