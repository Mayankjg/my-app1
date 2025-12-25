"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function FromEmailList() {
    const [search, setSearch] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const emailData = [
        { id: 1, name: "Pratik", email: "radhu.pratik2118@gmail.com" },
        { id: 2, name: "meghavi", email: "kshatriya0meghavi@gmail.com" },
        { id: 3, name: "Pratik", email: "and.test.21990@gmail.com" }
    ];

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(emailData.map(item => item.id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectRow = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const handleDelete = (id) => {
        console.log("Delete row:", id);
    };

    const handleDeleteSelected = () => {
        console.log("Delete selected:", selectedRows);
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
                                    placeholder="Display Name/Email"
                                    className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 text-sm text-gray-500 focus:outline-none focus:border-gray-400"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="bg-[#0ea5e9] text-white px-8 py-2 rounded text-sm hover:bg-[#0284c7] w-full sm:w-auto">
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
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6c757d] uppercase tracking-wider w-24 border-r border-b border-gray-300">
                                                SR. NO.
                                            </th>
                                            <th className="py-3 px-4 text-left text-xs font-semibold text-[#6c757d] uppercase tracking-wider border-r border-b border-gray-300">
                                                NAME
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
                                        {emailData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="py-3 px-4 border-r border-b border-gray-300">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 cursor-pointer"
                                                        checked={selectedRows.includes(item.id)}
                                                        onChange={() => handleSelectRow(item.id)}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700 border-r border-b border-gray-300">
                                                    {item.id}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700 border-r border-b border-gray-300">
                                                    {item.name}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-700 border-r border-b border-gray-300">
                                                    {item.email}
                                                </td>
                                                <td className="py-3 px-4 text-right border-b border-gray-300">
                                                    <button 
                                                        className="text-gray-700 hover:text-red-600"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="md:hidden space-y-4">
                                <div className="bg-[#dee2e6] border border-gray-300 rounded-lg p-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 cursor-pointer"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                        <span className="text-sm font-semibold text-[#6c757d] uppercase tracking-wider">
                                            SELECT ALL
                                        </span>
                                    </label>
                                </div>

                                {emailData.map((item) => (
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
                                                    <div className="text-sm text-gray-700 font-medium">{item.id}</div>
                                                </div>
                                            </label>
                                            <button 
                                                className="text-gray-700 hover:text-red-600 p-2"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>

                                        <div className="pl-8 space-y-2">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-semibold">Name:</div>
                                                <div className="text-sm text-gray-700">{item.name}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-semibold">Email:</div>
                                                <div className="text-sm text-gray-700 break-all">{item.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <button 
                                    className="bg-[#dc3545] text-white px-6 py-2 rounded text-sm hover:bg-[#c82333] w-full sm:w-auto"
                                    onClick={handleDeleteSelected}
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