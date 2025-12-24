"use client";

import React, { useState } from 'react';

export default function AdminProfile() {
    const [formData, setFormData] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        designation: '',
        country: '',
        countryCode: '',
        contactNo: '',
        gender: '',
        profileImage: null
    });

    const [emailUpdates, setEmailUpdates] = useState(true);
    const [reminderMandatory, setReminderMandatory] = useState('Yes');
    const [showSuccess, setShowSuccess] = useState(false);
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [imagePreview, setImagePreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, profileImage: file }));

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        console.log('Form saved:', formData);
        alert('Profile updated successfully!');
    };

    const handleCancel = () => {
        if (confirm('Unsaved changes will be lost. Continue?')) {
            console.log('Form cancelled');
        }
    };

    const handleChangePassword = () => {
        console.log('Change password clicked');
        alert('Change password functionality will be implemented');
    };

    const handleEmailUpdate = () => {
        console.log('Email updates:', emailUpdates);
        alert('Email preferences updated successfully!');
    };

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            console.log('Account deletion requested');
            alert('Account deletion process initiated');
        }
    };

    const handleReminderDateUpdate = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const handleTimezoneUpdate = () => {
        console.log('Timezone updated:', timezone);
        alert('Timezone updated successfully!');
    };

    return (
        <div className="w-full h-screen bg-gray-200 overflow-y-auto">
            <div className="py-4 md:py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-4">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="border-b border-gray-300 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <h1 className="text-lg sm:text-xl font-normal text-gray-700">
                                Admin <span className="font-semibold">Profile</span>
                            </h1>
                            <button
                                onClick={handleChangePassword}
                                className="w-full sm:w-auto px-6 py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="p-4 sm:p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-1">
                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">User Name</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleInputChange}
                                        placeholder="User Name"
                                        className="w-full text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2 flex items-center gap-2">
                                        Email
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </label>
                                    <div className="text-gray-600 py-1">
                                        and.test.21990@gmail.com
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600 mb-1">Profile Image</label>
                                    <div className="flex flex-col sm:flex-row gap-1 items-start">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="text-black text-sm file:px-2 file:py-1 file:border file:border-gray-300 file:rounded-l-none file:rounded-r-none file:text-sm file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                                        />
                                        <div className="w-20 h-20 border border-gray-300 rounded hover:bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-gray-300 text-xs">No image</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-5">
                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                        className="w-full text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                        className="w-full text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">Gender</label>
                                    <div className="flex gap-4 pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={formData.gender === 'male'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-cyan-500 cursor-pointer"
                                            />
                                            <span className="text-gray-700 text-sm">Male</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={formData.gender === 'female'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-cyan-500 cursor-pointer"
                                            />
                                            <span className="text-gray-700 text-sm">Female</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        placeholder="Designation"
                                        className="w-full text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">Country</label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full text-black px-4 py-2.5 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
                                    >
                                        <option value="">Select Country</option>
                                        <option value="India">India</option>
                                        <option value="United States">United States</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Australia">Australia</option>
                                    </select>
                                </div>

                                <div className="md:col-span-4"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-4 sm:mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm text-gray-600 mb-2">Country Code</label>
                                    <input
                                        type="text"
                                        name="countryCode"
                                        value={formData.countryCode}
                                        onChange={handleInputChange}
                                        placeholder="+91"
                                        className="w-40 text-black px-4 py-2 border border-gray-300 rounded bg-gray-100 focus:outline-none"
                                        readOnly
                                    />
                                </div>

                                <div className="md:col-span-4">
                                    <label className="block text-sm text-gray-600 mb-2">Contact No</label>
                                    <input
                                        type="tel"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleInputChange}
                                        placeholder="Contact No"
                                        className="w-43 text-black px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:border-gray-400"
                                    />
                                </div>

                                <div className="md:col-span-6"></div>
                            </div>
                        </div>

                        <div className="border-t bg-gray-100 border-gray-200 px-4 sm:px-6 py-3 sm:py-3 flex flex-col-reverse sm:flex-row justify-end gap-3">
                            <button
                                onClick={handleSave}
                                className="w-full sm:w-auto px-8 py-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full sm:w-auto px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mt-6">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-normal text-gray-700">
                                Daily <span className="font-semibold">Email Status</span>
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="checkbox"
                                    id="emailUpdates"
                                    checked={emailUpdates}
                                    onChange={(e) => setEmailUpdates(e.target.checked)}
                                    className="w-5 h-5 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                                />
                                <label htmlFor="emailUpdates" className="text-gray-700 text-sm cursor-pointer">
                                    Receive Daily Email Updates about Leads added by Sales People in your Team.
                                </label>
                            </div>

                            <button
                                onClick={handleEmailUpdate}
                                className="px-6 py-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 transition-colors cursor-pointer"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mt-6">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-normal text-gray-700">
                                Delete <span className="font-semibold">Account</span>
                            </h2>
                        </div>
                        <div className="p-6">
                            <button
                                onClick={handleDeleteAccount}
                                className="px-6 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors cursor-pointer"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mt-6">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-normal text-gray-700">
                                Manage <span className="font-semibold">Reminder Date</span>
                            </h2>
                        </div>
                        <div className="p-6">
                            {showSuccess && (
                                <div className="mb-4 bg-teal-50 border border-teal-200 rounded px-4 py-3 flex items-center justify-between">
                                    <p className="text-teal-700 text-sm">
                                        Success: The <span className="font-semibold">Record</span> has been Updated.
                                    </p>
                                    <button
                                        onClick={() => setShowSuccess(false)}
                                        className="text-teal-500 hover:text-teal-700 text-xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm mb-3">
                                    Set Lead Remind Date Mandatory
                                </label>

                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reminderMandatory"
                                            value="Yes"
                                            checked={reminderMandatory === 'Yes'}
                                            onChange={(e) => setReminderMandatory(e.target.value)}
                                            className="w-4 h-4 text-cyan-500 cursor-pointer"
                                        />
                                        <span className="text-gray-700 text-sm">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="reminderMandatory"
                                            value="No"
                                            checked={reminderMandatory === 'No'}
                                            onChange={(e) => setReminderMandatory(e.target.value)}
                                            className="w-4 h-4 text-cyan-500 cursor-pointer"
                                        />
                                        <span className="text-gray-700 text-sm">No</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleReminderDateUpdate}
                                className="px-6 py-2 text-white bg-[#0aa699] rounded cursor-pointer transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm mt-6">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="text-lg font-normal text-gray-700">
                                Your <span className="font-semibold">Timezone</span>
                            </h2>
                        </div>


                        <div className="mb-6">
                            <p className="text-red-600 text-sm mt-4 ml-6">
                                Your Current Timezone : <span className="font-semibold">Asia/Kolkata</span>
                            </p>

                            <label className="block text-gray-700 text-sm font-medium mt-4 ml-6">
                                Time Zone
                            </label>

                            <select
                                className="w-60 text-black px-4 py-2.5 mt-4 ml-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                <option value="Asia/Kolkata">Asia/Kolkata</option>
                                <option value="America/New_York">America/New_York</option>
                                <option value="Europe/London">Europe/London</option>
                                <option value="Asia/Tokyo">Asia/Tokyo</option>
                            </select>
                        </div>

                        <div className="border-t bg-gray-100 border-gray-200 px-6 pt-6 flex flex-col-reverse sm:flex-row gap-2">
                            <button
                                onClick={handleSave}
                                className="w-full mb-3 sm:w-auto px-8 py-2 text-white bg-cyan-500 rounded hover:bg-cyan-600 cursor-pointer"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full mb-3 sm:w-auto px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}