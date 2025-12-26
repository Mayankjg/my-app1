"use client";

import React, { useState } from 'react';
import Template from './template/page';
import CustomMessage from './CustomMessage/page';

export default function SendMail() {
  const [messageType, setMessageType] = useState('template');

  return (
    <>
      <style>{`
        *{scrollbar-width:none!important;-ms-overflow-style:none!important}
        *::-webkit-scrollbar{display:none!important}
      `}</style>

      <div className="bg-gray-200 h-screen overflow-y-scroll p-4 sm:p-6 md:p-8 flex flex-col items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="w-full max-w-6xl bg-white shadow-sm rounded-t-lg border-b border-gray-300 px-4 sm:px-6 md:px-8 py-3 flex flex-wrap justify-between items-center gap-4 mb-0">
          <h1 className="text-xl sm:text-2xl font-normal text-gray-700">Send Mail</h1>
          <div className="flex items-center gap-4">
            <div className="bg-amber-800 text-white px-4 sm:px-6 py-2.5 rounded-md flex items-center gap-3">
              <span className="text-sm">Remaining Emails:</span>
              <span className="bg-white text-amber-800 px-3 py-0.5 rounded font-semibold text-sm">0</span>
            </div>
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 sm:px-6 py-3 rounded-md text-sm font-medium">
              Topup Now
            </button>
          </div>
        </div>

        <div className="w-full max-w-6xl bg-white rounded-b-lg shadow-md px-4 sm:px-6 md:px-8 py-6 mb-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choose Message Type
            </label>
            <div className="flex items-center gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="messageType"
                  value="template"
                  checked={messageType === 'template'}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Template</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="messageType"
                  value="custom"
                  checked={messageType === 'custom'}
                  onChange={(e) => setMessageType(e.target.value)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">Custom Message</span>
              </label>
            </div>
          </div>

          {messageType === 'template' ? <Template /> : <CustomMessage />}
        </div>

        <div className="h-20"></div>
      </div>
    </>
  );
}