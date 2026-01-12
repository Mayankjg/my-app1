// my-app/app/leads/leadpage/CreateLead.js - FINAL VERSION WITHOUT TAGMODAL
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";

import ActivityHistory from "./ActivityHistoryPage.js/ActivityHistory";
import CategoriesModal from "@/app/manageitem/categories/CategoriesModal";
import LeadSourceModal from "@/app/manageitem/lead-source/LeadSourceModal";
import LeadStatusModal from "@/app/manageitem/lead-status/LeadStatusModal";
import ProductsTableModal from "@/app/manageitem/products/ProductsTableModal";

export default function CreateLead({ onSave, onCancel, existingData }) {
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://crm-tenacious-techies-pro-1.onrender.com";

  const router = useRouter();
  const activityHistoryRef = useRef(null);

  const isEditMode = Boolean(existingData?._id);

  /* --------------------------- USER --------------------------- */
  const [loggedUser, setLoggedUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("ts-user");
    if (user) setLoggedUser(JSON.parse(user));
  }, []);

  const isAdmin = loggedUser?.role === "admin";
  const isSalesperson = loggedUser?.role === "salesperson";

  /* --------------------------- DEFAULT FORM --------------------------- */
  const defaultForm = useCallback(() => {
    const now = new Date();
    return {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      mobile: "",
      fax: "",
      designation: "",
      website: "",
      salesperson: "",
      category: "",
      product: "",
      leadSource: "",
      leadStatus: "",
      tags: [],
      leadStartDate: now.toISOString().split("T")[0],
      leadStartTime: now.toTimeString().slice(0, 5),
      leadRemindDate: now.toISOString().split("T")[0],
      leadRemindTime: now.toTimeString().slice(0, 5),
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      expectedAmount: "",
      paymentReceived: "",
      comment: "",
      facebook: "",
      skype: "",
      linkedIn: "",
      gtalk: "",
      twitter: "",
      convertOption: "",
    };
  }, []);

  const [formData, setFormData] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const submittedRef = useRef(false);

  /* --------------------------- DROPDOWNS --------------------------- */
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [salespersons, setSalespersons] = useState([]);
  const [tags, setTags] = useState([]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [cat, prod, src, status, sales, tagsResponse] = await Promise.all([
        axios.get(`${API_BASE}/api/manage-items/categories/get-categories`),
        axios.get(`${API_BASE}/api/manage-items/products/get-products`),
        axios.get(`${API_BASE}/api/manage-items/lead-source/get-lead-sources`),
        axios.get(`${API_BASE}/api/manage-items/lead-status/get-lead-status`),
        axios.get(`${API_BASE}/api/salespersons/get-salespersons`),
        axios.get(`${API_BASE}/api/manage-items/tags/get-tags`),
      ]);

      setCategories(cat.data || []);
      setProducts(prod.data || []);
      setLeadSources(src.data || []);
      setLeadStatuses(status.data || []);
      setSalespersons(sales.data || []);
      setTags(tagsResponse.data || []);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      toast.error("Failed to load dropdown data");
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  /* --------------------------- EDIT MODE - FIXED --------------------------- */
  useEffect(() => {
    if (isEditMode && existingData && tags.length > 0) {
      console.log("📝 Edit Mode - Processing tags:", existingData.tags);
      console.log("📝 Available tags in dropdown:", tags);

      const normalizedTags = existingData.tags?.map((t) => {
        if (typeof t === 'string') {
          if (t.length === 24 && /^[a-f0-9]{24}$/i.test(t)) {
            console.log(`⚠️ Found ObjectId: ${t}, trying to find tag name`);
            const foundTag = tags.find(tag => tag._id === t);
            if (foundTag) {
              console.log(`✅ Converted ObjectId ${t} to tag name: ${foundTag.name}`);
              return foundTag.name;
            }
            console.warn(`❌ Could not find tag with _id: ${t}`);
            return null;
          }
          console.log(`✅ Using existing tag name: ${t}`);
          return t;
        }
        
        if (t && typeof t === 'object' && t.name) {
          console.log(`✅ Extracted tag name from object: ${t.name}`);
          return t.name;
        }
        
        if (t && typeof t === 'object' && t._id) {
          const foundTag = tags.find(tag => tag._id === t._id);
          if (foundTag) {
            console.log(`✅ Found tag by _id: ${foundTag.name}`);
            return foundTag.name;
          }
        }
        
        console.warn("❌ Could not process tag:", t);
        return null;
      }).filter(Boolean) || [];

      console.log("✅ Final normalized tags:", normalizedTags);

      setFormData({
        ...defaultForm(),
        ...existingData,
        tags: normalizedTags,
        salesperson: existingData.salesperson || "",
      });
    }
  }, [isEditMode, existingData, defaultForm, tags]);

  useEffect(() => {
    if (!isEditMode && isSalesperson && loggedUser?.username) {
      setFormData((p) => ({
        ...p,
        salesperson: loggedUser.username,
      }));
    }
  }, [isEditMode, isSalesperson, loggedUser]);

  /* --------------------------- INPUT --------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (isSalesperson && name === "salesperson") return;
    if (isEditMode && name === "comment") return;

    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* --------------------------- VALIDATION --------------------------- */
  const validateForm = () => {
    const e = {};
    if (!formData.firstName) e.firstName = "Required";
    if (!formData.salesperson) e.salesperson = "Required";
    if (!formData.category) e.category = "Required";
    if (!formData.product) e.product = "Required";
    if (!formData.leadStatus) e.leadStatus = "Required";
    return e;
  };

  /* --------------------------- ACTIVITY HISTORY FIX --------------------------- */
  const [latestComment, setLatestComment] = useState("");

  useEffect(() => {
    if (isEditMode && formData.comment) {
      setLatestComment(formData.comment);
    }
  }, [isEditMode, formData.comment]);

  const handleCommentUpdate = (newComment) => {
    console.log("📝 Comment Update Triggered:", newComment);
    setLatestComment(newComment);
    setFormData((prev) => ({
      ...prev,
      comment: newComment,
    }));
  };

  /* --------------------------- SUBMIT - FIXED --------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittedRef.current) return;
    submittedRef.current = true;

    const errs = validateForm();
    setErrors(errs);

    if (Object.keys(errs).length) {
      toast.error("Please fill required fields");
      submittedRef.current = false;
      return;
    }

    try {
      let res;
      if (isEditMode) {
        const updatePayload = {
          ...formData,
          comment: latestComment,
          tags: formData.tags || [],
        };

        console.log("🚀 Sending Update:", updatePayload);

        res = await axios.put(
          `${API_BASE}/api/leads/update-lead/${existingData._id}`,
          updatePayload
        );
      } else {
        const createPayload = {
          ...formData,
          tags: formData.tags || [],
        };
        
        console.log("🚀 Creating Lead:", createPayload);
        
        res = await axios.post(`${API_BASE}/api/leads/create-lead`, createPayload);
        handleReset();
      }

      toast.success(res.data?.message || "Success");
      onSave?.(res.data);
    } catch (err) {
      console.error("❌ Submit Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      submittedRef.current = false;
    }
  };

  /* --------------------------- RESET / CANCEL --------------------------- */
  const handleReset = () => {
    setFormData(defaultForm());
    setErrors({});
    setLatestComment("");
    toast.info("Form Reset");
  };

  const handleCancelClick = () => {
    onCancel?.();
  };

  /* --------------------------- SCROLL --------------------------- */
  const scrollToActivityHistory = () => {
    activityHistoryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* --------------------------- MODALS --------------------------- */
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showLeadSourceModal, setShowLeadSourceModal] = useState(false);
  const [showLeadStatusModal, setShowLeadStatusModal] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadStatus, setNewLeadStatus] = useState("");

  const addCategory = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/manage-items/categories/create-category`,
        { name: newCategoryName }
      );
      setCategories((p) => [...p, res.data]);
      setFormData((p) => ({ ...p, category: res.data.name }));
      setShowCategoryModal(false);
      setNewCategoryName("");
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const addProduct = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/manage-items/products/create-product`,
        { name: newProduct }
      );
      setProducts((p) => [...p, res.data]);
      setFormData((p) => ({ ...p, product: res.data.name }));
      setShowProductModal(false);
      setNewProduct("");
      toast.success("Product added successfully");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const addLeadSource = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/manage-items/lead-source/create-lead-source`,
        { name: newLeadName }
      );
      setLeadSources((p) => [...p, res.data]);
      setFormData((p) => ({ ...p, leadSource: res.data.name }));
      setShowLeadSourceModal(false);
      setNewLeadName("");
      toast.success("Lead source added successfully");
    } catch (error) {
      toast.error("Failed to add lead source");
    }
  };

  const addLeadStatus = async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/manage-items/lead-status/create-lead-status`,
        { name: newLeadStatus }
      );
      setLeadStatuses((p) => [...p, res.data]);
      setFormData((p) => ({ ...p, leadStatus: res.data.name }));
      setShowLeadStatusModal(false);
      setNewLeadStatus("");
      toast.success("Lead status added successfully");
    } catch (error) {
      toast.error("Failed to add lead status");
    }
  };

  // Tag Toggle - Store tag names as strings
  const handleTagToggle = (tag) => {
    setFormData((prev) => {
      const tagName = typeof tag === 'string' ? tag : tag.name;
      const exists = prev.tags?.includes(tagName);

      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tagName)
          : [...(prev.tags || []), tagName],
      };
    });
  };

  /* --------------------------- FIELD CONFIG --------------------------- */
  const leftFields = [
    { key: "lastName", placeholder: "Last Name" },
    { key: "company", placeholder: "Company Name" },
    { key: "email", placeholder: "Email address" },
    { key: "phone", placeholder: "Phone Number" },
    { key: "mobile", placeholder: "Mobile" },
    { key: "fax", placeholder: "Fax" },
    { key: "designation", placeholder: "Designation" },
    { key: "website", placeholder: "Website" },
  ];

  const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "UK", label: "UK" },
  ];

  /* ----------------------------------------------------
      UI — FULL PAGE LAYOUT (RESPONSIVE) WITH HIDDEN SCROLLBAR
     ---------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6 overflow-y-scroll scrollbar-hide">
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <ToastContainer position="top-right" autoClose={2000} />

      <form
        onSubmit={handleSubmit}
        className="mx-auto bg-white shadow-md rounded-lg p-4 sm:p-6 text-black max-w-6xl"
      >
        <h2 className="text-xl font-semibold mb-6">
          {existingData ? "Update" : "Create New"} <b>Lead</b>
        </h2>

        {/* -------------------- LEAD INFORMATION -------------------- */}
        <h3 className="font-semibold mb-2">Lead Information</h3>

        <div className="flex flex-col lg:flex-row w-full border-b border-gray-200 pb-6 gap-6">
          {/* LEFT (2/3 on desktop, full width on mobile) */}
          <div className="flex-1 lg:pr-6 lg:border-r border-gray-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name (required) */}
              <div>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name *"
                  className={`border rounded-sm px-3 h-[40px] w-full text-sm ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Remaining left fields */}
              {leftFields.map(({ key, placeholder }) => (
                <div key={key}>
                  <input
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="border rounded-sm px-3 h-[40px] w-full text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT (1/3 on desktop, full width on mobile) */}
          <div className="w-full lg:w-[33%] lg:pl-6 flex flex-col gap-3">
            {/* Salesperson (admin only) */}
            {isAdmin && (
              <div>
                <div className="flex gap-2">
                  <select
                    name="salesperson"
                    value={formData.salesperson}
                    onChange={handleChange}
                    className={`border rounded-sm px-3 h-[40px] w-full text-sm ${
                      errors.salesperson ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Sales person *</option>
                    {salespersons.map((sp) => (
                      <option key={sp._id || sp.id} value={sp.username}>
                        {sp.username}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 w-[40px] h-[40px] flex-shrink-0 rounded text-xl transition-colors"
                    onClick={() =>
                      router.push(
                        "/manage-salespersons/salesperson-list/managesalesperson/add"
                      )
                    }
                  >
                    +
                  </button>
                </div>
                {errors.salesperson && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.salesperson}
                  </p>
                )}
              </div>
            )}

            {/* Category */}
            <div>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`border rounded-sm px-3 h-[40px] w-full text-sm ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="bg-gray-300 hover:bg-gray-400 w-[40px] h-[40px] flex-shrink-0 rounded text-xl transition-colors"
                >
                  +
                </button>
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            {/* Product */}
            <div>
              <div className="flex gap-2">
                <select
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  className={`border rounded-sm px-3 h-[40px] w-full text-sm ${
                    errors.product ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Product *</option>
                  {products.map((p) => (
                    <option key={p._id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowProductModal(true)}
                  className="bg-gray-300 hover:bg-gray-400 w-[40px] h-[40px] flex-shrink-0 rounded text-xl transition-colors"
                >
                  +
                </button>
              </div>
              {errors.product && (
                <p className="text-red-500 text-xs mt-1">{errors.product}</p>
              )}
            </div>

            {/* Lead Source */}
            <div className="flex gap-2">
              <select
                name="leadSource"
                value={formData.leadSource}
                onChange={handleChange}
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              >
                <option value="">Select Lead Source</option>
                {leadSources.map((src) => (
                  <option key={src._id} value={src.name}>
                    {src.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowLeadSourceModal(true)}
                className="bg-gray-300 hover:bg-gray-400 w-[40px] h-[40px] flex-shrink-0 rounded text-xl transition-colors"
              >
                +
              </button>
            </div>

            {/* Lead Status */}
            <div>
              <div className="flex gap-2">
                <select
                  name="leadStatus"
                  value={formData.leadStatus}
                  onChange={handleChange}
                  className={`border rounded-sm px-3 h-[40px] w-full text-sm ${
                    errors.leadStatus ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Select Lead Status *</option>
                  {leadStatuses.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowLeadStatusModal(true)}
                  className="bg-gray-300 hover:bg-gray-400 w-[40px] h-[40px] flex-shrink-0 rounded text-xl transition-colors"
                >
                  +
                </button>
              </div>
              {errors.leadStatus && (
                <p className="text-red-500 text-xs mt-1">{errors.leadStatus}</p>
              )}
            </div>

            {/* TAGS SECTION - WITHOUT ADD BUTTON */}
            <div>
              <div className="mb-2">
                <label className="font-medium text-sm">Tags</label>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-2 border rounded-sm bg-gray-50">
                {tags.length > 0 ? (
                  tags.map((tag) => {
                    const tagName = typeof tag === 'string' ? tag : tag.name;
                    const tagColor = typeof tag === 'object' && tag.color ? tag.color : '#3B82F6';
                    
                    const selected = formData.tags?.includes(tagName);

                    return (
                      <label
                        key={tag._id || tagName}
                        className="flex items-center gap-2 border rounded px-3 py-1.5 cursor-pointer transition-all"
                        style={{
                          borderColor: selected ? tagColor : "#e5e7eb",
                          backgroundColor: selected
                            ? `${tagColor}20`
                            : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <span className="text-xs font-medium">{tagName}</span>
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tagColor }}
                        />
                      </label>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No tags available</p>
                )}
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">
                  Selected: {formData.tags.join(", ")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* -------------------- DATES (Start & Remind) -------------------- */}
        <div className="flex flex-col lg:flex-row w-full border-b border-gray-200 mt-6 pb-6 gap-6">
          <div className="flex-1 lg:pr-6 lg:border-r border-gray-300">
            <h3 className="font-semibold mb-2">Lead Start Date</h3>
            <div className="flex gap-2">
              <input
                type="date"
                name="leadStartDate"
                value={formData.leadStartDate}
                onChange={handleChange}
                className="border rounded-sm px-3 h-[40px] w-1/2 text-sm"
              />
              <input
                type="time"
                name="leadStartTime"
                value={formData.leadStartTime}
                onChange={handleChange}
                className="border rounded-sm px-3 h-[40px] w-1/2 text-sm"
              />
            </div>
          </div>

          <div className="w-full lg:w-[33%] lg:pl-6">
            <h3 className="font-semibold mb-2">Lead Remind Date</h3>
            <div className="flex gap-2">
              <input
                type="date"
                name="leadRemindDate"
                value={formData.leadRemindDate}
                onChange={handleChange}
                className="border rounded-sm px-3 h-[40px] w-1/2 text-sm"
              />
              <input
                type="time"
                name="leadRemindTime"
                value={formData.leadRemindTime}
                onChange={handleChange}
                className="border rounded-sm px-3 h-[40px] w-1/2 text-sm"
              />
            </div>
          </div>
        </div>

        {/* -------------------- ADDRESS -------------------- */}
        <div className="flex flex-col lg:flex-row w-full mt-6 pb-6 border-b border-gray-200 gap-6">
          <div className="flex-1 lg:pr-6 lg:border-r border-gray-300">
            <h3 className="font-semibold mb-2">Address Information</h3>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-sm px-3 py-2 text-sm"
              placeholder="Address"
              style={{ minHeight: 70 }}
            />

            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="border rounded-sm px-3 h-[40px] w-full text-sm mt-4"
            />
          </div>

          <div className="w-full lg:w-[33%] lg:pl-6">
            <div className="h-full flex flex-col">
              <h3 className="font-semibold mb-2 lg:invisible">
                Address Details
              </h3>
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="border rounded-sm px-3 h-[40px] w-full text-sm mb-3"
              />

              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="border rounded-sm px-3 h-[40px] w-full text-sm mb-3"
              >
                {countryOptions.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>

              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* -------------------- PAYMENT -------------------- */}
        <div className="flex flex-col lg:flex-row w-full mt-6 pb-6 border-b border-gray-200 gap-6">
          <div className="flex-1 lg:pr-6 lg:border-r border-gray-300">
            <h3 className="font-semibold mb-2">Payment Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="expectedAmount"
                value={formData.expectedAmount}
                onChange={handleChange}
                placeholder="Expected Amount"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />

              <input
                name="paymentReceived"
                value={formData.paymentReceived}
                onChange={handleChange}
                placeholder="Payment Received"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
            </div>
          </div>

          <div className="w-full lg:w-[33%] lg:pl-6">
            <h3 className="font-semibold mb-2 lg:invisible">Comment</h3>

            <div className="flex gap-3 items-start">
              <textarea
                name="comment"
                value={isEditMode ? latestComment : formData.comment}
                onChange={handleChange}
                disabled={isEditMode}
                className={`flex-1 border rounded-sm px-3 py-2 text-sm leading-snug whitespace-nowrap overflow-x-auto overflow-y-hidden ${
                  isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="Comment"
                style={{ minHeight: 40 }}
              />

              {isEditMode && (
                <button
                  type="button"
                  onClick={scrollToActivityHistory}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 rounded text-sm font-medium h-[38px] transition-colors"
                >
                  Add Comment
                </button>
              )}
            </div>
          </div>
        </div>

        {/* -------------------- SOCIAL -------------------- */}
        <div className="flex flex-col lg:flex-row w-full mt-6 pb-6 gap-6">
          <div className="flex-1 lg:pr-6 lg:border-r border-gray-300">
            <h3 className="font-semibold mb-2">Social Information</h3>

            <div className="space-y-3">
              <input
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Facebook"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
              <input
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                placeholder="LinkedIn"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
              <input
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="Twitter"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
            </div>
          </div>

          <div className="w-full lg:w-[33%] lg:pl-6">
            <h3 className="font-semibold mb-2 lg:invisible">Social Details</h3>

            <div className="space-y-3">
              <input
                name="skype"
                value={formData.skype}
                onChange={handleChange}
                placeholder="Skype"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
              <input
                name="gtalk"
                value={formData.gtalk}
                onChange={handleChange}
                placeholder="Gtalk"
                className="border rounded-sm px-3 h-[40px] w-full text-sm"
              />
            </div>
          </div>
        </div>

        {/* -------------------- BOTTOM ACTIONS -------------------- */}
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 flex-wrap">
              <label className="text-red-700 font-semibold">
                Convert to Customer
              </label>

              <label className="text-teal-600 font-semibold flex items-center gap-2">
                <input
                  type="radio"
                  name="convertOption"
                  value="deal"
                  checked={formData.convertOption === "deal"}
                  onChange={handleChange}
                />
                Convert to Deals
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                type="submit"
                disabled={submittedRef.current}
                className="bg-sky-600 hover:bg-sky-700 text-white w-full sm:w-28 py-1.5 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submittedRef.current ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-28 py-1.5 rounded text-sm transition-colors"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleCancelClick}
                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-28 py-1.5 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* -------------------- MODALS -------------------- */}
      <CategoriesModal
        showModal={showCategoryModal}
        setShowModal={setShowCategoryModal}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleAddCategory={addCategory}
      />

      <ProductsTableModal
        showPopup={showProductModal}
        setShowPopup={setShowProductModal}
        newProduct={newProduct}
        setNewProduct={setNewProduct}
        handleSaveProduct={addProduct}
      />

      <LeadSourceModal
        showModal={showLeadSourceModal}
        setShowModal={setShowLeadSourceModal}
        newLeadName={newLeadName}
        setNewLeadName={setNewLeadName}
        handleAddLeadSource={addLeadSource}
      />

      <LeadStatusModal
        showModal={showLeadStatusModal}
        setShowModal={setShowLeadStatusModal}
        newLeadStatus={newLeadStatus}
        setNewLeadStatus={setNewLeadStatus}
        handleAddLeadStatus={addLeadStatus}
      />

      {/* -------------------- ACTIVITY HISTORY - ONLY IN EDIT MODE -------------------- */}
      {isEditMode && (
        <div ref={activityHistoryRef}>
          <br />
          <br />
          <ActivityHistory
            leadId={existingData._id}
            currentComment={latestComment}
            onCommentUpdate={handleCommentUpdate}
          />
        </div>
      )}
    </div>
  );
}