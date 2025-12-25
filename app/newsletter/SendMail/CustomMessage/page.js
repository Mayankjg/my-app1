"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function CustomMessage() {
  const router = useRouter();
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const editorElementRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subject, setSubject] = useState('');
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [quillLoaded, setQuillLoaded] = useState(false);
  const [templates, setTemplates] = useState([]);

  // Load saved templates from localStorage
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
    setTemplates(savedTemplates);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    script.onload = () => {
      setQuillLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!quillLoaded || showSourceCode || quillRef.current) return;

    const initQuill = () => {
      const editorElement = editorElementRef.current;
      if (!editorElement || !window.Quill) return;

      try {
        quillRef.current = new window.Quill(editorElement, {
          theme: 'snow',
          placeholder: 'Write your message here...',
          modules: {
            toolbar: [
              [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }, { 'align': [] }],
              ['blockquote', 'code-block'],
              ['link', 'image', 'video', 'formula'],
              ['clean']
            ]
          }
        });
      } catch (error) {
        console.error('Error initializing Quill:', error);
      }
    };

    const timer = setTimeout(initQuill, 100);
    return () => clearTimeout(timer);
  }, [quillLoaded, showSourceCode]);

  const handleMenuClick = (menu) => setOpenMenu(openMenu === menu ? null : menu);

  const handleFileAction = (action) => {
    if (action === 'new') {
      if (window.confirm('Create new message? Unsaved changes will be lost.')) {
        if (quillRef.current) quillRef.current.setContents([]);
      }
    } else if (action === 'print') {
      const content = quillRef.current?.root.innerHTML || '';
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`<html><head><title>Print Email</title><style>body{font-family:Arial,sans-serif;padding:20px}</style></head><body><h2>Subject: ${subject || '(no subject)'}</h2><hr/>${content}</body></html>`);
        printWindow.document.close();
        printWindow.print();
      }
    }
    setOpenMenu(null);
  };

  const handleEditAction = (action) => {
    const editor = quillRef.current;
    if (!editor) return;
    switch (action) {
      case 'undo': editor.history.undo(); break;
      case 'redo': editor.history.redo(); break;
      case 'cut': document.execCommand('cut'); break;
      case 'copy': document.execCommand('copy'); break;
      case 'selectAll': editor.setSelection(0, editor.getLength()); break;
    }
    setOpenMenu(null);
  };

  const handleInsertAction = (action) => {
    const editor = quillRef.current;
    if (!editor) return;
    const range = editor.getSelection();
    const index = range ? range.index : editor.getLength();

    switch (action) {
      case 'image':
        const imageUrl = window.prompt('Enter image URL:');
        if (imageUrl) editor.insertEmbed(index, 'image', imageUrl);
        break;
      case 'link':
        const url = window.prompt('Enter URL:');
        if (url) {
          if (range && range.length > 0) {
            editor.formatText(range.index, range.length, 'link', url);
          } else {
            const text = window.prompt('Enter link text:');
            if (text) editor.insertText(index, text, 'link', url);
          }
        }
        break;
      case 'video':
        const videoUrl = window.prompt('Enter video URL (YouTube, Vimeo):');
        if (videoUrl) editor.insertEmbed(index, 'video', videoUrl);
        break;
      case 'table':
        const rows = window.prompt('Enter number of rows:', '3');
        const cols = window.prompt('Enter number of columns:', '3');
        if (rows && cols) {
          let tableHTML = '<table border="1" style="border-collapse:collapse;width:100%">';
          for (let i = 0; i < parseInt(rows); i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
              tableHTML += '<td style="border:1px solid #ddd;padding:8px">&nbsp;</td>';
            }
            tableHTML += '</tr>';
          }
          tableHTML += '</table>';
          editor.clipboard.dangerouslyPasteHTML(index, tableHTML);
        }
        break;
      case 'hr':
        editor.insertText(index, '\n---\n');
        break;
    }
    setOpenMenu(null);
  };

  const handleViewAction = (action) => {
    if (action === 'sourceCode') {
      if (!showSourceCode) {
        setSourceCode(quillRef.current?.root.innerHTML || '');
        quillRef.current = null;
      } else {
        setQuillLoaded(true);
      }
      setShowSourceCode(!showSourceCode);
    } else if (action === 'fullscreen') {
      if (!document.fullscreenElement) {
        editorContainerRef.current?.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
      } else {
        document.exitFullscreen();
      }
    }
    setOpenMenu(null);
  };

  useEffect(() => {
    if (!showSourceCode && quillRef.current && sourceCode) {
      quillRef.current.root.innerHTML = sourceCode;
    }
  }, [showSourceCode, sourceCode]);

  const handleFormatAction = (format, value) => {
    const editor = quillRef.current;
    if (!editor) return;
    const range = editor.getSelection();
    if (range && range.length > 0) {
      if (value) {
        editor.formatText(range.index, range.length, format, value);
      } else {
        const currentFormat = editor.getFormat(range);
        editor.formatText(range.index, range.length, format, !currentFormat[format]);
      }
    }
    setOpenMenu(null);
  };

  const MenuButton = ({ label, items }) => (
    <div className="relative inline-block">
      <button onClick={() => handleMenuClick(label.toLowerCase())} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors">
        {label} <ChevronDown className="inline" size={12} />
      </button>
      {openMenu === label.toLowerCase() && items && (
        <div className="absolute top-full left-0 mt-0 bg-white border border-gray-300 shadow-lg z-50 min-w-[180px]">
          {items.map((item, idx) => (
            item === 'divider' ? (
              <div key={idx} className="border-t border-gray-200 my-1"></div>
            ) : (
              <button key={idx} onClick={item.onClick} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
                <span>{item.label}</span>
                {item.shortcut && <span className="text-xs text-gray-400 ml-4">{item.shortcut}</span>}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );

  const applyTemplate = (templateId) => {
    if (!templateId) {
      setSelectedTemplate("");
      // Clear the editor when "Choose Template" is selected
      if (quillRef.current) {
        quillRef.current.setContents([]);
      }
      setShowTemplateDropdown(false);
      return;
    }
    
    setSelectedTemplate(templateId);
    const temp = templates.find(t => t.id === templateId);
    
    if (temp && quillRef.current) {
      quillRef.current.root.innerHTML = temp.content;
    }
    setShowTemplateDropdown(false);
  };

  return (
    <>
      <style>{`
        .ql-container{font-family:inherit}
        .ql-editor{color:black!important}
        .ql-editor p,.ql-editor h1,.ql-editor h2,.ql-editor h3,.ql-editor h4,.ql-editor h5,.ql-editor h6,.ql-editor span,.ql-editor div,.ql-editor li,.ql-editor ol,.ql-editor ul{color:black!important}
        .ql-editor strong,.ql-editor em,.ql-editor u{color:black!important}
        .ql-tooltip{left:auto!important;right:0!important;transform:none!important}
        .ql-editor table{border-collapse:collapse;width:100%;margin:10px 0}
        .ql-editor table td,.ql-editor table th{border:1px solid #ddd;padding:8px}
        .resizable-editor{resize:vertical;overflow:auto;min-height:150px;max-height:600px}
      `}</style>

      <div>
        <div className="mb-6">
          <label htmlFor="product-select-custom" className="block text-sm font-semibold text-gray-700 mb-2">
            Select Product
          </label>
          <div className="relative max-w-md">
            <select
              id="product-select-custom"
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
          <label htmlFor="email-select-custom" className="block text-sm font-semibold text-gray-700 mb-2">
            From Email
          </label>
          <div className="flex items-center gap-2 max-w-2xl w-136">
            <div className="relative flex-grow">
              <select
                id="email-select-custom"
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
          <label htmlFor="template-select" className="block text-sm font-semibold text-gray-700 mb-2">
            Reply with
          </label>
          <div className="relative max-w-md">
            <button
              onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none hover:bg-gray-100 text-sm text-gray-700 text-left"
            >
              {selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name || "Choose Template" : "Choose Template"}
            </button>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z"/>
              </svg>
            </div>
            {showTemplateDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
                <div onClick={() => applyTemplate("")} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">Choose Template</div>
                {templates.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => applyTemplate(t.id)} 
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{t.name}</div>
                  </div>
                ))}
              </div>
            )}
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

        <div className="mb-6">
          {showSourceCode ? (
            <div>
              <div className="mb-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">🔧 Source Code Mode - Edit HTML directly</div>
              <textarea
                value={sourceCode}
                onChange={(e) => setSourceCode(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm min-h-[400px] bg-gray-50 resize-y"
                placeholder="HTML source code..."
              />
            </div>
          ) : (
            <div ref={editorContainerRef} className="border-2 border-gray-300 rounded overflow-hidden resizable-editor">
              <div style={{ background: '#f5f5f5', borderBottom: '1px solid #ccc', padding: '4px 8px' }}>
                <MenuButton label="File" items={[
                  { label: 'New message', shortcut: 'Ctrl+N', onClick: () => handleFileAction('new') },
                  { label: 'Print', shortcut: 'Ctrl+P', onClick: () => handleFileAction('print') }
                ]} />
                <MenuButton label="Edit" items={[
                  { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => handleEditAction('undo') },
                  { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => handleEditAction('redo') },
                  'divider',
                  { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => handleEditAction('cut') },
                  { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => handleEditAction('copy') },
                  'divider',
                  { label: 'Select all', shortcut: 'Ctrl+A', onClick: () => handleEditAction('selectAll') }
                ]} />
                <MenuButton label="Insert" items={[
                  { label: 'Insert image', onClick: () => handleInsertAction('image') },
                  { label: 'Insert link', shortcut: 'Ctrl+K', onClick: () => handleInsertAction('link') },
                  { label: 'Insert video', onClick: () => handleInsertAction('video') },
                  { label: 'Insert table', onClick: () => handleInsertAction('table') },
                  { label: 'Horizontal line', onClick: () => handleInsertAction('hr') }
                ]} />
                <MenuButton label="View" items={[
                  { label: 'Fullscreen', shortcut: 'F11', onClick: () => handleViewAction('fullscreen') },
                  { label: 'Source code', onClick: () => handleViewAction('sourceCode') }
                ]} />
                <MenuButton label="Format" items={[
                  { label: 'Bold', shortcut: 'Ctrl+B', onClick: () => handleFormatAction('bold') },
                  { label: 'Italic', shortcut: 'Ctrl+I', onClick: () => handleFormatAction('italic') },
                  { label: 'Underline', shortcut: 'Ctrl+U', onClick: () => handleFormatAction('underline') },
                  { label: 'Strikethrough', onClick: () => handleFormatAction('strike') }
                ]} />
                <MenuButton label="Table" items={[
                  { label: 'Insert table', onClick: () => handleInsertAction('table') }
                ]} />
                <MenuButton label="Tools" items={[
                  { label: 'Source code', onClick: () => handleViewAction('sourceCode') },
                  {
                    label: 'Word count', onClick: () => {
                      const text = quillRef.current?.getText() || '';
                      const words = text.trim().split(/\s+/).filter(w => w).length;
                      const chars = text.length;
                      alert(`📊 Statistics:\n\nWords: ${words}\nCharacters: ${chars}`);
                    }
                  }
                ]} />
              </div>
              <div ref={editorElementRef} style={{ minHeight: '150px', backgroundColor: 'white' }}></div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-6 pt-1">
          <button
            onClick={() => router.push('/newsletter/SendMail/SendSingleMail')}
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
    </>
  );
}