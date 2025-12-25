"use client";

import React, { useState } from 'react';

export default function SendMail() {
  const [messageType, setMessageType] = useState('template');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');

  return ( 
    <div className="bg-gray-200 min-h-screen overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col items-center hide-scrollbar">
      <div className="w-full max-w-6xl bg-white shadow-sm rounded-t-lg border-b border-gray-300 px-4 sm:px-6 md:px-8 py-3 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl sm:text-2xl font-normal text-gray-700">Send Mail</h1>
        <div className="flex items-center gap-4">
          <div className="bg-amber-800 text-white px-4 sm:px-6 py-2.5 rounded-md flex items-center gap-3">
            <span className="text-sm">Remaining Emails:</span>
            <span className="bg-white text-amber-800 px-3 py-1 rounded font-semibold text-sm">455</span>
          </div>
          <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 sm:px-6 py-2.5 rounded-md text-sm font-medium">
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

        <div className="mb-6">
          <label htmlFor="product-select" className="block text-sm font-semibold text-gray-700 mb-2">
            Select Product
          </label>
          <div className="relative max-w-130">
            <select
              id="product-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none hover:bg-gray-100 text-sm text-gray-700"
            >
              <option value="">Select Products</option>
              <option value="product1">Galaxy S1</option>
              <option value="product2">Motorola</option>
              <option value="product3">Iphone 15</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="email-select" className="block text-sm font-semibold text-gray-700 mb-2">
            From Email
          </label>
          <div className="flex items-center gap-2 max-w-154">
            <div className="relative flex-grow">
              <select
                id="email-select"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none hover:bg-gray-100 text-sm text-gray-700"
              >
                <option value="">Select Email</option>
                <option value="email1@example.com">mayank@gmail.com</option>
                <option value="email2@example.com">magan@gmail.com</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z"/>
                </svg>
              </div>
            </div>
            <button className="text-gray-600 bg-gray-300 hover:bg-gray-400 border border-gray-300 rounded w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300">
              <span className="text-xl font-light">+</span>
            </button>
            <button className="text-gray-600 bg-gray-300 hover:bg-gray-400 border border-gray-300 rounded w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300">
              <span className="text-xl font-light">−</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="subject-input" className="block text-sm font-semibold text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            id="subject-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="shadow appearance-none border border-gray-300 rounded w-full max-w-130 py-2 px-4 text-gray-700 leading-tight focus:outline-none hover:bg-gray-100 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <button
            onClick={() => alert('Single mail sent!')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded text-sm flex items-center space-x-2 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            <span>Send single Mail</span>
          </button>
          <button
            onClick={() => alert('Entire list contacted!')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded text-sm flex items-center space-x-2 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
          >
            <span>Send Entire List</span>
          </button>
          <button
            onClick={() => alert('Group contact notified!')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded text-sm flex items-center space-x-2 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
          >
            <span>Send Group Contact</span>
          </button>
        </div>
      </div>

      <div className="h-20"></div>
    </div>
  );
}