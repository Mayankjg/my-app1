"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateLead from "./CreateLead";
import TodaysLeadsTable from "./TodaysLeadsTable";
import { useAuth } from "@/context/AuthContext"; 

axios.defaults.withCredentials = true;

export default function LeadsPage() {
  const { token, tokenReady } = useAuth(); 

  const [leads, setLeads] = useState([]);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filter, setFilter] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://crm-tenacious-techies-pro-1.onrender.com";


  /* -------------------- AUTO ATTACH TOKEN (ROOT FIX) -------------------- */
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, [token]);

  /* -------------------- FETCH LEADS (ROOT FIX) -------------------- */
  useEffect(() => {
    if (!tokenReady) return;
    if (!token) return;

    fetchLeads();
  }, [tokenReady, token]);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/leads/get-leads` 
      );

      const payload = res.data;
      const items = Array.isArray(payload)
        ? payload
        : payload?.data || payload?.leads || [];

      setLeads(items);
    } catch (err) {
      console.error("Fetch Error:", err?.response?.data);
      toast.error("❌ Unauthorized or Backend Not Responding");
    }
  };

  /* -------------------- DELETE LEAD (ROOT FIX) -------------------- */
  const handleDelete = async (ids) => {
    if (!confirm("Are you sure you want to delete selected lead(s)?")) return;

    try {
      await Promise.all(
        ids.map((id) =>
          axios.delete(
            `${API_BASE}/api/leads/delete-lead/${id}` 
          )
        )
      );

      setLeads((prev) =>
        prev.filter((lead) => !ids.includes(lead._id))
      );

      toast.success("🗑️ Lead(s) deleted successfully!");
    } catch (err) {
      console.error("Delete Error:", err?.response?.data);
      toast.error("❌ Failed to delete lead(s).");
    }
  };

  /* -------------------- SAVE -------------------- */
  const handleSave = (data) => {
    const lead = data?.data || data;

    if (!lead) return fetchLeads();

    if (editingLead) {
      setLeads((prev) =>
        prev.map((l) => (l._id === lead._id ? lead : l))
      );
      toast.success("✅ Lead Updated Successfully!");
    } else {
      setLeads((prev) => [lead, ...prev]);
      toast.success("✅ Lead Created Successfully!");
    }

    setIsAddingLead(false);
    setEditingLead(null);
  };

  const handleCancel = () => {
    setIsAddingLead(false);
    setEditingLead(null);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsAddingLead(true);
  };

  /* -------------------- FILTER LOGIC -------------------- */
  const filteredLeads = leads.filter((lead) => {
    if (!filter) return true;

    if (filter === "today") {
      if (!lead.createdAt) return false;
      const today = new Date();
      const d = new Date(lead.createdAt);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    }

    return lead.leadStatus === filter;
  });

  const getCount = (status) =>
    leads.filter((l) => l.leadStatus === status).length;

  /* -------------------- UI (UNCHANGED) -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 custom-padding p-2">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Responsive CSS */}
      <style jsx>{`
        @media (min-width: 320px) and (max-width: 479px) {
          .custom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (min-width: 768px) and (max-width: 900px) {
          .custom-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
        }
      `}</style>

      {/* FILTER BUTTONS (UNCHANGED) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 mb-6 mt-5 ml-0 justify-items-center custom-grid">
        {[
          {
            label: (
              <span className="flex items-center text-[14px] font-semibold">
                <FaPlus className="pr-1 text-[14px]" /> Add New Lead
              </span>
            ),
            onClick: () => {
              setEditingLead(null);
              setIsAddingLead((prev) => !prev);
            },
            color: "bg-slate-800",
          },
          {
            label: <>Todays [{filteredLeads.filter(l => l.createdAt).length}]</>,
            onClick: () => setFilter("today"),
            color: "bg-blue-600",
          },
          {
            label: <>All [{leads.length}]</>,
            onClick: () => setFilter(""),
            color: "bg-cyan-600",
          },
          {
            label: <>Pending [{getCount("Pending")}]</>,
            onClick: () => setFilter("Pending"),
            color: "bg-orange-500",
          },
          {
            label: <>Miss [{getCount("Miss")}]</>,
            onClick: () => setFilter("Miss"),
            color: "bg-sky-500",
          },
          {
            label: <>Unscheduled [0]</>,
            onClick: () => toast.info("ℹ️ No Unscheduled Leads Yet."),
            color: "bg-gray-500",
          },
          {
            label: <>Closed [{getCount("Closed")}]</>,
            onClick: () => setFilter("Closed"),
            color: "bg-indigo-700",
          },
          {
            label: <>Deals [{getCount("Deals")}]</>,
            onClick: () => setFilter("Deals"),
            color: "bg-green-600",
          },
          {
            label: <>Void [{getCount("Void")}]</>,
            onClick: () => setFilter("Void"),
            color: "bg-red-600",
          },
          {
            label: <>Customer [{getCount("Customer")}]</>,
            onClick: () => setFilter("Customer"),
            color: "bg-purple-600",
          },
        ].map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`${btn.color} text-white text-[14px] font-medium rounded-sm shadow-md cursor-pointer flex items-center justify-center w-[140px] h-[40px]`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* FORM / TABLE */}
      {isAddingLead ? (
        <div className="mb-10">
          <CreateLead
            onSave={handleSave}
            onCancel={handleCancel}
            existingData={editingLead}
          />
        </div>
      ) : (
        <TodaysLeadsTable
          leads={filteredLeads}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
