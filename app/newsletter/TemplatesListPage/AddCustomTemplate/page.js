"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function AddCustomTemplatePage() {
  const [templateName, setTemplateName] = useState("");
  const [visibility, setVisibility] = useState("admin");
  const [savedTemplates, setSavedTemplates] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [sourceCode, setSourceCode] = useState("");
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const router = useRouter();

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
          placeholder: 'Write your template content here...',
          modules: {
            toolbar: [
              [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'script': 'sub'}, { 'script': 'super' }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }, { 'align': [] }],
              ['blockquote', 'code-block'],
              ['link', 'image', 'video', 'formula'],
              ['clean']
            ]
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
    const existingTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
    setSavedTemplates(existingTemplates);
  }, []);

  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // File Menu Actions
  const handleFileAction = (action) => {
    if (action === 'new') {
      if (confirm('Create new document? Unsaved changes will be lost.')) {
        setTemplateName('');
        if (quillRef.current) {
          quillRef.current.setContents([]);
        }
      }
    } else if (action === 'print') {
      const content = quillRef.current?.root.innerHTML || '';
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Template</title>
            <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
          </head>
          <body>
            <h1>${templateName || 'Untitled Template'}</h1>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    setOpenMenu(null);
  };

  // Edit Menu Actions
  const handleEditAction = (action) => {
    const editor = quillRef.current;
    if (!editor) return;

    switch(action) {
      case 'undo':
        editor.history.undo();
        break;
      case 'redo':
        editor.history.redo();
        break;
      case 'cut':
        document.execCommand('cut');
        break;
      case 'copy':
        document.execCommand('copy');
        break;
      case 'paste':
        break;
      case 'selectAll':
        editor.setSelection(0, editor.getLength());
        break;
    }
    setOpenMenu(null);
  };

  // Insert Menu Actions
  const handleInsertAction = (action) => {
    const editor = quillRef.current;
    if (!editor) return;

    const range = editor.getSelection();
    const index = range ? range.index : editor.getLength();

    switch(action) {
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          editor.insertEmbed(index, 'image', imageUrl);
        }
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          if (range && range.length > 0) {
            editor.formatText(range.index, range.length, 'link', url);
          } else {
            const text = prompt('Enter link text:');
            if (text) {
              editor.insertText(index, text, 'link', url);
            }
          }
        }
        break;
      case 'video':
        const videoUrl = prompt('Enter video URL (YouTube, Vimeo):');
        if (videoUrl) {
          editor.insertEmbed(index, 'video', videoUrl);
        }
        break;
      case 'table':
        const rows = prompt('Enter number of rows:', '3');
        const cols = prompt('Enter number of columns:', '3');
        if (rows && cols) {
          let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%;">';
          for (let i = 0; i < parseInt(rows); i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
              tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">&nbsp;</td>';
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

  // View Menu Actions
  const handleViewAction = (action) => {
    if (action === 'sourceCode') {
      if (!showSourceCode) {
        setSourceCode(quillRef.current?.root.innerHTML || '');
      } else {
        if (quillRef.current) {
          quillRef.current.root.innerHTML = sourceCode;
        }
      }
      setShowSourceCode(!showSourceCode);
    } else if (action === 'fullscreen') {
      if (!document.fullscreenElement) {
        editorContainerRef.current?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
    setOpenMenu(null);
  };

  // Format Menu Actions
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

  const handleSaveCustomTemplate = () => {
    if (!templateName.trim()) {
      alert('Please enter template name');
      return;
    }

    const editorContent = quillRef.current ? quillRef.current.root.innerHTML : '';
    const text = quillRef.current ? quillRef.current.getText().trim() : '';

    if (!text) {
      alert('Please create template content');
      return;
    }

    const template = {
      id: crypto.randomUUID(),
      name: templateName.trim(),
      content: editorContent,
      visibility: visibility,
      createdAt: new Date().toISOString(),
      isCustom: true
    };

    const existingTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
    const updatedTemplates = [template, ...existingTemplates];
    localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));
    setSavedTemplates(updatedTemplates);

    alert('Template saved successfully !');

    setTemplateName('');
    setVisibility('admin');
    if (quillRef.current) {
      quillRef.current.setContents([]);
    }
  };

  // Menu Button Component
  const MenuButton = ({ label, items }) => (
    <div className="relative inline-block">
      <button
        onClick={() => handleMenuClick(label.toLowerCase())}
        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
      >
        {label} <ChevronDown className="inline" size={12} />
      </button>
      {openMenu === label.toLowerCase() && items && (
        <div className="absolute top-full left-0 mt-0 bg-white border border-gray-300 shadow-lg z-50 min-w-[180px]">
          {items.map((item, idx) => (
            item === 'divider' ? (
              <div key={idx} className="border-t border-gray-200 my-1"></div>
            ) : (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-gray-400 ml-4">{item.shortcut}</span>
                )}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-[#e5e7eb] p-0 sm:p-5 h-screen overflow-y-auto flex justify-center items-start font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <style>{`
        .ql-container {
          font-family: inherit;
        }
        .ql-editor {
          color: black !important;
        }
        .ql-editor p, .ql-editor h1, .ql-editor h2, .ql-editor h3, 
        .ql-editor h4, .ql-editor h5, .ql-editor h6, .ql-editor span,
        .ql-editor div, .ql-editor li, .ql-editor ol, .ql-editor ul {
          color: black !important;
        }
        .ql-editor strong, .ql-editor em, .ql-editor u {
          color: black !important;
        }
        .ql-tooltip {
          left: auto !important;
          right: 0 !important;
          transform: none !important;
        }
        .ql-editor table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 10px 0; 
        }
        .ql-editor table td, .ql-editor table th { 
          border: 1px solid #ddd; 
          padding: 8px; 
        }
        
        /* Resizable Editor */
        .resizable-editor {
          resize: vertical;
          overflow: auto;
          min-height: 150px;
          max-height: 600px;
        }
      `}</style>
      
      <div ref={editorContainerRef} className="bg-white w-full border border-[black] max-w-[1400px]">
        <div className="bg-white w-full px-4 sm:px-6 py-4 border-b border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-normal text-gray-700">
              Add Custom <strong>Template</strong>
            </h1>
            <button
              onClick={() => router.push("/newsletter/TemplatesListPage")}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 px-6 sm:px-8 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
            >
              ← Back to Templates
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="w-full border border-gray-300 text-black rounded-md px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 hover:bg-gray-100 focus:border-transparent"
            />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Message <strong className="text-red-500">(Note: Please Enter Plain Text Only For Better Result)</strong>
            </label>
            
            {showSourceCode ? (
              <div>
                <div className="mb-2 text-sm text-orange-600 bg-orange-50 p-2 rounded">
                  🔧 Source Code Mode - Edit HTML directly
                </div>
                <textarea
                  value={sourceCode}
                  onChange={(e) => setSourceCode(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg p-4 font-mono text-sm min-h-[400px] bg-gray-50 resize-y"
                  placeholder="HTML source code..."
                />
              </div>
            ) : (
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden resizable-editor">
                <div style={{ background: '#f5f5f5', borderBottom: '1px solid #ccc', padding: '4px 8px' }}>
                  <MenuButton 
                    label="File"
                    items={[
                      { label: 'New document', shortcut: 'Ctrl+N', onClick: () => handleFileAction('new') },
                      { label: 'Print', shortcut: 'Ctrl+P', onClick: () => handleFileAction('print') }
                    ]}
                  />
                  <MenuButton 
                    label="Edit"
                    items={[
                      { label: 'Undo', shortcut: 'Ctrl+Z', onClick: () => handleEditAction('undo') },
                      { label: 'Redo', shortcut: 'Ctrl+Y', onClick: () => handleEditAction('redo') },
                      'divider',
                      { label: 'Cut', shortcut: 'Ctrl+X', onClick: () => handleEditAction('cut') },
                      { label: 'Copy', shortcut: 'Ctrl+C', onClick: () => handleEditAction('copy') },
                      { label: 'Paste', shortcut: 'Ctrl+V', onClick: () => handleEditAction('paste') },
                      'divider',
                      { label: 'Select all', shortcut: 'Ctrl+A', onClick: () => handleEditAction('selectAll') }
                    ]}
                  />
                  <MenuButton 
                    label="Insert"
                    items={[
                      { label: 'Insert image', onClick: () => handleInsertAction('image') },
                      { label: 'Insert link', shortcut: 'Ctrl+K', onClick: () => handleInsertAction('link') },
                      { label: 'Insert video', onClick: () => handleInsertAction('video') },
                      { label: 'Insert table', onClick: () => handleInsertAction('table') },
                      { label: 'Horizontal line', onClick: () => handleInsertAction('hr') }
                    ]}
                  />
                  <MenuButton 
                    label="View"
                    items={[
                      { label: 'Fullscreen', shortcut: 'F11', onClick: () => handleViewAction('fullscreen') },
                      { label: 'Source code', onClick: () => handleViewAction('sourceCode') }
                    ]}
                  />
                  <MenuButton 
                    label="Format"
                    items={[
                      { label: 'Bold', shortcut: 'Ctrl+B', onClick: () => handleFormatAction('bold') },
                      { label: 'Italic', shortcut: 'Ctrl+I', onClick: () => handleFormatAction('italic') },
                      { label: 'Underline', shortcut: 'Ctrl+U', onClick: () => handleFormatAction('underline') },
                      { label: 'Strikethrough', onClick: () => handleFormatAction('strike') },
                      'divider',
                      { label: 'Superscript', onClick: () => handleFormatAction('script', 'super') },
                      { label: 'Subscript', onClick: () => handleFormatAction('script', 'sub') }
                    ]}
                  />
                  <MenuButton 
                    label="Table"
                    items={[
                      { label: 'Insert table', onClick: () => handleInsertAction('table') }
                    ]}
                  />
                  <MenuButton 
                    label="Tools"
                    items={[
                      { label: 'Source code', onClick: () => handleViewAction('sourceCode') },
                      { label: 'Word count', onClick: () => {
                        const text = quillRef.current?.getText() || '';
                        const words = text.trim().split(/\s+/).filter(w => w).length;
                        const chars = text.length;
                        alert(`📊 Statistics:\n\nWords: ${words}\nCharacters: ${chars}`);
                      }}
                    ]}
                  />
                </div>

                <div id="editor" style={{ minHeight: '150px', backgroundColor: 'white' }}></div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="visibility"
                value="admin"
                checked={visibility === "admin"}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-4 h-4 cursor-pointer accent-blue-600"
              />
              <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900">
                Visible To Admin
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="visibility"
                value="all"
                checked={visibility === "all"}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-4 h-4 cursor-pointer accent-blue-600"
              />
              <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900">
                Visible To All
              </span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleSaveCustomTemplate}
              className="w-full sm:w-auto bg-cyan-500 text-white px-6 sm:px-8 py-2.5 rounded-md text-sm sm:text-base hover:bg-cyan-600 active:bg-cyan-700 font-medium transition-colors shadow-sm"
            >
              Save Template
            </button>
          
            <button
              onClick={() => router.push("/newsletter/TemplatesListPage")}
              className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 px-6 sm:px-8 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors shadow-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function AddCustomTemplatePage() {
//   const [templateName, setTemplateName] = useState("");
//   const [visibility, setVisibility] = useState("admin");
//   const [savedTemplates, setSavedTemplates] = useState("");
//   const quillRef = useRef(null);
//   const router = useRouter();

//   useEffect(() => {
//     const link = document.createElement('link');
//     link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
//     link.rel = 'stylesheet';
//     document.head.appendChild(link);

//     const script = document.createElement('script');
//     script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
//     script.onload = () => {
//       if (window.Quill && !quillRef.current) {
//         quillRef.current = new window.Quill('#editor', {
//           theme: 'snow',
//           placeholder: 'Write your template content here...',
//           modules: {
//             toolbar: [
//               [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
//               [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//               ['bold', 'italic', 'underline', 'strike'],
//               [{ 'color': [] }, { 'background': [] }],
//               [{ 'script': 'sub'}, { 'script': 'super' }],
//               [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
//               [{ 'direction': 'rtl' }, { 'align': [] }],
//               ['blockquote', 'code-block'],
//               ['link', 'image', 'video', 'formula'],
//               ['clean']
//             ]
//           }
//         });
//       }
//     };
//     document.body.appendChild(script);

//     return () => {
//       if (document.head.contains(link)) document.head.removeChild(link);
//       if (document.body.contains(script)) document.body.removeChild(script);
//     };
//   }, []); 

//   useEffect(() => {
//     const existingTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
//     setSavedTemplates(existingTemplates);
//   }, []);

//   const handleSaveCustomTemplate = () => {
//     if (!templateName.trim()) {
//       alert('Please enter template name');
//       return;
//     }

//     const editorContent = quillRef.current ? quillRef.current.root.innerHTML : '';
//     const text = quillRef.current ? quillRef.current.getText().trim() : '';

//     if (!text) {
//       alert('Please create template content');
//       return;
//     }

//     const template = {
//       id: crypto.randomUUID(),
//       name: templateName.trim(),
//       content: editorContent,
//       visibility: visibility,
//       createdAt: new Date().toISOString(),
//       isCustom: true
//     };

//     const existingTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");

//     const updatedTemplates = [template, ...existingTemplates];

//     localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));

//     setSavedTemplates(updatedTemplates);

//     alert('Template saved successfully !');

//     setTemplateName('');
//     setVisibility('admin');
//     if (quillRef.current) {
//       quillRef.current.setContents([]);
//     }
//   };

//   return (
//     <div className="bg-[#e5e7eb] p-0 sm:p-5 h-screen overflow-y-auto flex justify-center items-start font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
//        <style>{`
//         .ql-container {
//           font-family: inherit;
//         }
//         .ql-editor {
//           color: black !important;
//         }
//         .ql-editor p, .ql-editor h1, .ql-editor h2, .ql-editor h3, 
//         .ql-editor h4, .ql-editor h5, .ql-editor h6, .ql-editor span,
//         .ql-editor div, .ql-editor li, .ql-editor ol, .ql-editor ul {
//           color: black !important;
//         }
//         .ql-editor strong, .ql-editor em, .ql-editor u {
//           color: black !important;
//         }
//           .ql-tooltip {
//           left: auto !important;
//           right: 0 !important;
//           transform: none !important;
//   }
//       `}</style>
      
//       <div className="bg-white w-full border border-[black] max-w-[1400px]">
//         <div className="bg-white w-full px-4 sm:px-6 py-4 border-b border-gray-300">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <h1 className="text-xl sm:text-2xl font-normal text-gray-700">
//               Add Custom <strong>Template</strong>
//             </h1>
//             <button
//               onClick={() => router.push("/newsletter/TemplatesListPage")}
//               className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 px-6 sm:px-8 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors whitespace-nowrap"
//             >
//               ← Back to Templates
//             </button>
//           </div>
//         </div>

//         <div className="p-4 sm:p-6 md:p-8">
//           <div className="mb-4 sm:mb-6">
//             <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
//               Template Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={templateName}
//               onChange={(e) => setTemplateName(e.target.value)}
//               placeholder="Enter template name"
//               className="w-full border border-gray-300 text-black rounded-md px-3 sm:px-4 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 hover:bg-gray-100 focus:border-transparent"
//             />
//           </div>

//           <div className="mb-4 sm:mb-6">
//             <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
//               Message <strong className="text-red-500">(Note: Please Enter Plain Text Only For Better Result)</strong>
//             </label>
//            <div className="border-2 border-gray-300 rounded-lg overflow-auto resize">
//   <div id="editor" style={{ minHeight: '150px', backgroundColor: 'white' }}></div>
// </div>
//           </div>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
//             <label className="flex items-center gap-2 cursor-pointer group">
//               <input
//                 type="radio"
//                 name="visibility"
//                 value="admin"
//                 checked={visibility === "admin"}
//                 onChange={(e) => setVisibility(e.target.value)}
//                 className="w-4 h-4 cursor-pointer accent-blue-600"
//               />
//               <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900">
//                 Visible To Admin
//               </span>
//             </label>
//             <label className="flex items-center gap-2 cursor-pointer group">
//               <input
//                 type="radio"
//                 name="visibility"
//                 value="all"
//                 checked={visibility === "all"}
//                 onChange={(e) => setVisibility(e.target.value)}
//                 className="w-4 h-4 cursor-pointer accent-blue-600"
//               />
//               <span className="text-sm sm:text-base text-gray-700 group-hover:text-gray-900">
//                 Visible To All
//               </span>
//             </label>
//           </div>

//           <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
//             <button
//               onClick={handleSaveCustomTemplate}
//               className="w-full sm:w-auto bg-cyan-500 text-white px-6 sm:px-8 py-2.5 rounded-md text-sm sm:text-base hover:bg-cyan-600 active:bg-cyan-700 font-medium transition-colors shadow-sm"
//             >
//               Save Template
//             </button>
          
//             <button
//               onClick={() => router.push("/newsletter/TemplatesListPage")}
//               className="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 px-6 sm:px-8 py-2.5 rounded-md text-sm sm:text-base font-medium transition-colors shadow-sm"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }