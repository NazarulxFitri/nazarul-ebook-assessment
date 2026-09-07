"use client";

import React from "react";
import { EBOOK_PAGES } from "../../data/ebookPagesData";
import { soundManager } from "../../lib/soundEffects";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
}

export default function SidebarMenu({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
}: SidebarMenuProps) {
  return (
    <>
      {/* Mobile Backdrop (Only active on small screens when isOpen is true) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel Container - ALWAYS visible on md: flex-col, toggleable on mobile */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 md:z-10 w-80 max-w-[85vw] bg-white border-r border-slate-200 text-slate-800 flex flex-col h-full shadow-xl md:shadow-none shrink-0 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600">Unit 15 Index</span>
            <h3 className="text-base font-bold text-slate-900">Table of Contents</h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Close mobile menu"
          >
            ✕
          </button>
        </div>

        {/* Pages / Subtopics List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {EBOOK_PAGES.map((page) => {
            const isActive = currentPage === page.pageNumber;

            return (
              <button
                key={page.pageNumber}
                onClick={() => {
                  soundManager.playPageFlip();
                  onSelectPage(page.pageNumber);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-start gap-3 cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-300 scale-[1.01]"
                    : "bg-slate-50/80 border-slate-200 hover:bg-indigo-50/60 hover:border-indigo-200 text-slate-700"
                }`}
              >
                {/* Thumbnail Preview Badge */}
                <div className="w-10 h-14 rounded overflow-hidden border border-slate-300 shrink-0 relative bg-slate-100 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.image}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-slate-900/90 text-[9px] font-mono text-center text-white py-0.5 font-bold">
                    {page.pageNumber}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600">Page {page.pageNumber}</span>
                    {page.hotspots && page.hotspots.length > 0 && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-bold rounded">
                        Interactive
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{page.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{page.subtopic}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
