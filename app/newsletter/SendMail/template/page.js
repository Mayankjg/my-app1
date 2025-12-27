"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Template() {
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const editorElementRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [quillLoaded, setQuillLoaded] = useState(false);

  const templates = [
    {
      id: 'default-01', name: 'Default 01', colors: ['#e8d4c4', '#d4b89c', '#8b4513'],
      content: {
        title: 'Premium Business Solution', subtitle: 'Elevate Your Business to New Heights',
        description: 'Transform your business with our comprehensive solutions designed for modern enterprises.'
      }
    },

    {
      id: 'default-02', name: 'Default 02', colors: ['#f5c4c4', '#e89c9c', '#c24040'],
      content: {
        title: 'Creative Design Studio', subtitle: 'Where Ideas Come to Life',
        description: 'We are a team of passionate designers creating stunning digital experiences.'
      }
    },

    {
      id: 'default-03', name: 'Default 03', colors: ['#d4c4b4', '#b4a494', '#6b5444'],
      content: {
        title: 'Organic Food Marketplace', subtitle: 'Fresh, Healthy, Sustainable',
        description: 'Discover the finest organic products sourced directly from local farms.'
      }
    }
  ];

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    script.onload = () => setQuillLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!quillLoaded || !selectedTemplate || showSourceCode) return;
    const html = `<div style="background:linear-gradient(135deg,${selectedTemplate.colors[0]} 0%,${selectedTemplate.colors[1]} 50%,${selectedTemplate.colors[2]} 100%);padding:40px;border-radius:12px;margin-bottom:20px"><h1 style="color:#1f2937;font-size:28px;font-weight:bold;margin-bottom:10px">${selectedTemplate.content.title}</h1><h2 style="color:#374151;font-size:20px;font-weight:600;margin-bottom:15px">${selectedTemplate.content.subtitle}</h2><p style="color:#4b5563;font-size:16px;line-height:1.6">${selectedTemplate.content.description}</p></div>`;
    if (quillRef.current) {
      quillRef.current.setText('');
      setTimeout(() => {
        quillRef.current.clipboard.dangerouslyPasteHTML(0, html);
        quillRef.current.setSelection(quillRef.current.getLength());
      }, 50);
      return;
    }

    const timer = setTimeout(() => {
      const el = editorElementRef.current;
      if (!el || !window.Quill) return;
      try {
        const quill = new window.Quill(el, {
          theme: 'snow',
          placeholder: 'Edit your template content here...',
          modules: {
            toolbar: [[{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }], [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], [{ 'direction': 'rtl' }, { 'align': [] }],
            ['blockquote', 'code-block'], ['link', 'image', 'video', 'formula'], ['clean']]
          }
        });

        quillRef.current = quill;
        setTimeout(() => {
          quill.clipboard.dangerouslyPasteHTML(0, html);
          quill.setSelection(quill.getLength());
        }, 100);
      }

      catch (e) {
        console.error('Quill init error:', e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [quillLoaded, selectedTemplate, showSourceCode]);

  useEffect(() => {
    if (!showSourceCode && quillRef.current && sourceCode) quillRef.current.root.innerHTML = sourceCode;
  }, [showSourceCode, sourceCode]);

  const handleFileAction = (action) => {
    if (action === 'new' && window.confirm('Create new document? Unsaved changes will be lost.')) {
      if (quillRef.current) quillRef.current.setContents([]);
      setSelectedTemplate(null);
      quillRef.current = null;
    }

    else if (action === 'print') {
      const content = quillRef.current?.root.innerHTML || '';
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<html><head><title>Print</title><style>body{font-family:Arial;padding:20px}</style></head><body><h2>Subject: ${subject || '(no subject)'}</h2><hr/>${content}</body></html>`);
        w.document.close();
        w.print();
      }
    }
    setOpenMenu(null);
  };

  const handleEditAction = (action) => {
    const ed = quillRef.current;
    if (!ed) return;
    if (action === 'undo') ed.history.undo();
    else if (action === 'redo') ed.history.redo();
    else if (action === 'cut') document.execCommand('cut');
    else if (action === 'copy') document.execCommand('copy');
    else if (action === 'selectAll') ed.setSelection(0, ed.getLength());
    setOpenMenu(null);
  };

  const handleInsertAction = (action) => {
    const ed = quillRef.current;
    if (!ed)
      return;

    const rng = ed.getSelection();
    const idx = rng ? rng.index : ed.getLength();
    if (action === 'image') {
      const url = window.prompt('Enter image URL:');
      if (url) ed.insertEmbed(idx, 'image', url);
    } else if (action === 'link') {
      const url = window.prompt('Enter URL:');
      if (url) {
        if (rng && rng.length > 0) ed.formatText(rng.index, rng.length, 'link', url);
        else {
          const txt = window.prompt('Enter link text:');
          if (txt) ed.insertText(idx, txt, 'link', url);
        }
      }
    } else if (action === 'video') {
      const url = window.prompt('Enter video URL:');
      if (url) ed.insertEmbed(idx, 'video', url);
    } else if (action === 'table') {
      const r = window.prompt('Rows:', '3');
      const c = window.prompt('Columns:', '3');
      if (r && c) {
        let tbl = '<table border="1" style="border-collapse:collapse;width:100%">';
        for (let i = 0; i < parseInt(r); i++) {
          tbl += '<tr>';
          for (let j = 0; j < parseInt(c); j++) tbl += '<td style="border:1px solid #ddd;padding:8px">&nbsp;</td>';
          tbl += '</tr>';
        }
        tbl += '</table>';
        ed.clipboard.dangerouslyPasteHTML(idx, tbl);
      }
    } else if (action === 'hr') ed.insertText(idx, '\n---\n');
    setOpenMenu(null);
  };

  const handleViewAction = (action) => {
    if (action === 'sourceCode') {
      if (!showSourceCode) setSourceCode(quillRef.current?.root.innerHTML || '');
      setShowSourceCode(!showSourceCode);
    } else if (action === 'fullscreen') {
      if (!document.fullscreenElement) editorContainerRef.current?.requestFullscreen().catch(e => console.log(e));
      else document.exitFullscreen();
    }
    setOpenMenu(null);
  };

  const handleFormatAction = (fmt, val) => {
    const ed = quillRef.current;
    if (!ed) return;
    const rng = ed.getSelection();
    if (rng && rng.length > 0) {
      if (val) ed.formatText(rng.index, rng.length, fmt, val);
      else {
        const cur = ed.getFormat(rng);
        ed.formatText(rng.index, rng.length, fmt, !cur[fmt]);
      }
    }
    setOpenMenu(null);
  };

  const MenuButton = ({ label, items }) => (
    <div className="relative inline-block">
      <button onClick={() => setOpenMenu(openMenu === label.toLowerCase() ? null : label.toLowerCase())}
        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors">
        {label} <ChevronDown className="inline" size={12} />
      </button>
      {openMenu === label.toLowerCase() && items && (
        <div className="absolute top-full left-0 mt-0 bg-white border border-gray-300 shadow-lg z-50 min-w-[180px]">
          {items.map((item, i) => item === 'divider' ?
            <div key={i} className="border-t border-gray-200 my-1"></div> :
            <button key={i} onClick={item.onClick} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
              <span>{item.label}</span>
              {item.shortcut && <span className="text-xs text-gray-400 ml-4">{item.shortcut}</span>}
            </button>
          )}
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
      <style>{`.ql-container{font-family:inherit}.ql-editor,.ql-editor p,.ql-editor h1,.ql-editor h2,.ql-editor h3,.ql-editor h4,.ql-editor h5,.ql-editor h6,.ql-editor span,.ql-editor div,.ql-editor li,.ql-editor ol,.ql-editor ul,.ql-editor strong,.ql-editor em,.ql-editor u{color:black!important}.ql-tooltip{left:auto!important;right:0!important;transform:none!important}.ql-editor table{border-collapse:collapse;width:100%;margin:10px 0}.ql-editor table td,.ql-editor table th{border:1px solid #ddd;padding:8px}.resizable-editor{resize:vertical;overflow:auto;min-height:200px;max-height:600px}.ql-toolbar{display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden!important;white-space:nowrap!important}.ql-toolbar .ql-formats{display:inline-flex!important;margin-right:8px!important}.ql-toolbar::-webkit-scrollbar{height:6px}.ql-toolbar::-webkit-scrollbar-track{background:#f1f1f1}.ql-toolbar::-webkit-scrollbar-thumb{background:#888;border-radius:3px}.ql-toolbar::-webkit-scrollbar-thumb:hover{background:#555}`}</style>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Product</label>
          <div className="relative max-w-md">
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
              <option value="">Select Products</option>
              <option value="Galaxy S1">Galaxy S1</option>
              <option value="Motorola">Motorola</option>
              <option value="Iphone 15">Iphone 15</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">From Email</label>
          <div className="flex items-center gap-2 max-w-2xl">
            <div className="relative flex-grow">
              <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700">
                <option value="">Select Email</option>
                <option value="mayank@gmail.com">mayank@gmail.com</option>
                <option value="magan@gmail.com">magan@gmail.com</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.646 7.354a.75.75 0 011.06 1.06l-6.177 6.177a.75.75 0 01-1.06 0L3.354 8.414a.75.75 0 011.06-1.06l4.878 4.879z" />
                </svg>
              </div>
            </div>
            <button onClick={() => alert('Add new email')}
              className="text-gray-600 bg-gray-300 hover:bg-gray-400 border border-gray-300 rounded w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
              <span className="text-xl font-light">+</span>
            </button>
            <button onClick={() => alert('Remove email')}
              className="text-gray-600 bg-gray-300 hover:bg-gray-400 border border-gray-300 rounded w-10 h-10 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
              <span className="text-xl font-light">−</span>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject"
            className="shadow appearance-none border border-gray-300 rounded w-full max-w-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 text-sm" />
        </div>
        {selectedProduct && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Template</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {templates.map((t) => (
                <div key={t.id} onClick={() => setSelectedTemplate(t)}
                  className={`cursor-pointer transition-all rounded-lg ${selectedTemplate?.id === t.id ? 'ring-4 ring-blue-500 shadow-xl' : 'ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-400 hover:shadow-lg'}`}>
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="relative h-64 p-6 flex flex-col justify-between"
                      style={{ background: `linear-gradient(135deg,${t.colors[0]} 0%,${t.colors[1]} 50%,${t.colors[2]} 100%)` }}>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{t.content.title}</h3>
                        <p className="text-sm text-gray-700 font-medium mb-3">{t.content.subtitle}</p>
                        <p className="text-xs text-gray-600 line-clamp-4">{t.content.description}</p>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <p className="text-white text-sm font-semibold text-center">{t.name}</p>
                      </div>
                    </div>
                    <div className="flex justify-center py-3 bg-white">
                      <div className={`w-3 h-3 rounded-full transition-colors ${selectedTemplate?.id === t.id ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedTemplate && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message Editor <span className="ml-2 text-blue-600 text-xs">(Editing: {selectedTemplate.name})</span>
                </label>
                {showSourceCode ? (
                  <div>
                    <div className="mb-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">🔧 Source Code Mode</div>
                    <textarea value={sourceCode} onChange={(e) => setSourceCode(e.target.value)}
                      className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm min-h-[400px] bg-gray-50 resize-y" placeholder="HTML source code..." />
                  </div>
                ) : (
                  <div ref={editorContainerRef} className="border-2 border-gray-300 rounded-lg overflow-hidden resizable-editor">
                    <div style={{ background: '#f5f5f5', borderBottom: '1px solid #ccc', padding: '4px 8px' }}>
                      <MenuButton label="File" items={[
                        { label: 'New document', shortcut: 'Ctrl+N', onClick: () => handleFileAction('new') },
                        { label: 'Print', shortcut: 'Ctrl+P', onClick: () => handleFileAction('print') }]} />

                      <MenuButton label="Edit" items={[
                        { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => handleEditAction('undo') },
                        { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => handleEditAction('redo') }, 'divider',
                        { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => handleEditAction('cut') },
                        { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => handleEditAction('copy') }, 'divider',
                        { label: 'Select all', shortcut: 'Ctrl+A', onClick: () => handleEditAction('selectAll') }]} />

                      <MenuButton label="Insert" items={[
                        { label: 'Insert image', onClick: () => handleInsertAction('image') },
                        { label: 'Insert link', shortcut: 'Ctrl+K', onClick: () => handleInsertAction('link') },
                        { label: 'Insert video', onClick: () => handleInsertAction('video') },
                        { label: 'Insert table', onClick: () => handleInsertAction('table') },
                        { label: 'Horizontal line', onClick: () => handleInsertAction('hr') }]} />

                      <MenuButton label="View" items={[
                        { label: 'Fullscreen', shortcut: 'F11', onClick: () => handleViewAction('fullscreen') },
                        { label: 'Source code', onClick: () => handleViewAction('sourceCode') }]} />

                      <MenuButton label="Format" items={[
                        { label: 'Bold', shortcut: 'Ctrl+B', onClick: () => handleFormatAction('bold') },
                        { label: 'Italic', shortcut: 'Ctrl+I', onClick: () => handleFormatAction('italic') },
                        { label: 'Underline', shortcut: 'Ctrl+U', onClick: () => handleFormatAction('underline') },
                        { label: 'Strikethrough', onClick: () => handleFormatAction('strike') }]} />

                      <MenuButton label="Table" items={[{ label: 'Insert table', onClick: () => handleInsertAction('table') }]} />

                      <MenuButton label="Tools" items={[
                        { label: 'Source code', onClick: () => handleViewAction('sourceCode') },
                        {
                          label: 'Word count', onClick: () => {
                            const txt = quillRef.current?.getText() || '';
                            const w = txt.trim().split(/\s+/).filter(x => x).length;
                            alert(`📊 Statistics:\n\nWords: ${w}\nCharacters: ${txt.length}`);
                          }
                        }]} />

                    </div>
                    <div ref={editorElementRef} style={{ minHeight: '200px', backgroundColor: 'white' }}></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-4 pt-1">
          <button onClick={() => validateSend() && alert('Single mail sent!')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-lg text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors">
            Send Single Mail
          </button>
          <button onClick={() => validateSend() && alert('Entire list contacted!')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 transition-colors">
            Send Entire List
          </button>
          <button onClick={() => validateSend() && alert('Group contact notified!')}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-6 rounded-lg text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-colors">
            Send Group Contact
          </button>
        </div>
      </div>
    </>
  );
}