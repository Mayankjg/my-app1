"use client";

import { useState } from 'react';
import { FaEnvelope, FaUsers, FaFileImport, FaBan, FaUserSlash, FaList } from 'react-icons/fa';

// Import all newsletter pages
import ContactListPage from './ContactList/page';
import FromEmailListPage from './FromEmailList/page';
import ImportContactDetailPage from './ImportContactDetail/page';
import ImportContactsPage from './ImportContacts/page';
import InvalidEmailListPage from './InvalidEmailList/page';
import SendMailPage from './SendMail/page';
import TemplatesListPageMain from './TemplatesListPage/page';
import UnsubscribeUserListPage from './UnsubscribeUserList/page';

export default function NewsletterPage() {
  const [activeTab, setActiveTab] = useState('contact-list');

  const tabs = [
    { id: 'contact-list', label: 'Contact List', icon: FaUsers, component: ContactListPage },
    { id: 'from-email-list', label: 'From Email List', icon: FaEnvelope, component: FromEmailListPage },
    { id: 'import-contacts', label: 'Import Contacts', icon: FaFileImport, component: ImportContactsPage },
    { id: 'import-contact-detail', label: 'Import Contact Detail', icon: FaList, component: ImportContactDetailPage },
    { id: 'invalid-email-list', label: 'Invalid Email List', icon: FaBan, component: InvalidEmailListPage },
    { id: 'send-mail', label: 'Send Mail', icon: FaEnvelope, component: SendMailPage },
    { id: 'templates', label: 'Templates', icon: FaList, component: TemplatesListPageMain },
    { id: 'unsubscribe-users', label: 'Unsubscribe Users', icon: FaUserSlash, component: UnsubscribeUserListPage },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ContactListPage;

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <style>{`*{scrollbar-width:none!important;-ms-overflow-style:none!important}*::-webkit-scrollbar{display:none!important}`}</style>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Newsletter Management</h1>
          
          {/* Desktop Tabs - Scrollable */}
          <div className="hidden md:block overflow-x-auto">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-900 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Tabs - Dropdown */}
          <div className="md:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full">
        <SendMailPage />
      </div>
    </div>
  );
}