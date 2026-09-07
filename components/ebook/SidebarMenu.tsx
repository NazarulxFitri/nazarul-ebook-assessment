"use client";

import React, { useState } from "react";
import { EBOOK_PAGES } from "../../data/ebookPagesData";
import { soundManager } from "../../lib/soundEffects";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSelectPage: (pageNumber: number) => void;
  onOpenSearch?: () => void;
}

export default function SidebarMenu({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
  onOpenSearch,
}: SidebarMenuProps) {
  const [filter, setFilter] = useState<"all" | "interactive">("all");

  const filteredPages = EBOOK_PAGES.filter((page) => {
    if (filter === "interactive") {
      return page.hotspots && page.hotspots.length > 0;
    }
    return true;
  });

  return (
    <>
      {/* Mobile Backdrop (Only active on small screens when isOpen is true) */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel Container / Mobile Mega Menu */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 md:z-10 w-88 max-w-[92vw] md:w-80 bg-white border-r border-slate-200 text-slate-800 flex flex-col h-full shadow-2xl md:shadow-none shrink-0 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Panel Header (Mega Menu Style) */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30 text-sm">
                📖
              </span>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-300 block">
                  Unit 15 Navigation
                </span>
                <h3 className="text-base font-extrabold text-white">Mega Menu Index</h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {onOpenSearch && (
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenSearch();
                    onClose();
                  }}
                  className="p-2 text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-xs"
                  title="Search eBook"
                >
                  🔍
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="md:hidden p-2 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer text-xs font-bold"
                title="Close menu"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mega Menu Category Filter Tabs */}
          <div className="grid grid-cols-2 gap-1.5 mt-3 p-1 bg-slate-900/80 rounded-xl border border-white/10 text-[11px] font-bold">
            <button
              onClick={() => {
                soundManager.playClick();
                setFilter("all");
              }}
              className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              All Pages ({EBOOK_PAGES.length})
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setFilter("interactive");
              }}
              className={`py-1.5 rounded-lg transition-all text-center cursor-pointer ${
                filter === "interactive"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Interactive Activities
            </button>
          </div>
        </div>

        {/* Spacious Page List Cards */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 custom-scrollbar bg-slate-50/50">
          {filteredPages.length > 0 ? (
            filteredPages.map((page) => {
              const isActive = currentPage === page.pageNumber;

              return (
                <button
                  key={page.pageNumber}
                  onClick={() => {
                    soundManager.playPageFlip();
                    onSelectPage(page.pageNumber);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center gap-3.5 cursor-pointer group ${
                    isActive
                      ? "bg-white border-indigo-500 text-indigo-950 shadow-md ring-2 ring-indigo-500/20 scale-[1.01]"
                      : "bg-white border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-300 text-slate-700 shadow-2xs"
                  }`}
                >
                  {/* Thumbnail Preview Badge */}
                  <div className="w-12 h-16 rounded-xl overflow-hidden border border-slate-300 shrink-0 relative bg-slate-100 shadow-xs group-hover:border-indigo-400 transition-colors">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={page.image}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-slate-900/90 text-[9px] font-mono text-center text-white py-0.5 font-bold">
                      Pg {page.pageNumber}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-extrabold text-indigo-600 tracking-wide">
                        Page {page.pageNumber}
                      </span>
                      {page.hotspots && page.hotspots.length > 0 && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300/80 text-[9px] font-extrabold rounded-full shrink-0 flex items-center gap-1">
                          <span>✨</span>
                          <span>Interactive</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                      {page.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{page.subtopic}</p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs">
              No pages match the selected category filter.
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 border-t border-slate-200 bg-white text-center shrink-0">
          <span className="text-[10px] font-semibold text-slate-400">
            Unit 15 • Pages 128 - 138 • Mobile Single Page Mode
          </span>
        </div>
      </aside>
    </>
  );
}
