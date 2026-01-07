"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SendGroupContact() {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState(null);
    const [totalRecipients, setTotalRecipients] = useState(0);
    const [remainingEmails] = useState(500);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setTotalRecipients(0);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select an Excel file first');
            return;
        }
        
        alert('File uploaded successfully! (Add your Excel parsing logic here)');
    };

    const handleDownloadSample = () => {
        alert('Download sample file functionality - Create an Excel template with columns: Name, Email');
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
        
        localStorage.setItem('mailSentSuccess', 'true');
        router.push('/newsletter/SendMail');
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

            <div className='bg-[#e5e9ec] p-0 sm:p-5 h-screen overflow-y-auto flex justify-center items-start font-["Segoe_UI",Tahoma,Geneva,Verdana,sans-serif]'>
                <div className='bg-white w-full border max-w-[1400px]'>
                    <div className='bg-white w-full px-4 sm:px-6 py-4'>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h1 className="text-2xl sm:text-3xl font-normal text-gray-600">
                                Send <strong className="font-semibold text-gray-700">Mail</strong>
                            </h1>
                            <div className="bg-[#a0522d] text-white px-5 py-2 rounded shadow-md flex items-center gap-3">
                                <span className="font-medium text-base">Remaining Emails:</span>
                                <span className="font-bold text-xl">{remainingEmails}</span>
                            </div>
                        </div>
                        <hr className="-mx-4 sm:-mx-6 border-t border-gray-300 mt-4 mb-0" />
                    </div>

                    <div className='w-full px-4 sm:px-6 py-8 pb-8'>
                        <div className='w-full'>
                            <div className='mb-8'>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div>
                                        <div className="mb-6">
                                            <label className="block text-base font-semibold text-gray-800 mb-3">
                                                Excel File <span className="text-red-500">*</span>
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
                                                    className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 px-4 py-2 rounded cursor-pointer transition-colors text-sm"
                                                >
                                                    Choose File
                                                </label>
                                                <span className="text-sm text-gray-600">
                                                    {selectedFile ? selectedFile.name : 'No file chosen'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-red-500 mt-2">
                                                ( Field Name: Name and Email )
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleUpload}
                                            className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium px-8 py-2.5 rounded text-base shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                            Total email <span className="text-cyan-600">Recipients ({totalRecipients})</span>
                                        </h2>
                                        
                                        <div className="space-y-4">
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-700 mb-2">Ensure your file is formatted properly</h3>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Please review the example file to be sure your file is formatted properly. You can also download the sample file.
                                                </p>
                                                <button
                                                    onClick={handleDownloadSample}
                                                    className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium px-6 py-2 rounded text-sm transition-colors"
                                                >
                                                    Download sample
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {totalRecipients > 0 && (
                                <div className='mb-8'>
                                    <h2 className='text-[20px] font-normal text-gray-800 mb-6'>
                                        We will deliver this email to <strong className="font-semibold">({totalRecipients}) recipients</strong>
                                    </h2>
                                    <div className='space-y-3 text-base text-red-500'>
                                        <p>
                                            Your mail deliver in approx 5 minutes.<br/>
                                            If Same user(s) in one or more product then only 1 Mail at a time will be sent to that user(s).<br/>
                                            Same EmailID in one or more Product Then All Product will Display Unique Emailid Count.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}