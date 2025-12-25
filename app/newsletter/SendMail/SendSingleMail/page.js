"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function SendSingleMail() {
  const router = useRouter();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactList, setContactList] = useState([]);

  const handleAddContact = () => {
    if (!contactName.trim() || !contactEmail.trim()) {
      alert('Please enter both contact name and email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    const newContact = {
      id: crypto.randomUUID(),
      name: contactName.trim(),
      email: contactEmail.trim(),
      selected: true
    };

    setContactList([...contactList, newContact]);
    setContactName('');
    setContactEmail('');
  };

  const handleToggleContact = (id) => {
    setContactList(contactList.map(contact => 
      contact.id === id ? { ...contact, selected: !contact.selected } : contact
    ));
  };

  const handleToggleAllContacts = (e) => {
    const isChecked = e.target.checked;
    setContactList(contactList.map(contact => ({ ...contact, selected: isChecked })));
  };

  const handleSendMail = () => {
    const selectedContacts = contactList.filter(c => c.selected);
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }
    alert(`Sending mail to ${selectedContacts.length} contact(s)`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white px-6 py-4 border-b border-gray-300 flex items-center justify-between sticky top-0 shadow-sm">
        <h1 className="text-2xl font-normal text-gray-700">
          Send <strong>Mail</strong>
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-amber-700 text-white px-6 py-2.5 rounded shadow-md">
            <span className="font-medium">Remaining Emails:</span>
            <span className="ml-3 font-bold text-lg">12363</span>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2.5 rounded font-medium transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <label className="block text-gray-600 font-medium mb-2 text-base">
              Contact Name
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Name"
              onKeyPress={(e) => e.key === 'Enter' && document.getElementById('contactEmail').focus()}
              className="w-full max-w-2xl border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:border-gray-400 transition-colors"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2 text-base">
              Contact Email
            </label>
            <input
              type="email"
              id="contactEmail"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Contact Email"
              onKeyPress={(e) => e.key === 'Enter' && handleAddContact()}
              className="w-full max-w-2xl border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:border-gray-400 transition-colors"
            />
          </div>

          <button
            onClick={handleAddContact}
            className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-medium py-1 px-9 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition-colors"
          >
            Add
          </button>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ContactList</h2>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              {/* Table Header */}
              <div className="bg-gray-100 grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-300">
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={contactList.length > 0 && contactList.every(c => c.selected)}
                    onChange={handleToggleAllContacts}
                    className="w-5 h-5 cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="col-span-5">
                  <span className="text-blue-600 font-bold text-base uppercase tracking-wide">NAME</span>
                </div>
                <div className="col-span-6">
                  <span className="text-blue-600 font-bold text-base uppercase tracking-wide">EMAIL</span>
                </div>
              </div>

              {/* Table Body */}
              {contactList.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-red-400 text-lg font-medium">No record Found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {contactList.map((contact) => (
                    <div key={contact.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 flex items-center">
                        <input
                          type="checkbox"
                          checked={contact.selected}
                          onChange={() => handleToggleContact(contact.id)}
                          className="w-5 h-5 cursor-pointer accent-cyan-500"
                        />
                      </div>
                      <div className="col-span-5 flex items-center">
                        <span className="text-gray-700 text-base">{contact.name}</span>
                      </div>
                      <div className="col-span-6 flex items-center">
                        <span className="text-gray-700 text-base">{contact.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Send Button */}
          {contactList.length > 0 && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSendMail}
                className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-medium py-3 px-10 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition-colors"
              >
                Send Mail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}