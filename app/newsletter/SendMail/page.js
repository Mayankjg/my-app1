"use client";

import React, { useState } from 'react';
import Template from './template/page';
import CustomMessage from './CustomMessage/page';

export default function SendMail() {
  const [messageType, setMessageType] = useState('template');

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="min-h-full p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
                <h1 className="text-2xl font-normal text-gray-700">
                  Send <strong>Mail</strong>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="bg-amber-700 text-white px-4 py-1 rounded shadow-md">
                    <span className="font-medium">Remaining Emails:</span>
                    <span className="ml-3 font-bold text-lg">0</span>
                  </div>
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                    Topup Now
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-8">
                    <label className="text-sm font-semibold text-gray-700">
                      Choose Message Type
                    </label>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}