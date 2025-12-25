"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

export default function ImportContacts() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("import");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [columnHeaders, setColumnHeaders] = useState([]);

  const ImportContactsPage = () => {
    const handleFileChange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            if (jsonData.length > 0) {
              const headers = jsonData[0];
              const rows = jsonData.slice(1).filter(row => row.some(cell => cell));

              setColumnHeaders(headers);
              setFileData(rows);
            }
          } catch (error) {
            alert('Error reading file. Please make sure it is a valid Excel or CSV file.');
            console.error(error);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };

    const handleDownload = () => {
      const csvContent = "Name,Email\nJohn Doe,john@gmail.com\nJane Smith,jane@gmail.com";
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contacts_template.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    };

    const handleNext = () => {
      if (!selectedFile) {
        alert('Please select a file first');
        return;
      }
      if (fileData.length === 0) {
        alert('The selected file is empty or could not be read');
        return;
      }
      setCurrentPage("detail");
    };

    const handleCancel = () => {
      setSelectedFile(null);
      setFileData([]);
      setColumnHeaders([]);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      router.push('/newsletter/ContactList');
    };

    return (
      <div className="bg-[#e5e7eb] p-0 sm:p-5 h-screen overflow-hidden flex justify-center items-start">
        <div className="bg-white w-full max-w-[1400px] h-110 overflow-y-auto">
          <div className="bg-white w-full px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-normal text-gray-700">
                Import <strong>Contacts</strong>
              </h1>
            </div>
            <hr className="-mx-4 sm:-mx-6 border-t border-gray-300 mt-4 mb-0" />
          </div>

          <div className="w-full px-4 sm:px-6 py-6 pb-8">
            <div className="max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8">
                <div className="w-full sm:w-24 flex-shrink-0">
                  <span className="text-sm sm:text-base font-semibold text-gray-600">STEP 01</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">
                    Ensure Your File is Formatted Properly
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Please review the example file to be sure your file is formatted properly. You can also download the template directly.
                    <br className="hidden sm:block" />
                    <span className="block sm:inline mt-1 sm:mt-0">Name, Email field must be fill.</span>
                  </p>
                  <button
                    onClick={handleDownload}
                    className="w-full sm:w-auto bg-teal-500 hover:bg-teal-600 text-white px-4 py-1.5 cursor-pointer rounded text-sm font-medium transition-colors"
                  >
                    Download sample
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-full sm:w-24 flex-shrink-0">
                  <span className="text-sm sm:text-base font-semibold text-gray-600">STEP 02</span>
                </div>
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 md:gap-10 lg:gap-16 xl:gap-20">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap sm:pt-2">
                      Excel File <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1 rounded border border-gray-400 text-sm font-medium cursor-pointer transition-colors whitespace-nowrap">
                          Choose File
                          <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                        <span className="text-sm text-gray-600 break-words">
                          {selectedFile ? selectedFile.name : 'No file chosen'}
                        </span>
                      </div>

                      {selectedFile && fileData.length > 0 && (
                        <p className="text-sm text-gray-500">
                          {fileData.length} rows found
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleNext}
                          className="w-full sm:w-auto bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-10 py-2 cursor-pointer rounded-sm text-sm font-medium transition-colors"
                        >
                          Next
                        </button>
                        <button
                          onClick={handleCancel}
                          className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-700 px-10 py-2 cursor-pointer rounded-sm border border-gray-300 text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ImportContactDetail = () => {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [nameColumnIndex, setNameColumnIndex] = useState("");
    const [emailColumnIndex, setEmailColumnIndex] = useState("");

    const handleSave = () => {
      if (!selectedProduct) {
        alert('Please select a product');
        return;
      }
      if (!nameColumnIndex) {
        alert('Please select First Name field');
        return;
      }
      if (!emailColumnIndex) {
        alert('Please select Email field');
        return;
      }

      const newContacts = fileData.map((row, index) => {
        const name = row[parseInt(nameColumnIndex)] || '';
        const email = row[parseInt(emailColumnIndex)] || '';

        return {
          id: Date.now() + index,
          name: name.toString().trim(),
          email: email.toString().trim(),
          product: selectedProduct
        };
      }).filter(contact => contact.name && contact.email);

      if (newContacts.length === 0) {
        alert('No valid contacts found in the selected columns');
        return;
      }

      const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      const allContacts = [...existingContacts, ...newContacts];
      localStorage.setItem('contacts', JSON.stringify(allContacts));

      alert(`${newContacts.length} contacts imported successfully!`);
      router.push('/newsletter/ContactList');
    };

    const handleCancel = () => {
      router.push('/newsletter/ContactList');
    };

    return (
      <div className="bg-[#e5e7eb] p-0 sm:p-5 h-screen overflow-hidden flex justify-center items-start">
        <div className="bg-white w-full max-w-[1400px] h-full overflow-y-auto">
         <div className="bg-gray-200 w-full px-4 sm:px-0 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-normal text-gray-700">
                <strong> Import Contact Detail</strong>
              </h1>
            </div>
          </div>

          <div className="w-full px-4 py-4 sm:px-3 pb-8">
            <div className="max-w-3xl">
             <h2 className="text-lg sm:text-xl font-normal text-gray-700 mb-3">
                Contact <strong>Import</strong>
              </h2>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Adjust field names with the appropriate column names of the source file that you import.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  First Name, Email field must be fill.
                </p>

                <div className="mb-6">
                  <span className="text-sm sm:text-base font-semibold text-gray-600 block mb-4">
                    STEP 01
                  </span>

                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap sm:w-32">
                        Select Product <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full sm:flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring hover:bg-gray-100 focus:border-transparent"
                      >
                        <option value="">Select Products</option>
                        <option value="Bandhani">Bandhani</option>
                        <option value="Galaxy S1">Galaxy S1</option>
                        <option value="Galaxy S3">Galaxy S3</option>
                        <option value="Realme Narzo 50">Realme Narzo 50</option>
                        <option value="Realme Narzo 30">Realme Narzo 30</option>
                        <option value="All">All</option>
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap sm:w-32">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={nameColumnIndex}
                        onChange={(e) => setNameColumnIndex(e.target.value)}
                        className="w-full sm:flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring hover:bg-gray-100 focus:border-transparent"
                      >
                        <option value="">None</option>
                        {columnHeaders.map((header, index) => (
                          <option key={index} value={index}>
                            {header} (col: {String.fromCharCode(65 + index)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap sm:w-32">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={emailColumnIndex}
                        onChange={(e) => setEmailColumnIndex(e.target.value)}
                        className="w-full sm:flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring hover:bg-gray-100 focus:border-transparent"
                      >
                        <option value="">None</option>
                        {columnHeaders.map((header, index) => (
                          <option key={index} value={index}>
                            {header} (col: {String.fromCharCode(65 + index)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:ml-[152px]">
                      <button
                        onClick={handleSave}
                        className="w-full sm:w-auto bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-12 py-2.5 rounded-md text-sm font-medium transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700 px-12 py-2.5 rounded-md text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return currentPage === "import" ? <ImportContactsPage /> : <ImportContactDetail />;
}