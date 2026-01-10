"use client";

import CategoriesPage from './categories/page';
import LeadSourcePage from './lead-source/page';
import LeadStatusPage from './lead-status/page';
import ProductsPage from './products/page';

export default function ManageItemPage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <style>{`*{scrollbar-width:none!important;-ms-overflow-style:none!important}*::-webkit-scrollbar{display:none!important}`}</style>
      
      <LeadSourcePage />
    </div>
  );
}