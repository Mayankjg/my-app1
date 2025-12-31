"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown} from 'lucide-react';

export default function Template() {
  const iframeRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  const templates = [
    {
      id: 'default-01', name: 'Default 01', colors: ['#e8d4c4', '#d4b89c', '#8b4513'],
      content: {
        title: 'Tenacious Sales', subtitle: 'Your Lead Manager',
        description: 'Tenacious is one of the best online digital marketing agency for businesses and startups across the world for Website, Apps, SEO,SMM and SEM.',
        body: 'Tenacious Group was founded in 2011, and so far we have served more than 175 clients across 15 countries all around the globe. We have delivered more than 253+ successful projects till date.',
        callToAction: 'Get Started Today', footer: 'Thank you for choosing our services. We look forward to working with you.'
      }
    },
    {
      id: 'default-02', name: 'Default 02', colors: ['#f5c4c4', '#e89c9c', '#c24040'],
      content: {
        title: 'Food-Chow', subtitle: 'Online Ordering System',
        description: 'It includes point-of-sale software to manage billing, orders, and payments in-house.',
        body: 'FoodChow is a technology platform and software suite for online food ordering, restaurant point-of-sale (POS), and restaurant business management — primarily aimed at helping restaurants, cafés, cloud kitchens, and hospitality businesses go digital and accept orders without relying on third-party aggregators.',
        callToAction: 'View Our Portfolio', footer: 'Let\'s create something amazing together. Contact us today!'
      }
    },
    {
      id: 'default-03', name: 'Default 03', colors: ['#d4c4b4', '#b4a494', '#6b5444'],
      content: {
        title: 'Point of Sale.', subtitle: 'POS as the cash counter + brain of the business.',
        description: 'It\'s the system where a sale happens—when a customer pays and the business records the transaction.',
        body: 'POS is the system where customers pay and businesses manage sales.',
        callToAction: 'Shop Now', footer: 'Enjoy fresh, organic goodness delivered to your door.'
      }
    },
  ];

  useEffect(() => {
    if (!selectedTemplate) return;
    
    const html = generateHtmlContent(selectedTemplate);
    setHtmlContent(html);
    
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [selectedTemplate]);

  const generateHtmlContent = (template) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f1f1f1ff; }
    * { box-sizing: border-box; }
  </style>
</head>
<body>
  <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;background:#ebeaeaff;box-shadow:0 2px 8px rgba(0,0,0,0.1)">
    <div style="background:linear-gradient(135deg,${template.colors[0]} 0%,${template.colors[1]} 50%,${template.colors[2]} 100%);padding:40px;border-radius:12px 12px 0 0;text-align:center">
      <h1 contenteditable="true" style="color:#1f2937;font-size:32px;font-weight:bold;margin:0 0 10px 0;outline:none">${template.content.title}</h1>
      <h2 contenteditable="true" style="color:#374151;font-size:20px;font-weight:600;margin:0 0 15px 0;outline:none">${template.content.subtitle}</h2>
      <p contenteditable="true" style="color:#4b5563;font-size:16px;line-height:1.6;margin:0;outline:none">${template.content.description}</p>
    </div>
    <div style="background:#fff;padding:40px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
      <h3 contenteditable="true" style="color:#1f2937;font-size:22px;font-weight:bold;margin:0 0 20px 0;outline:none">Welcome!</h3>
      <p contenteditable="true" style="color:#4b5563;font-size:16px;line-height:1.8;margin:0 0 20px 0;outline:none">${template.content.body}</p>
      <p contenteditable="true" style="color:#4b5563;font-size:16px;line-height:1.8;margin:0 0 30px 0;outline:none">We're excited to help you get started and look forward to supporting you every step of the way.</p>
      <div style="text-align:center;margin:30px 0">
        <a href="#" contenteditable="true" style="display:inline-block;background:linear-gradient(135deg,${template.colors[1]},${template.colors[2]});color:#fff;text-decoration:none;padding:15px 40px;border-radius:8px;font-size:16px;font-weight:bold;box-shadow:0 4px 6px rgba(0,0,0,0.1);outline:none">${template.content.callToAction}</a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:30px 40px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none">
      <p contenteditable="true" style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 15px 0;text-align:center;outline:none">${template.content.footer}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
      <p contenteditable="true" style="color:#9ca3af;font-size:12px;text-align:center;margin:0;outline:none">© 2024 Your Company. All rights reserved.<br>123 Business St, Suite 100, City, State 12345<br>
        <a href="#" style="color:#3b82f6;text-decoration:none">Unsubscribe</a> | <a href="#" style="color:#3b82f6;text-decoration:none">View in Browser</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  };

  const handleFileAction = (action) => {
    if (action === 'new' && window.confirm('Create new document? Unsaved changes will be lost.')) {
      setSelectedTemplate(null);
      setHtmlContent('');
    } else if (action === 'print') {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.print();
      }
    } 
    setOpenMenu(null);
  };

  const handleEditAction = (action) => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    
    if (action === 'undo') doc.execCommand('undo');
    else if (action === 'redo') doc.execCommand('redo');
    else if (action === 'cut') doc.execCommand('cut');
    else if (action === 'copy') doc.execCommand('copy');
    else if (action === 'selectAll') doc.execCommand('selectAll');
    
    setOpenMenu(null);
  };

  const handleInsertAction = (action) => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    
    if (action === 'image') {
      const url = window.prompt('Enter image URL:');
      if (url) doc.execCommand('insertImage', false, url);
    }
    else if (action === 'link') {
      const url = window.prompt('Enter URL:');
      if (url) doc.execCommand('createLink', false, url);
    }
    else if (action === 'table') {
      const r = window.prompt('Rows:', '3');
      const c = window.prompt('Columns:', '3');
      if (r && c) {
        let tbl = '<table border="1" style="border-collapse:collapse;width:100%;margin:10px 0">';
        for (let i = 0; i < parseInt(r); i++) {
          tbl += '<tr>';
          for (let j = 0; j < parseInt(c); j++)
            tbl += '<td style="border:1px solid #ddd;padding:8px" contenteditable="true">Cell</td>';
          tbl += '</tr>';
        }
        tbl += '</table>';
        doc.execCommand('insertHTML', false, tbl);
      }
    }
    else if (action === 'hr') {
      doc.execCommand('insertHorizontalRule');
    }
    
    setOpenMenu(null);
  };

  const handleViewAction = (action) => {
    if (action === 'sourceCode') {
      if (!showSourceCode && iframeRef.current) {
        const doc = iframeRef.current.contentDocument;
        setHtmlContent(doc.documentElement.outerHTML);
      }
      setShowSourceCode(!showSourceCode);
    }
    else if (action === 'fullscreen') {
      const container = document.querySelector('.editor-container');
      if (!document.fullscreenElement) {
        container?.requestFullscreen().catch(e => console.log(e));
      } else {
        document.exitFullscreen();
      }
    }
    setOpenMenu(null);
  };

  const handleFormatAction = (fmt) => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    
    if (fmt === 'bold') doc.execCommand('bold');
    else if (fmt === 'italic') doc.execCommand('italic');
    else if (fmt === 'underline') doc.execCommand('underline');
    else if (fmt === 'strike') doc.execCommand('strikeThrough');
    
    setOpenMenu(null);
  };

  const applySourceCodeChanges = () => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
    setShowSourceCode(false);
  };

  const MenuButton = ({ label, items }) => (
    <div className="relative inline-block">
      <button onClick={() => setOpenMenu(openMenu === label.toLowerCase() ? null : label.toLowerCase())} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors">
        {label} <ChevronDown className="inline" size={12} />
      </button>
      {openMenu === label.toLowerCase() && items && (
        <div className="absolute top-full left-0 mt-0 bg-white border border-gray-300 shadow-lg z-50 min-w-[180px]">
          {items.map((item, i) => item === 'divider' ? <div key={i} className="border-t border-gray-200 my-1"></div> :
            <button key={i} onClick={item.onClick} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
              <span>{item.label}</span>{item.shortcut && <span className="text-xs text-gray-400 ml-4">{item.shortcut}</span>}
            </button>)}
        </div>
      )}
    </div>
  );

  const validateSend = () => {
    if (!selectedProduct) return alert('Please select a product');
    if (!selectedEmail) return alert('Please select an email');
    if (!subject) return alert('Please enter a subject');
    if (!selectedTemplate) return alert('Please select a template');
    return true;
  };

  return (
    <>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap sm:min-w-[120px]">Select Product</label>
          <div className="relative w-full sm:max-w-md sm:flex-1">
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-1 hover:bg-gray-100 text-sm text-gray-700">
              <option value="">Select Products</option>
              {/* <option value="Galaxy S1">Galaxy S1</option>
              <option value="Motorola">Motorola</option>
              <option value="Iphone 15">Iphone 15</option> */}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z" /></svg>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap sm:min-w-[120px]">From Email</label>
          <div className="flex items-center gap-2 flex-1 w-full">
            <div className="relative w-full sm:max-w-md">
              <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)} className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-1 hover:bg-gray-100 text-sm text-gray-700">
                <option value="">Select Email</option>
                {/* <option value="mayank@gmail.com">mayank@gmail.com</option>
                <option value="magan@gmail.com">magan@gmail.com</option> */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z" /></svg>
              </div>
            </div>
            <button onClick={() => alert('Add new email')} className="text-gray-600 bg-gray-300 hover:bg-gray-400 border border-gray-300 rounded w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors flex-shrink-0"><span className="text-xl font-light">+</span></button>
            <button onClick={() => alert('Remove email')} className="text-gray-600 bg-gray-300 hover:bg-gray-400 border border-gray-300 rounded w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors flex-shrink-0"><span className="text-xl font-light">−</span></button>
          </div>
        </div>

        <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <label className="text-sm font-semibold text-gray-700 whitespace-nowrap sm:min-w-[120px]">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject"
            className="shadow appearance-none border border-gray-300 rounded w-full sm:max-w-md sm:flex-1 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-1 hover:bg-gray-100 hover:bg-gray-50 text-sm" />
        </div>

        {selectedProduct && (
          <div className="mb-5">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap sm:min-w-[120px] sm:pt-2">Select Template</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
                {templates.map((t) => (
                  <div key={t.id} className="flex flex-col items-center w-full">
                    <div 
                      onClick={() => setSelectedTemplate(t)} 
                      className={`cursor-pointer transition-all rounded-lg overflow-hidden w-full ${
                        selectedTemplate?.id === t.id 
                          ? 'ring-2 ring-gray-500 shadow-xl scale-105' 
                          : 'ring-2 ring-gray-200 hover:shadow-lg hover:scale-105'
                      }`}
                      style={{ 
                        maxWidth: '250px',
                        aspectRatio: '5/3.6',
                        border: '8px solid #f1f0f0ff',
                        borderRadius: '12px',
                        margin: '0 auto'
                      }}
                    >
                      <div className="bg-white h-full w-full">
                        <div className="relative h-full p-3 sm:p-4 flex flex-col justify-between" 
                          style={{ background: `linear-gradient(135deg,${t.colors[0]} 0%,${t.colors[1]} 50%,${t.colors[2]} 100%)` }}>
                          <div>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1 sm:mb-2 line-clamp-2">{t.content.title}</h3>
                            <p className="text-[10px] sm:text-xs text-gray-700 line-clamp-3">{t.content.subtitle}</p>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 sm:p-3">
                            <p className="text-white text-[10px] sm:text-xs font-bold text-center">{t.name}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <label className="mt-3 sm:mt-5 flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedTemplate?.id === t.id}
                        onChange={() => setSelectedTemplate(t)}
                        className="w-4 h-4 bg-gray-100 border-gray-300 rounded-full focus:ring-2 cursor-pointer appearance-none border-2"
                        style={{
                          backgroundColor: selectedTemplate?.id === t.id ? '#3be0f6ff' : '#f3f4f6',
                          borderColor: selectedTemplate?.id === t.id ? '#3be0f6ff' : '#d1d5db',
                          boxShadow: selectedTemplate?.id === t.id ? '0 0 0 2px white, 0 0 0 3px #3be0f6ff' : 'none'
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTemplate && (
          <div className="mb-5 mt-8">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap sm:min-w-[120px] sm:pt-2">
                Message Editor
              </label>
              <div className="w-full editor-container text-black">
                {showSourceCode ? (
                  <div>
                    <div className="mb-2 text-sm text-orange-600 bg-orange-50 p-2 rounded flex items-center justify-between">
                      <span>🔧 Source Code Mode</span>
                      <button onClick={applySourceCodeChanges} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-xs">
                        Apply Changes
                      </button>
                    </div>
                    <textarea value={htmlContent} onChange={(e) => setHtmlContent(e.target.value)} 
                      className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm min-h-[400px] bg-gray-50 resize-y" 
                      placeholder="HTML source code..." />
                  </div>
                ) : (
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <div style={{ background: '#ffffffff', borderBottom: '1px solid #ffffffff', padding: '4px 8px' }}>
                      <MenuButton label="File" items={[{ label: 'New document', shortcut: 'Ctrl+N', onClick: () => handleFileAction('new') }, { label: 'Print', shortcut: 'Ctrl+P', onClick: () => handleFileAction('print') }]} />
                      <MenuButton label="Edit" items={[{ label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => handleEditAction('undo') }, { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => handleEditAction('redo') }, 'divider',
                      { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => handleEditAction('cut') }, { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => handleEditAction('copy') }, 'divider', { label: 'Select all', shortcut: 'Ctrl+A', onClick: () => handleEditAction('selectAll') }]} />
                      <MenuButton label="Insert" items={[{ label: 'Insert image', onClick: () => handleInsertAction('image') }, { label: 'Insert link', shortcut: 'Ctrl+K', onClick: () => handleInsertAction('link') },
                      { label: 'Insert table', onClick: () => handleInsertAction('table') }, { label: 'Horizontal line', onClick: () => handleInsertAction('hr') }]} />
                      <MenuButton label="View" items={[{ label: 'Fullscreen', shortcut: 'F11', onClick: () => handleViewAction('fullscreen') }, { label: 'Source code', onClick: () => handleViewAction('sourceCode') }]} />
                      <MenuButton label="Format" items={[{ label: 'Bold', shortcut: 'Ctrl+B', onClick: () => handleFormatAction('bold') }, { label: 'Italic', shortcut: 'Ctrl+I', onClick: () => handleFormatAction('italic') }, { label: 'Underline', shortcut: 'Ctrl+U', onClick: () => handleFormatAction('underline') },
                      { label: 'Strikethrough', onClick: () => handleFormatAction('strike') }]} />
                      <MenuButton label="Table" items={[{ label: 'Insert table', onClick: () => handleInsertAction('table') }]} />
                      <MenuButton label="Tools" items={[{ label: 'Source code', onClick: () => handleViewAction('sourceCode') }]} />
                    </div>
                    <iframe 
                      ref={iframeRef}
                      className="w-full border-0"
                      style={{ minHeight: '400px', background: '#fff' }}
                      title="Email Template Editor"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="sm:min-w-[120px]"></div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:flex-1">
            <button onClick={() => validateSend() && alert('Single mail sent!')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors w-full sm:w-auto flex-shrink-0">Send Single Mail</button>
            <button onClick={() => validateSend() && alert('Entire list contacted!')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors w-full sm:w-auto flex-shrink-0">Send Entire List</button>
            <button onClick={() => validateSend() && alert('Group contact notified!')}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-colors w-full sm:w-auto flex-shrink-0">Send Group Contact</button>
          </div>
        </div>
      </div>
    </>
  );
}