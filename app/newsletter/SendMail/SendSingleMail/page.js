"use client";

import { useState, useEffect } from 'react';

export default function SendSingleMail() {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactList, setContactList] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const templateData = localStorage.getItem('selectedTemplateData');
    if (templateData) {
      try {
        const template = JSON.parse(templateData);
        setSelectedTemplate(template);
        console.log('Template loaded:', template);
      } catch (e) {
        console.error('Error parsing template data:', e);
      }
    }

    const savedContactList = localStorage.getItem('contactList');
    if (savedContactList) {
      try {
        const contacts = JSON.parse(savedContactList);
        setContactList(contacts);
        console.log('Contact list loaded:', contacts);
      } catch (e) {
        console.error('Error parsing contact list data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (contactList.length > 0) {
      localStorage.setItem('contactList', JSON.stringify(contactList));
      console.log('Contact list saved to localStorage');
    }
  }, [contactList]);

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

    if (!selectedTemplate || !selectedTemplate.content) {
      alert('No template content found. Please go back and select a template.');
      return;
    }

    alert(`Sending mail to ${selectedContacts.length} contact(s)\n\nSubject: ${selectedTemplate.subject || '(no subject)'}\nFrom: ${selectedTemplate.selectedEmail || '(no email selected)'}`);
  };

  const handlePreview = () => {
    if (!selectedTemplate || !selectedTemplate.content) {
      alert('No template selected. Please go back to Custom Message and select a template.');
      return;
    }
    setShowPreview(true);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All contacts will be cleared.')) {
      setContactList([]);
      localStorage.removeItem('contactList');
    }
  };

  return (
    <div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .preview-content {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #000;
        }
        .preview-content p,
        .preview-content h1,
        .preview-content h2,
        .preview-content h3,
        .preview-content h4,
        .preview-content h5,
        .preview-content h6,
        .preview-content span,
        .preview-content div,
        .preview-content li,
        .preview-content strong,
        .preview-content em,
        .preview-content u {
          color: black !important;
        }
        .preview-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 10px 0;
        }
        .preview-content table td,
        .preview-content table th {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>

      {showPreview && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50">
              <div>
                <h2 className="text-xl font-bold text-gray-800"> Email Preview</h2>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                title="Close"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="bg-white rounded-lg shadow-sm p-6 preview-content">
                {selectedTemplate && selectedTemplate.content ? (
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
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded focus:outline-none transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-screen bg-gray-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="min-h-full p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-white">
                <h1 className="text-2xl font-normal text-gray-700">
                  Send <strong>Mail</strong>
                </h1>
                <div className="flex items-center gap-4">
                  <div className="bg-amber-700 text-white px-4 py-1 rounded shadow-md">
                    <span className="font-medium">Remaining Emails:</span>
                    <span className="ml-3 font-bold text-lg">0</span>
                  </div>
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
                  className="bg-cyan-400 hover:bg-cyan-500 text-white font-medium py-2 px-3 rounded mb-8 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                >
                  Add Contact
                </button>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Contact List</h2>

                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
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
                        <p className="text-red-400 text-lg font-medium">No contacts added yet</p>
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
                              <span className="text-gray-700 text-sm font-medium">{contact.name}</span>
                            </div>
                            <div className="col-span-6 flex items-center">
                              <span className="text-gray-600 text-sm">{contact.email}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {contactList.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6 mb-6">
                    <button
                      onClick={handleSendMail}
                      className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-medium py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-colors"
                    >
                      Send Mail
                    </button>
                    <button
                      onClick={handlePreview}
                      className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
                    >
                      Preview
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}