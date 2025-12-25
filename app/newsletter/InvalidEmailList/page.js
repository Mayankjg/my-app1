"use client";

import react from "react";

export default function InvalidEmailList() {
    return (
        <div className="w-full min-h-screen bg-[#e5e7eb] py-10">
            <div className="max-w-[1480px] mx-auto mt-4 px-4">
                <div className="bg-white rounded-ld shadow-md">
                    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
                        <h1 className="text-xl font-normal text-gray-500">
                            Invalid Email <strong>List</strong>
                        </h1>
                    </div>
                    <div className="bg-white px-6 pb-6">
                        <label className="block text-sm font-medium text-gray-700 mt-10">
                        <strong className="text-red-500">(Note : After 7 Days Your List Record will be removed.)</strong>
                        </label>
                        <div className="border border-gray-200 overflow-hidden rounded-2 mt-2">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#dee2e6] border-b border-gray-200">
                                        <th className="py-3 px-4 text-left text-lg font-semibold text-[#6c757d] uppercase tracking-wider">
                                            SR NO.
                                        </th>
                                        <th className="py-3 px-4 text-left text-lg font-semibold text-[#6c757d] uppercase tracking-wider">
                                            EMAIL
                                        </th>
                                        <th className="py-3 px-4 text-left text-lg font-semibold text-[#6c757d] uppercase tracking-wider">
                                            USER
                                        </th>
                                        <th className="py-3 px-4 text-left text-lg font-semibold text-[#6c757d] uppercase tracking-wider">
                                            TYPE
                                        </th>
                                        <th className="py-3 px-4 text-left text-lg font-semibold text-[#6c757d] uppercase tracking-wider">
                                            DATE
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="10" className="py-5 text-center">
                                            <span className="text-red-500 text-base">No Record Found.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}