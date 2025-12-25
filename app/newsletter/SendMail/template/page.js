"use client";

import React, { useState } from 'react';

export default function Template() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="product-select" className="block text-sm font-semibold text-gray-700 mb-2">
          Select Product
        </label>
        <div className="relative max-w-md">
          <select
            id="product-select"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none hover:bg-gray-100 text-sm text-gray-700"
          >
            <option value="">Select Products</option>
            <option value="Galaxy S1">Galaxy S1</option>
            <option value="Motorola">Motorola</option>
            <option value="Iphone 15">Iphone 15</option>
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
        <div className="flex items-center gap-2 max-w-2xl w-136">
            <div className="relative flex-grow">
            <select
              id="email-select"
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none hover:bg-gray-100 text-sm text-gray-700"
            >
              <option value="">Select Email</option>
              <option value="mayank@gmail.com">mayank@gmail.com</option>
              <option value="magan@gmail.com">magan@gmail.com</option>
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
          className="shadow appearance-none border border-gray-300 rounded w-full max-w-md py-2 px-4 text-gray-700 leading-tight focus:outline-none hover:bg-gray-100 text-sm"
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
  );
}