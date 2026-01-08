"use client";

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function SendGroupContact() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [totalRecipients, setTotalRecipients] = useState(0);
    const [remainingEmails] = useState(500);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [fileData, setFileData] = useState([]);
    const [columnHeaders, setColumnHeaders] = useState([]);

    useEffect(() => {
        const templateData = localStorage.getItem('selectedTemplateData');
        if (templateData) {
            try {
                setSelectedTemplate(JSON.parse(templateData));
            } catch (e) {
                console.error('Error parsing template:', e);
            }
        }
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
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
                        setTotalRecipients(0); 
                    }
                } catch (error) {
                    alert('Error reading file. Please make sure it is a valid Excel or CSV file.');
                    console.error(error);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select an Excel file first');
            return;
        }
        
        if (fileData.length === 0) {
            alert('The selected file is empty or could not be read');
            return;
        }

        const validRecipients = fileData.filter(row => {
            const nameIndex = columnHeaders.findIndex(h => 
                h && h.toString().toLowerCase().includes('name')
            );
            const emailIndex = columnHeaders.findIndex(h => 
                h && h.toString().toLowerCase().includes('email')
            );
            
            return row[nameIndex] && row[emailIndex];
        });

        setTotalRecipients(validRecipients.length);
        alert(`File uploaded successfully! Found ${validRecipients.length} valid recipients.`);
    };

    const handleDownloadSample = () => {
        const csvContent = "Name,Email\nMayank Jaglaganeshwala,mayank.jwala@gmail.com\nLalu Jaglaganeshwala,lalu.jwala@gmail.com";
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

    const handleSend = () => {
        if (totalRecipients === 0) {
            alert('Please upload a file with recipients first.');
            return;
        }
        
        if (!selectedTemplate || !selectedTemplate.content) {
            alert('No template content found. Please go back and select a template.');
            return;
        }
        
        alert(`Sending emails to ${totalRecipients} recipients...`);
    };

    const handlePreview = () => {
        if (!selectedTemplate?.content) {
            return alert('No template selected. Please go back to Custom Message and select a template.');
        }
        setShowPreview(true);
    };

    return (
        <div>
            <style>{`.preview-content{font-family:Arial,sans-serif;line-height:1.6;color:#000}
.preview-content p,.preview-content h1,.preview-content h2,.preview-content h3,.preview-content h4,.preview-content h5,.preview-content h6,.preview-content span,.preview-content div,.preview-content li,.preview-content strong,.preview-content em,.preview-content u{color:black!important}
.preview-content table{border-collapse:collapse;width:100%;margin:10px 0}
.preview-content table td,.preview-content table th{border:1px solid #ddd;padding:8px}`}</style>

            {showPreview && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50">
                            <h2 className="text-xl font-bold text-gray-800">Email Preview</h2>
                            <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors" title="Close">×</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            <div className="bg-white rounded-lg shadow-sm p-6 preview-content">
                                {selectedTemplate?.content ? (
                                    <div dangerouslySetInnerHTML={{ __html: selectedTemplate.content }} />
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-400 text-lg">⚠️ No template content available</p>
                                        <p className="text-gray-500 text-sm mt-2">Please go back and select a template</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-300 flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setShowPreview(false)} className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded focus:outline-none transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}

            <div className='bg-[#dde1e4] p-0 h-screen overflow-y-auto flex justify-start items-start'>
                <div className='bg-white w-full'>
                    <div className='bg-white w-full px-6 py-3 border-b border-gray-300'>
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-normal text-gray-600">
                                Send <strong className="font-semibold text-gray-700">Mail</strong>
                            </h1>
                            <div className="bg-[#a0522d] text-white px-6 py-2 rounded flex items-center gap-3">
                                <span className="font-normal text-base">Remaining Emails:</span>
                                <span className="font-bold text-xl">{remainingEmails}</span>
                            </div>
                        </div>
                    </div>

                    <div className='w-full px-6 py-8'>
                        <div className='grid grid-cols-2 gap-12'>
                            <div>
                                <div className="mb-6">
                                    <label className="block text-base font-normal text-gray-700 mb-3">
                                        Excel File <span className="text-red-500">*</span> :
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="excel-file-input"
                                        />
                                        <label
                                            htmlFor="excel-file-input"
                                            className="bg-gray-200 hover:bg-gray-300 border border-gray-400 text-gray-700 px-4 py-1.5 rounded cursor-pointer transition-colors text-sm font-medium"
                                        >
                                            Choose File
                                        </label>
                                        <span className="text-sm text-gray-600">
                                            {selectedFile ? selectedFile.name : 'No file chosen'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-red-500 mt-3">
                                        ( Field Name: Name and Email )
                                    </p>
                                </div>

                                <button
                                    onClick={handleUpload}
                                    className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-medium px-12 py-2 rounded text-base transition-colors focus:outline-none"
                                >
                                    Upload
                                </button>
                            </div>

                            <div>
                                <h2 className="text-xl font-normal text-gray-600 mb-6">
                                    Total email <span className="text-gray-600 font-normal">Recipients ({totalRecipients})</span>
                                </h2>
                                
                                <div className="bg-gray-50 p-5 rounded">
                                    <h3 className="font-semibold text-gray-700 mb-3">Ensure your file is formatted properly</h3>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                        Please review the example file to be sure your file is formatted properly. You can also download the sample file.
                                    </p>
                                    <button
                                        onClick={handleDownloadSample}
                                        className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-medium px-6 py-2 rounded text-sm transition-colors"
                                    >
                                        Download sample
                                    </button>
                                </div>
                            </div>
                        </div>

                        {totalRecipients > 0 && showSendSection && (
                            <div className='mt-8 pt-6 border-t border-gray-300'>
                                <h2 className='text-lg font-normal text-gray-700 mb-4'>
                                    We will deliver this email to <strong className="font-semibold">({totalRecipients}) recipients</strong>
                                </h2>
                                <div className='space-y-2 text-sm text-red-500 mb-6'>
                                    <p>Your mail deliver in approx 5 minutes.</p>
                                    <p>If Same user(s) in one or more product then only 1 Mail at a time will be sent to that user(s).</p>
                                    <p>Same EmailID in one or more Product Then All Product will Display Unique Emailid Count.</p>
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <button
                                        onClick={handleSend}
                                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-2.5 rounded text-base transition-colors focus:outline-none"
                                    >
                                        Send
                                    </button>
                                    <button
                                        onClick={handlePreview}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2.5 rounded text-base transition-colors focus:outline-none"
                                    >
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-2.5 rounded text-base transition-colors focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}