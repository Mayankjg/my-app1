"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SendEntireList() {
    const router = useRouter();
    const [totalRecipients] = useState(3);
    const [remainingEmails] = useState(0);

    const handleSend = () => {
        console.log('Sending mail...');
        alert('Mail sent successfully!');
    };

    const handlePreview = () => {
        console.log('Opening preview...');
        alert('Opening preview...');
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className='bg-[#e5e9ec] p-0 sm:p-5 h-screen overflow-y-auto flex justify-center items-start font-["Segoe_UI",Tahoma,Geneva,Verdana,sans-serif]'>
            <div className='bg-white w-full border max-w-[1400px]'>
                <div className='bg-white w-full px-4 sm:px-6 py-4'>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-2xl sm:text-3xl font-normal text-gray-600">
                            Total email <strong className="font-semibold text-gray-700">recipients ({totalRecipients})</strong>
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
                            <h2 className='text-2xl font-normal text-gray-800 mb-6'>
                                We will deliver this email to <strong className="font-semibold">({totalRecipients}) recipients</strong>
                            </h2>

                            <div className='space-y-3 text-base text-[#ef4444]'>
                                <p className='leading-relaxed'>
                                    Your mail deliver in approx 5 minutes.
                                </p>
                                <p className='leading-relaxed'>
                                    If Same user(s) in one or more product then only 1 Mail at a time will be sent to that user(s).
                                    Same EmailID in one or more Product Then All Product will Display Unique Emailid Count.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <button
                                onClick={handleSend}
                                className="px-8 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium text-base rounded shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                Send
                            </button>
                            <button
                                onClick={handlePreview}
                                className="px-8 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium text-base rounded shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Preview
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium text-base rounded border border-gray-300 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
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