"use client";

import React from "react";
import { soundManager } from "../../lib/soundEffects";

interface NavigationBarProps {
  currentPage: number;
  totalPages: number;
  minPage: number;
  maxPage: number;
  isDualView?: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function NavigationBar({
  currentPage,
  totalPages,
  minPage,
  maxPage,
  isDualView = true,
  onPrevPage,
  onNextPage,
  onOpenSidebar,
  onOpenSearch,
  onToggleFullscreen,
  isFullscreen,
  soundEnabled,
  onToggleSound,
}: NavigationBarProps) {
  const canPrev = currentPage > minPage;
  const canNext = currentPage < maxPage;

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-2 sm:px-4 py-2 sm:py-3 text-slate-800 flex items-center justify-between z-30 shadow-xs gap-1.5 sm:gap-4 shrink-0">
      {/* Left controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenSidebar();
          }}
          className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-xs font-semibold border border-slate-200 text-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          title="Open Table of Contents Mega Menu"
        >
          <span className="text-base sm:text-xs">☰</span>
          <span className="hidden sm:inline font-bold">Contents</span>
        </button>
      </div>

      {/* Page Title & Indicator Center */}
      <div className="flex items-center gap-1 sm:gap-3 bg-slate-100/90 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-slate-200 shadow-2xs">
        <button
          onClick={() => {
            soundManager.playPageFlip();
            onPrevPage();
          }}
          disabled={!canPrev}
          className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
            canPrev ? "hover:bg-indigo-100 text-slate-700 hover:text-indigo-700" : "text-slate-400 cursor-not-allowed"
          }`}
          title="Previous Page"
        >
          ◀
        </button>

        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-tight sm:tracking-wider text-indigo-700 whitespace-nowrap">
          {isDualView
            ? `Pages ${currentPage < maxPage ? `${currentPage} - ${currentPage + 1}` : currentPage} / ${maxPage}`
            : `Pg ${currentPage} / ${maxPage}`}
        </span>

        <button
          onClick={() => {
            soundManager.playPageFlip();
            onNextPage();
          }}
          disabled={!canNext}
          className={`p-1 sm:p-1.5 rounded-full transition-all cursor-pointer ${
            canNext ? "hover:bg-indigo-100 text-slate-700 hover:text-indigo-700" : "text-slate-400 cursor-not-allowed"
          }`}
          title="Next Page"
        >
          ▶
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleFullscreen();
          }}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
            isFullscreen
              ? "bg-indigo-600 text-white border-indigo-500 shadow-md"
              : "bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 border-slate-200"
          }`}
          title="Toggle Fullscreen"
        >
          <span>{isFullscreen ? "🗗" : "⛶"}</span>
          <span className="hidden sm:inline">{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
        </button>
      </div>
    </header>
  );
}
