"use client";

import { useState } from 'react';

export default function SendMailButtonPage() {
    const [totalRecipients] = useState(2);
    const [remainingEmails] = useState(500);
    const [showPreview, setShowPreview] = useState(false);

    const handleSend = () => {
        const confirmed = window.confirm(
            `Are you sure you want to send emails to ${totalRecipients} recipients?\n\nThis action cannot be undone.`
        );
        if (confirmed) {
            alert(`Emails are being sent to ${totalRecipients} recipients...`);
        }
    };

    const handlePreview = () => {
        setShowPreview(true);
    };

    const handleCancel = () => {
        const confirmed = window.confirm('Are you sure you want to cancel?');
        if (confirmed) {
            alert('Operation cancelled.');
        }
    };

    return (
        <div className="bg-[#dde1e4] min-h-screen">
            <style>{`
                .preview-content {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #000;
                }
            `}</style>

            {showPreview && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50">
                            <h2 className="text-xl font-bold text-gray-800">Email Preview</h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            <div className="bg-white rounded-lg shadow-sm p-6 preview-content">
                                <h2 style={{color: '#00bcd4'}}>Hello!</h2>
                                <p>Thank you for joining our service. We're excited to have you on board.</p>
                                <p>If you have any questions, feel free to reach out to our support team.</p>
                                <p style={{marginTop: '30px'}}>Best regards,<br/>The Team</p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-300 flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-2xl text-gray-600">
                        Send <strong className="font-semibold text-gray-800">Mail</strong>
                    </h1>
                    <div className="bg-[#a0522d] text-white px-6 py-2 rounded-md shadow-sm">
                        <span className="text-base mr-2">Remaining Emails:</span>
                        <span className="text-xl font-bold">{remainingEmails}</span>
                    </div>
                </div>

                <div className="px-6 py-8">
                    <h2 className="text-xl text-gray-700 mb-6">
                        Total email <span className="font-normal">recipients ({totalRecipients})</span>
                    </h2>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSend}
                            className="bg-[#00bcd4] hover:bg-[#00acc1] text-white font-medium px-12 py-3 rounded shadow-sm transition-colors text-base"
                        >
                            Send
                        </button>
                        <button
                            onClick={handlePreview}
                            className="bg-[#ff5252] hover:bg-[#ff4040] text-white font-medium px-12 py-3 rounded shadow-sm transition-colors text-base"
                        >
                            Preview
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-12 py-3 rounded border border-gray-300 shadow-sm transition-colors text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}