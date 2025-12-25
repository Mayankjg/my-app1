"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TemplatesListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem("emailTemplates") || "[]");
    setTemplates(savedTemplates);
    setFilteredTemplates(savedTemplates);
  }, []);

  const handleSearch = () => {
    const filtered = search.trim() 
      ? templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
      : templates;
    setFilteredTemplates(filtered);
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedTemplates(e.target.checked ? filteredTemplates.map(t => t.id) : []);
  };

  const handleSelectTemplate = (id) => {
    setSelectedTemplates(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const updateTemplates = (updatedTemplates) => {
    setTemplates(updatedTemplates);
    setFilteredTemplates(updatedTemplates.filter(t => 
      !search.trim() || t.name.toLowerCase().includes(search.toLowerCase())
    ));
    localStorage.setItem("emailTemplates", JSON.stringify(updatedTemplates));
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this template?")) {
      updateTemplates(templates.filter(t => t.id !== id));
      setSelectedTemplates(prev => prev.filter(t => t !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedTemplates.length === 0) return alert("Please select templates to delete");
    if (confirm(`Are you sure you want to delete ${selectedTemplates.length} template(s)?`)) {
      updateTemplates(templates.filter(t => !selectedTemplates.includes(t.id)));
      setSelectedTemplates([]);
      setSelectAll(false);
    }
  };

  const handleView = (template) => {
    const previewWindow = window.open('', '_blank', 'width=800,height=600');
    previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${template.name} - Preview</title>
          <style>body { margin: 20px; font-family: Arial, sans-serif; } h1 { color: #333; }</style>
        </head>
        <body><h1>${template.name}</h1>${template.content}</body>
      </html>
    `);
    previewWindow.document.close();
  };

  const ActionButton = ({ onClick, className, children }) => (
    <button onClick={onClick} className={`w-full sm:w-auto px-5 py-2.5 rounded transition-colors text-base ${className}`}>
      {children}
    </button>
  );

  const TableButton = ({ onClick, color, children }) => (
    <button onClick={onClick} className={`bg-${color}-500 hover:bg-${color}-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors`}>
      {children}
    </button>
  );

  return (
    <div className="bg-[#e5e9ec] p-0 sm:p-5 h-screen overflow-y-auto flex justify-center items-start font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <div className="bg-white w-full border max-w-[1400px]">
        <div className="bg-white w-full px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl sm:text-2xl font-normal text-gray-700">
              <strong>Templates</strong>
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto"> 
              {selectedTemplates.length > 0 && (
                <ActionButton onClick={handleBulkDelete} className="bg-red-500 hover:bg-red-600 text-white">
                  Delete Selected ({selectedTemplates.length})
                </ActionButton>
              )}
              <ActionButton 
                onClick={() => router.push("/newsletter/TemplatesListPage/AddCustomTemplate")}
                className="bg-[#2d4456] hover:bg-[#1f2f3d] text-white"
              >
                Add Custom Template
              </ActionButton>
              <ActionButton 
                onClick={() => router.push("/newsletter/TemplatesListPage/AddTemplate")}
                className="bg-[#2d4456] hover:bg-[#1f2f3d] text-white"
              >
                Add Template
              </ActionButton>
            </div>
          </div>
          <hr className="-mx-4 sm:-mx-6 border-t border-gray-300 mt-4 mb-0" />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center px-4 sm:px-6 gap-2 mb-6 sm:justify-end">
          <input
            type="text"
            placeholder="Template Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full sm:w-[200px] text-black h-10 sm:h-9 border border-gray-300 rounded-[5px] px-5 py-2 text-base sm:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#00a7cf]"
          />
          <button 
            onClick={handleSearch}
            className="bg-[#0baad1] w-full sm:w-[70px] h-10 text-white px-2 py-1 text-base sm:text-[18px] font-medium rounded-[5px] hover:bg-[#0094b8] transition-colors"
          >
            Search
          </button>
        </div>

        <div className="w-full px-2 sm:px-6 pb-6">
          <div className="border border-gray-200 overflow-x-auto rounded">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#dee2e6] border-b border-gray-200">
                  <th className="py-3 px-4 text-left w-12 sticky left-0 bg-[#dee2e6] z-10">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" checked={selectAll} onChange={handleSelectAll} />
                  </th>
                  {["SR NO", "TEMPLATE NAME", "PRODUCT NAME", "PREVIEW IMAGE", "TYPE", "VIEW", "DELETE", "EDIT"].map(header => (
                    <th key={header} className="py-3 px-4 text-center text-xs font-semibold text-[#6c757d] uppercase tracking-wider whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredTemplates.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-8 text-red-500 text-base font-medium">No Record Found</td>
                  </tr>
                ) : (
                  filteredTemplates.map((template, index) => (
                    <tr key={template.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-left sticky left-0 bg-white z-10">
                        <input type="checkbox" className="w-4 h-4 cursor-pointer" 
                          checked={selectedTemplates.includes(template.id)} 
                          onChange={() => handleSelectTemplate(template.id)} 
                        />
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{template.name}</td>
                      <td className="py-3 px-4 text-center text-sm text-gray-700">{template.product || "N/A"}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          template.isCustom ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                        }`}>
                          {template.isCustom ? "Custom" : "System"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <TableButton onClick={() => handleView(template)} color="blue">View</TableButton>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <TableButton onClick={() => handleDelete(template.id)} color="red">Delete</TableButton>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <TableButton onClick={() => router.push(`/newsletter/TemplatesListPage/EditTemplate/${template.id}`)} color="yellow">
                          Edit
                        </TableButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center sm:hidden">← Swipe to see more →</p>
        </div>
      </div>
    </div>
  );
}