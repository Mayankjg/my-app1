"use client";

import { useState } from "react";
import CommentsSection from "./components/CommentsSection";
import EmailSection from "./components/EmailSection";

export default function ActivityHistoryPage() {
  const [activeTab, setActiveTab] = useState("comments");
  
  return (
    <div className="bg-white w-full text-black p-4 sm:p-6 md:p-8 lg:p-10 xl:p-6 h-screen overflow-y-auto">
      <style>{`
        /* Hide all scrollbars globally */
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        
        *::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        
        body::-webkit-scrollbar,
        html::-webkit-scrollbar {
          display: none !important;
        }
        
        body,
        html {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        
        /* Hide scrollbars in all scrollable elements */
        div[class*="overflow"]::-webkit-scrollbar {
          display: none !important;
        }
        
        div[class*="overflow"] {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `}</style>

      <h2 className="text-[18px] md:text-[20px] font-semibold mb-3">
        Activity <span className="text-gray-500">history</span>
      </h2>

      <div className="border-[1px] border-gray-600 bg-white">
        <div className="flex bg-[#d7dee3] border-b border-t border-gray-300 flex-wrap h-11">
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-4 py-2 text-sm border-r border-gray-300 
              w-1/2 sm:w-auto text-center
              ${
                activeTab === "comments"
                  ? "bg-white font-medium"
                  : "bg-[#d7dee3] text-gray-600"
              }
            `}
          >
            Comments
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-2 text-sm border-r border-gray-300 
              w-1/2 sm:w-auto text-center
              ${
                activeTab === "email"
                  ? "bg-white font-medium"
                  : "bg-[#d7dee3] text-gray-600"
              }
            `}
          >
            Send email
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {activeTab === "comments" ? <CommentsSection /> : <EmailSection />}
        </div>
      </div>
    </div>
  );
}