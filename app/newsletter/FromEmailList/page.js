"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function FromEmailList() {
    const [search, setSearch] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [emails, setEmails] = useState([]);
    const [filteredEmails, setFilteredEmails] = useState([]);

    useEffect(() => {
        loadEmails();
    
        const handleStorageChange = (e) => {
            if (e.key === 'fromEmails') {
                loadEmails();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        const interval = setInterval(loadEmails, 1000);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredEmails(emails);
        } else {
            const searchLower = search.toLowerCase();
            setFilteredEmails(emails.filter(email => 
                email.email.toLowerCase().includes(searchLower)
            ));
        }
    }, [search, emails]);

    const loadEmails = () => {
        const savedEmails = JSON.parse(localStorage.getItem("fromEmails") || "[]");
        setEmails(savedEmails);
    };

    const saveEmails = (updatedEmails) => {
        setEmails(updatedEmails);
        localStorage.setItem("fromEmails", JSON.stringify(updatedEmails));
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredEmails.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
            setSelectAll(false);
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this email?')) {
            const updatedEmails = emails.filter(email => email.id !== id);
            saveEmails(updatedEmails);
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedRows.length === 0) {
            alert('Please select at least one email to delete');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${selectedRows.length} email(s)?`)) {
            const updatedEmails = emails.filter(email => !selectedRows.includes(email.id));
            saveEmails(updatedEmails);
            setSelectedRows([]);
            setSelectAll(false);
        }
    };

    const handleSearch = () => {
        console.log('Searching for:', search);
    };

    return (
        <div className="w-full h-screen bg-[#e5e7eb] overflow-y-auto">
            <div className="py-4 md:py-10">
                <div className="max-w-[1480px] mx-auto px-2 sm:px-4">
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-lg">
                            <h1 className="text-lg sm:text-xl font-normal text-gray-600">
                                From Email <strong>List</strong>
                            </h1>
                        </div>

                        <div className="bg-white px-4 sm:px-6 py-4 sm:py-6">
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mb-6">
                                <input
                                    type="text"
                                    placeholder="Search Email"
                                    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button 
                                    onClick={handleSearch}
                                    className="bg-[#0ea5e9] text-white px-8 py-2 rounded text-sm hover:bg-[#0284c7] w-full sm:w-auto transition-colors"
                                >
                                    Search
                                </button>
                            </div>

                            <div className="hidden md:block border border-gray-200 overflow-x-auto rounded">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#dee2e6]">
                                            <th className="py-3 px-4 text-left w-12 border-r border-b border-gray-300">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 cursor-pointer"
                                                    checked={selectAll && filteredEmails.length > 0}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6c757d] uppercase tracking-wider w-24 border-r border-b border-gray-300">
                                                SR. NO.
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6c757d] uppercase tracking-wider border-r border-b border-gray-300">
                                                EMAIL
                                            </th>
                                            <th className="py-3 px-4 text-right text-xs font-semibold text-[#6c757d] uppercase tracking-wider border-b border-gray-300">
                                                DELETE
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="bg-white">
                                        {filteredEmails.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-8 px-4 text-center text-gray-500 border-b border-gray-300">
                                                    {search ? 'No emails found matching your search' : 'No emails added yet'}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredEmails.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4 border-r border-b border-gray-300">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 cursor-pointer"
                                                            checked={selectedRows.includes(item.id)}
                                                            onChange={() => handleSelectRow(item.id)}
                                                        />
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-700 border-r border-b border-gray-300">
                                                        {index + 1}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-700 border-r border-b border-gray-300">
                                                        {item.email}
                                                    </td>
                                                    <td className="py-3 px-4 text-right border-b border-gray-300">
                                                        <button 
                                                            className="text-gray-700 hover:text-red-600 transition-colors"
                                                            onClick={() => handleDelete(item.id)}
                                                            title="Delete email"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                <div className="bg-[#dee2e6] border border-gray-300 rounded-lg p-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 cursor-pointer"
                                            checked={selectAll && filteredEmails.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                        <span className="text-sm font-semibold text-[#6c757d] uppercase tracking-wider">
                                            SELECT ALL
                                        </span>
                                    </label>
                                </div>

                                {filteredEmails.length === 0 ? (
                                    <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                                        <p className="text-gray-500">
                                            {search ? 'No emails found matching your search' : 'No emails added yet'}
                                        </p>
                                    </div>
                                ) : (
                                    filteredEmails.map((item, index) => (
                                        <div 
                                            key={item.id} 
                                            className="bg-white border border-gray-300 rounded-lg p-4 space-y-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="w-5 h-5 cursor-pointer mt-1"
                                                        checked={selectedRows.includes(item.id)}
                                                        onChange={() => handleSelectRow(item.id)}
                                                    />
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase font-semibold">SR NO:</div>
                                                        <div className="text-sm text-gray-700 font-medium">{index + 1}</div>
                                                    </div>
                                                </label>
                                                <button 
                                                    className="text-gray-700 hover:text-red-600 p-2 transition-colors"
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Delete email"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="pl-8 space-y-2">
                                                <div>
                                                    <div className="text-xs text-gray-500 uppercase font-semibold">Email:</div>
                                                    <div className="text-sm text-gray-700 break-all">{item.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-6">
                                <button 
                                    className="bg-red-500 text-white px-6 py-2 rounded text-sm hover:bg-[#c82333] w-full sm:w-auto"
                                    onClick={handleDeleteSelected}
                                    disabled={selectedRows.length === 0}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}