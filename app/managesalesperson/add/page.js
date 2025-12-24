"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSalespersonForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    designation: "",
    country: "",
    countryCode: "",
    contactNo: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Only JPG or PNG images allowed",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        profileImage: "Image must be under 2MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, profileImage: "" }));

    setFormData((prev) => ({ ...prev, profileImage: file }));

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "User Name is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "User Name must be at least 3 characters";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.country) {
      newErrors.country = "Please select a country";
    }

    if (formData.countryCode && !/^\+?[0-9]+$/.test(formData.countryCode)) {
      newErrors.countryCode = "Country Code must be digits only (Ex: +91)";
    }

    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact Number is required";
    } else if (!/^[0-9]{7,10}$/.test(formData.contactNo)) {
      newErrors.contactNo = "Contact Number must be 7–10 digits";
    }

    if (formData.profileImage) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(formData.profileImage.type)) {
        newErrors.profileImage = "Only JPG/PNG allowed";
      }

      if (formData.profileImage.size > 2 * 1024 * 1024) {
        newErrors.profileImage = "Image must be under 2MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert("Please fill all fields");
      return;
    }

    const newSalesperson = {
      id: Date.now(),
      username: formData.userName,
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      designation: formData.designation,
      country: formData.country,
      contact: `${formData.countryCode ? formData.countryCode + " " : ""}${formData.contactNo}`,
      profileImage: imagePreview || "/default-avatar.png",
    };

    alert("Salesperson added successfully!");
    // router.push("/managesalesperson");
  };

  const handleCancel = () => {
    if (confirm("Unsaved changes will be lost. Continue?")) {
      // router.push("/managesalesperson");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 overflow-y-auto">
      <div className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="bg-white rounded-lg shadow-sm">
            
            <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
              <h1 className="text-lg sm:text-xl font-normal text-gray-700">
                Add <span className="font-semibold">Salesperson</span>
              </h1>
            </div>

            <div className="p-4 sm:p-6 md:p-8">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">

                <div>
                  <label className="block text-sm text-gray-600 mb-2">User Name*</label>
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    placeholder="User Name"
                    className={`w-full text-black px-4 py-2.5 border ${errors.userName ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                  />
                  {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Profile Image</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-black text-sm file:px-4 file:py-2 file:border file:border-gray-300 file:rounded file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                    />
                    <div className="w-28 h-28 border border-gray-300 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-300 text-xs">No image</span>
                      )}
                    </div>
                  </div>
                  {errors.profileImage && <p className="text-red-500 text-xs mt-1">{errors.profileImage}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">

                <div>
                  <label className="block text-sm text-gray-600 mb-2">First Name*</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className={`w-full text-black px-4 py-2.5 border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Last Name*</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className={`w-full text-black px-4 py-2.5 border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className={`w-full text-black px-4 py-2.5 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Designation*</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    placeholder="Designation"
                    className={`w-full text-black px-4 py-2.5 border ${errors.designation ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                  />
                  {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Country*</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full text-black px-4 py-2.5 border ${errors.country ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                  >
                    <option value="">Select Country</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                  </select>
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Code</label>
                    <input
                      type="text"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      placeholder="+91"
                      className={`w-full text-black px-4 py-2.5 border ${errors.countryCode ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                    />
                    {errors.countryCode && <p className="text-red-500 text-xs mt-1">{errors.countryCode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Contact No*</label>
                    <input
                      type="tel"
                      name="contactNo"
                      value={formData.contactNo}
                      onChange={handleInputChange}
                      placeholder="Contact No"
                      className={`w-full text-black px-4 py-2.5 border ${errors.contactNo ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-gray-400`}
                    />
                    {errors.contactNo && <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t bg-[#e5e9ec] border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-8 py-2 text-white bg-cyan-500 rounded hover:bg-cyan-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}