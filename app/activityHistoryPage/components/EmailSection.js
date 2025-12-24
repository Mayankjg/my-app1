"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown } from "lucide-react";

const defaultTemplate = { 
  id: "default-1", name: "Choose Template", content: "<p>Hello, this is a follow-up email.</p>", isCustom: false 
};

export default function EmailSection() {
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [emailLogs, setEmailLogs] = useState([]);
  const [templates, setTemplates] = useState([defaultTemplate]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [from, setFrom] = useState("");
  const [toEmail, setToEmail] = useState("mpl1@gmail.com");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [newEmailField, setNewEmailField] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateVisibility, setTemplateVisibility] = useState("admin");
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [sourceCode, setSourceCode] = useState("");

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    script.onload = () => {
      if (window.Quill && !quillRef.current) {
        quillRef.current = new window.Quill('#editor', {
          theme: 'snow', 
          placeholder: 'Write your message here...',
          modules: { 
            toolbar: [[{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }], 
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }], ['bold', 'italic', 'underline', 'strike'], 
              [{ 'color': [] }, { 'background': [] }], [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], 
              [{ 'direction': 'rtl' }, { 'align': [] }], ['blockquote', 'code-block'], 
              ['link', 'image', 'video', 'formula'], ['clean']] 
          }
        });
      }
    };
    document.body.appendChild(script);
    return () => { 
      if (document.head.contains(link)) document.head.removeChild(link); 
      if (document.body.contains(script)) document.body.removeChild(script); 
    };
  }, []);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
        setTemplates([defaultTemplate, ...savedTemplates.filter(t => t?.id && t?.name)]);
        const savedLogs = JSON.parse(localStorage.getItem("emailLogs") || "[]");
        setEmailLogs(savedLogs.filter(log => log?.id));
      } catch (error) { console.error("Error loading data:", error); }
    };
    loadData();
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

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
        printWindow.document.write(`<html><head><title>Print Email</title><style>body{font-family:Arial,sans-serif;padding:20px}</style></head><body><h2>From: ${from || '(no sender)'}</h2><h2>To: ${toEmail}</h2><h2>Subject: ${subject || '(no subject)'}</h2><hr/>${content}</body></html>`);
        printWindow.document.close();
        printWindow.print();
      }
    }
    setOpenMenu(null);
  };

  const handleEditAction = (action) => {
    const editor = quillRef.current;
    if (!editor) return;
    switch(action) {
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

    switch(action) {
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
      } else {
        if (quillRef.current) quillRef.current.root.innerHTML = sourceCode;
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

  const resetForm = () => { 
    setFrom(""); setSubject(""); setToEmail("mpl1@gmail.com"); setSelectedTemplate(""); 
    if (quillRef.current) quillRef.current.setContents([]); 
  };

  const openTemplateModal = () => { 
    if (!quillRef.current) return; 
    const html = quillRef.current.root.innerHTML.trim(); 
    if (!html || html === "<p><br></p>") {
      alert("Message is empty!");
      return;
    }
    setShowTemplateForm(true); 
  };

  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name!");
      return;
    }
    if (!quillRef.current) return;
    
    const newTemplate = { 
      id: crypto.randomUUID(), name: templateName.trim(), 
      content: quillRef.current.root.innerHTML.trim(), isCustom: true, 
      visibility: templateVisibility, createdAt: new Date().toISOString() 
    };
    
    try {
      const existing = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
      const updated = [newTemplate, ...existing.filter(t => t?.id)];
      localStorage.setItem("emailTemplates", JSON.stringify(updated));
      setTemplates([defaultTemplate, ...updated]); 
      setTemplateName(""); setTemplateVisibility("admin"); setShowTemplateForm(false);
      alert("Template saved successfully!");
    } catch (error) { 
      console.error("Error saving template:", error);
      alert("Error saving template."); 
    }
  };
  
  const deleteTemplate = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this template?")) {
      try {
        const existing = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
        const updated = existing.filter(t => t.id !== id);
        localStorage.setItem("emailTemplates", JSON.stringify(updated));
        setTemplates([defaultTemplate, ...updated]);
        if (selectedTemplate === id) setSelectedTemplate("");
      } catch (error) {
        console.error("Error deleting template:", error);
      }
    }
  };

  const applyTemplate = (id) => { 
    if (!id) {
      setSelectedTemplate("");
      return;
    }
    setSelectedTemplate(id); 
    const temp = templates.find(t => t.id === id); 
    if (temp && quillRef.current) {
      quillRef.current.root.innerHTML = temp.content;
    }
    setShowTemplateDropdown(false); 
  };

  const sendEmail = () => {
    if (!quillRef.current) return;
    const messageText = quillRef.current.getText().trim();
    if (!messageText) {
      alert("Please write a message!");
      return;
    }
    
    const newEmail = { 
      id: crypto.randomUUID(), from: from || "(no sender)", to: toEmail, 
      subject: subject || "(no subject)", message: quillRef.current.root.innerHTML, 
      status: "Sent", date: new Date().toLocaleString("en-GB", {
        day: "2-digit", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit"
      })
    };
    
    try {
      const updated = [newEmail, ...emailLogs];
      setEmailLogs(updated);
      localStorage.setItem("emailLogs", JSON.stringify(updated)); 
      resetForm(); 
      alert("Email Sent Successfully!");
    } catch (error) { 
      console.error("Error sending email:", error);
      alert("Error sending email."); 
    }
  };

  const deleteLog = (id) => { 
    if (window.confirm("Delete this email?")) { 
      try {
        const updated = emailLogs.filter(log => log.id !== id); 
        setEmailLogs(updated); 
        localStorage.setItem("emailLogs", JSON.stringify(updated));
      } catch (error) {
        console.error("Error deleting log:", error);
      }
    } 
  };

  return (
    <>
      <style>{`
        @keyframes slideDown{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:translateY(0)}}
        .animate-slideDown{animation:slideDown .3s ease-out}
        .ql-container{font-family:inherit}
        .ql-tooltip{left:auto!important;right:0!important;transform:none!important}
        .ql-editor table{border-collapse:collapse;width:100%;margin:10px 0}
        .ql-editor table td,.ql-editor table th{border:1px solid #ddd;padding:8px}
        .resizable-editor{resize:vertical;overflow:auto;min-height:150px;max-height:600px}
        *{scrollbar-width:none!important;-ms-overflow-style:none!important}
        *::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
        .hide-scrollbar::-webkit-scrollbar{display:none!important}
        .hide-scrollbar{-ms-overflow-style:none!important;scrollbar-width:none!important}
      `}</style>

      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-10">
          <div className="bg-white w-[90%] md:w-[700px] rounded-lg shadow-xl p-6 relative animate-slideDown">
            <button onClick={() => setShowAddForm(false)} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700">×</button>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Add and verify email address to send mail.</h3>
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-3">
              Please check your mail After Click on verify button.
            </div>
            <div className="mb-3">
              <label className="block mb-2 text-sm text-gray-700 font-medium">Display Name</label>
              <input type="text" className="w-full border border-gray-300 px-3 py-2 rounded" placeholder="Enter display name" />
            </div>
            <div className="mb-3">
              <label className="block mb-2 text-sm text-gray-700 font-medium">Email</label>
              <input type="email" value={newEmailField} onChange={(e) => setNewEmailField(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded" placeholder="Enter email address" />
            </div>
            <div className="flex gap-3">
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-medium" onClick={() => { 
                if (newEmailField.trim()) { alert("Verification sent to: " + newEmailField); setShowAddForm(false); setNewEmailField(""); } 
                else { alert("Please enter an email address"); }
              }}>Verify</button>
              <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded font-medium" onClick={() => { setShowAddForm(false); setNewEmailField(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showTemplateForm && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-10">
          <div className="bg-white w-[90%] md:w-[800px] rounded-lg shadow-xl p-6 relative animate-slideDown max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button onClick={() => { setShowTemplateForm(false); setTemplateName(""); setTemplateVisibility("admin"); }} className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700">×</button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Save as template</h3>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-700 font-medium">Template Name</label>
              <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded" placeholder="Enter template name" />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm text-gray-700 font-medium">Template Preview</label>
              <div className="border border-gray-300 rounded p-3 bg-gray-50 max-h-[200px] overflow-y-auto hide-scrollbar">
                <div dangerouslySetInnerHTML={{ __html: quillRef.current?.root.innerHTML || '' }} />
              </div>
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm text-gray-700 font-medium">Visibility</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="visibility" value="admin" checked={templateVisibility === "admin"} onChange={(e) => setTemplateVisibility(e.target.value)} className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-gray-700">Visible To Admin</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="visibility" value="all" checked={templateVisibility === "all"} onChange={(e) => setTemplateVisibility(e.target.value)} className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-gray-700">Visible To All</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded font-medium" onClick={saveTemplate}>Save Template</button>
              <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded font-medium" onClick={() => { setShowTemplateForm(false); setTemplateName(""); setTemplateVisibility("admin"); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="text-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
          <div className="flex-1 w-full">
            <label className="block mb-2 text-gray-700 font-medium">From</label>
            <input type="text" className="border border-gray-300 w-full p-2.5 rounded-sm hover:bg-gray-100" value={from} placeholder="Enter From" onChange={(e) => setFrom(e.target.value)} />
          </div>
          <button onClick={() => setShowAddForm(true)} className="bg-gray-500 text-white px-5 py-2.5 rounded hover:bg-gray-700 font-medium whitespace-nowrap">Add More</button>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">To</label>
          <textarea className="border border-gray-300 w-full p-2.5 rounded-sm hover:bg-gray-100 resize-y hide-scrollbar" value={toEmail} onChange={(e) => setToEmail(e.target.value)} rows={2} />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Subject</label>
          <input type="text" className="border border-gray-300 w-full p-2.5 rounded-sm hover:bg-gray-100" value={subject} placeholder="Enter subject" onChange={(e) => setSubject(e.target.value)} />
        </div>
        
        <div className="mb-4 relative">
          <label className="block mb-2 text-gray-700 font-medium">Reply with Template</label>
          <div className="relative">
            <button onClick={() => setShowTemplateDropdown(!showTemplateDropdown)} className="border border-gray-300 w-full p-2.5 rounded-sm bg-white hover:bg-gray-100 text-left flex justify-between items-center">
              <span className="text-gray-700">{selectedTemplate ? templates.find(t => t.id === selectedTemplate)?.name || "Choose Template" : "Choose Template"}</span>
              <span className="text-gray-400">▼</span>
            </button>
            {showTemplateDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-y-auto hide-scrollbar">
                <div onClick={() => applyTemplate("")} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-gray-700">Choose Template</div>
                {templates.map(t => t?.id && (
                  <div key={t.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center group">
                    <span onClick={() => applyTemplate(t.id)} className="flex-1 text-gray-700">{t.isCustom ? '📝 ' : '📄 '}{t.name}</span>
                    {t.isCustom && (
                      <button onClick={(e) => deleteTemplate(t.id, e)} className="ml-2 p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete template">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-gray-700 font-medium">Message</label>
          {showSourceCode ? (
            <div>
              <div className="mb-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">🔧 Source Code Mode - Edit HTML directly</div>
              <textarea value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm min-h-[400px] bg-gray-50 resize-y" placeholder="HTML source code..." />
            </div>
          ) : (
            <div ref={editorContainerRef} className="border-2 border-gray-300 rounded overflow-hidden resizable-editor">
              <div style={{background:'#f5f5f5',borderBottom:'1px solid #ccc',padding:'4px 8px'}}>
                <MenuButton label="File" items={[
                  {label:'New message',shortcut:'Ctrl+N',onClick:()=>handleFileAction('new')},
                  {label:'Print',shortcut:'Ctrl+P',onClick:()=>handleFileAction('print')}
                ]}/>
                <MenuButton label="Edit" items={[
                  {label:'Undo',shortcut:'Ctrl+Z',onClick:()=>handleEditAction('undo')},
                  {label:'Redo',shortcut:'Ctrl+Y',onClick:()=>handleEditAction('redo')},
                  'divider',
                  {label:'Cut',shortcut:'Ctrl+X',onClick:()=>handleEditAction('cut')},
                  {label:'Copy',shortcut:'Ctrl+C',onClick:()=>handleEditAction('copy')},
                  {label:'Paste',shortcut:'Ctrl+V',onClick:()=>handleEditAction('paste')},
                  'divider',
                  {label:'Select all',shortcut:'Ctrl+A',onClick:()=>handleEditAction('selectAll')}
                ]}/>
                <MenuButton label="Insert" items={[
                  {label:'Insert image',onClick:()=>handleInsertAction('image')},
                  {label:'Insert link',shortcut:'Ctrl+K',onClick:()=>handleInsertAction('link')},
                  {label:'Insert video',onClick:()=>handleInsertAction('video')},
                  {label:'Insert table',onClick:()=>handleInsertAction('table')},
                  {label:'Horizontal line',onClick:()=>handleInsertAction('hr')}
                ]}/>
                <MenuButton label="View" items={[
                  {label:'Fullscreen',shortcut:'F11',onClick:()=>handleViewAction('fullscreen')},
                  {label:'Source code',onClick:()=>handleViewAction('sourceCode')}
                ]}/>
                <MenuButton label="Format" items={[
                  {label:'Bold',shortcut:'Ctrl+B',onClick:()=>handleFormatAction('bold')},
                  {label:'Italic',shortcut:'Ctrl+I',onClick:()=>handleFormatAction('italic')},
                  {label:'Underline',shortcut:'Ctrl+U',onClick:()=>handleFormatAction('underline')},
                  {label:'Strikethrough',onClick:()=>handleFormatAction('strike')},
                  'divider',
                  {label:'Superscript',onClick:()=>handleFormatAction('script','super')},
                  {label:'Subscript',onClick:()=>handleFormatAction('script','sub')}
                ]}/>
                <MenuButton label="Table" items={[
                  {label:'Insert table',onClick:()=>handleInsertAction('table')}
                ]}/>
                <MenuButton label="Tools" items={[
                  {label:'Source code',onClick:()=>handleViewAction('sourceCode')},
                  {label:'Word count',onClick:()=>{
                    const text=quillRef.current?.getText()||'';
                    const words=text.trim().split(/\s+/).filter(w=>w).length;
                    const chars=text.length;
                    alert(`📊 Statistics:\n\nWords: ${words}\nCharacters: ${chars}`);
                  }}
                ]}/>
              </div>
              <div id="editor" style={{minHeight:'150px',backgroundColor:'white'}}></div>
            </div>
          )}
        </div>

        <button onClick={openTemplateModal} className="mt-3 px-4 py-2 bg-blue-100 border border-blue-400 text-blue-700 rounded hover:bg-blue-200">📄 Save as Template</button>
      </div>

      <div className="mt-10">
        <label className="block text-sm font-medium text-gray-500 mb-3">Attachment</label>
        <input type="file" className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-400 file:text-sm file:font-medium file:bg-gray-200 file:text-black hover:file:bg-gray-300 file:cursor-pointer" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx" />
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md px-4 py-2 mt-7">
        <p className="text-sm text-red-400">Note : (1) Maximum File Size 4 MB (2) Maximum All Files Size 12 MB (3) Only jpg, jpeg, png, bmp, gif, xls, xlsx, docx, doc, pdf Files Allow.</p>
      </div>

      <div className="flex gap-4 mt-4">
        <button onClick={sendEmail} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-medium">Send Email</button>
        <button onClick={resetForm} className="border border-gray-400 px-6 py-2 rounded hover:bg-gray-100 font-medium">Cancel</button>
      </div>

      <div className="border-t border-dashed border-gray-300 my-6"></div>

      <div className="overflow-x-auto hidden md:block hide-scrollbar">
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#e8eef2]">
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">TO</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">STATUS</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">DATE</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 uppercase text-xs tracking-wider border border-gray-300">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {emailLogs.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-red-500 font-medium border border-gray-300">No Records</td>
              </tr>
            ) : (
              emailLogs.map(log => (
                <tr key={log.id} className="bg-white hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-600 border border-gray-300">{log.to}</td>
                  <td className="px-4 py-4 border border-gray-300">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">{log.status}</span>
                  </td>
                  <td className="px-4 py-4 text-[#00bcd4] font-medium border border-gray-300">{log.date}</td>
                  <td className="px-4 py-4 border border-gray-300">
                    <button onClick={() => deleteLog(log.id)} className="text-gray-500 hover:text-gray-700 transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {emailLogs.length === 0 ? (
          <div className="py-8 text-center text-red-500 font-medium border border-gray-300 rounded">No Records</div>
        ) : (
          emailLogs.map(log => (
            <div key={log.id} className="border border-gray-300 bg-white rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 p-4 text-sm text-gray-600">
                <span className="font-medium text-gray-500">To: </span>{log.to}
              </div>
              <div className="border-b border-gray-200 p-4 text-sm">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs inline-block font-medium">{log.status}</span>
              </div>
              <div className="border-b border-gray-200 p-4 text-sm font-semibold text-[#00bcd4]">{log.date}</div>
              <div className="p-4 flex justify-start">
                <button className="text-gray-500 hover:text-gray-700" onClick={() => deleteLog(log.id)}>
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}