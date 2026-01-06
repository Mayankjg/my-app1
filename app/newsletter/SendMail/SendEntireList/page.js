"use client";

import { useState } from 'react';

export default function SendEntireList() {

    return (
        <div className='bg-[#e5e9ec] p-0 sm:p-5 h-screen overflow-y-auto flex justify-center items-start font-["Segoe_UI",Tahoma,Geneva,Verdana,sans-serif]'>
            <div className='bg-white w-full border max-w-[1400px]'>
                <div className='bg-white w-full px-4 sm:px-6 py-4'>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h1 className="text-xl sm:text-2xl font-normal text-gray-700">
                            Total Email <strong>Recipients</strong>
                        </h1>
                        <div className="bg-amber-700 text-white px-4 py-1 rounded shadow-md">
                            <span className="font-medium">Remaining Emails:</span>
                            <span className="ml-3 font-bold text-lg">0</span> </div>
                    </div>
                    <hr className="-mx-4 sm:-mx-6 border-t border-gray-300 mt-4 mb-0" />
                </div>

                <div className='w-full px-4 sm:px-6 py-6 pb-8'>
                    <div className='max-w-4xl'>
                        <div className='mb-8'>
                            <h2 className='text-base text-[24px] font-semibold text-gray-900 mb-4'>
                                We will deliver this email to recipients
                            </h2>

                            <div className='space-y-2 text-10 text-red-500'>
                                <p className='leading-relaxed'>
                                    Your mail will be delivered in approximately 5 minutes.<br />
                                    If the same user(s) exist in one or more products, only 1 mail at a time will be sent to that user(s).<br />
                                    Same EmailId exists in one or more products, all products will display unique EmailId count.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}