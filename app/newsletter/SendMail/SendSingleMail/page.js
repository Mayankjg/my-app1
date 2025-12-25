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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between">
          <h1 className="text-2xl font-normal text-gray-700">
            Send <strong>Mail</strong>
          </h1>
          <div className="bg-amber-700 text-white px-4 py-1 rounded shadow-md">
            <span className="font-medium">Remaining Emails:</span>
            <span className="ml-3 font-bold text-lg">0</span>
          </div>
        </div>

        <div className="p-5">
          <div className="mb-3">
            <label className="block text-gray-600 font-medium mb-2 text-base">
              Contact Name
            </label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Contact Name"
              onKeyPress={(e) => e.key === 'Enter' && document.getElementById('contactEmail').focus()}
              className="w-full max-w-xl border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none hover:bg-gray-100 hover:border-gray-400 transition-colors"
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
              className="w-full max-w-xl border border-gray-300 rounded px-3 py-2 text-gray-700 focus:outline-none hover:bg-gray-100 hover:border-gray-400 transition-colors"
            />
          </div>

          <button
            onClick={handleAddContact}
            className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-1 px-9 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
          >
            Add
          </button>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">ContactList</h2>
            
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <div className="bg-gray-100 grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-300">
                <div className="col-span-1 flex items-center">
                  <input
                    type="checkbox"
                    checked={contactList.length > 0 && contactList.every(c => c.selected)}
                    onChange={handleToggleAllContacts}
                    className="w-4 h-4 cursor-pointer accent-cyan-500"
                  />
                </div>
                <div className="col-span-5">
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-wide">NAME</span>
                </div>
                <div className="col-span-6">
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-wide">EMAIL</span>
                </div>
              </div>

              {contactList.length === 0 ? (
                <div className="text-center py-5">
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
                          className="w-4 h-4 cursor-pointer accent-cyan-500"
                        />
                      </div>
                      <div className="col-span-5 flex items-center">
                        <span className="text-gray-700 text-sm">{contact.name}</span>
                      </div>
                      <div className="col-span-6 flex items-center">
                        <span className="text-gray-700 text-sm">{contact.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {contactList.length > 0 && (
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSendMail}
                className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-medium py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
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