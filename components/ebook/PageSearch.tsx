"use client";

import React, { useState } from "react";
import Modal from "../ui/Modal";
import { EBOOK_PAGES, EBookPageData } from "../../data/ebookPagesData";
import { soundManager } from "../../lib/soundEffects";

interface PageSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (pageNumber: number) => void;
}

export default function PageSearch({ isOpen, onClose, onSelectPage }: PageSearchProps) {
  const [query, setQuery] = useState("");
  const [pageInput, setPageInput] = useState("");

  const filteredPages = query.trim()
    ? EBOOK_PAGES.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.subtopic.toLowerCase().includes(q) ||
          p.contentSummary.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
        );
      })
    : [];

  const handleDirectJump = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(pageInput, 10);
    if (!isNaN(num) && num >= 128 && num <= 138) {
      soundManager.playPageFlip();
      onSelectPage(num);
      onClose();
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search eBook & Direct Jump"
      badgeText="Navigation"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Direct Jump Input */}
        <form onSubmit={handleDirectJump} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Direct Jump to Page (128 - 138):</label>
            <input
              type="number"
              min="128"
              max="138"
              placeholder="Enter page number e.g. 130"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="self-end px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors cursor-pointer shadow-xs"
          >
            Jump 🚀
          </button>
        </form>

        {/* Keyword Search Input */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase text-slate-600">Search Content Keywords:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics e.g. 'Japan', 'Poem', 'Star Challenge', 'Grammar'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-indigo-500 pl-10 shadow-xs"
            />
            <span className="absolute left-3.5 top-3.5 text-slate-400">🔍</span>
          </div>

          {/* Quick Suggestions Tags */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Popular:</span>
            {["Canada", "Italy", "Japan", "India", "Poem", "Star Challenge", "Prepositions"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  soundManager.playClick();
                  setQuery(tag);
                }}
                className="px-2.5 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 cursor-pointer font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {query.trim() && (
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            <p className="text-xs text-slate-500 font-bold uppercase">
              {filteredPages.length} matching results found:
            </p>
            {filteredPages.length > 0 ? (
              filteredPages.map((page) => (
                <button
                  key={page.pageNumber}
                  onClick={() => {
                    soundManager.playPageFlip();
                    onSelectPage(page.pageNumber);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl bg-white hover:bg-indigo-50/70 border border-slate-200 text-left transition-colors flex items-center justify-between shadow-xs cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-bold text-indigo-700">Page {page.pageNumber}</span>
                    <h4 className="text-sm font-bold text-slate-900">{page.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{page.contentSummary}</p>
                  </div>
                  <span className="text-indigo-600 text-xs font-bold">Go →</span>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500 py-4 text-center">No matching pages found for &quot;{query}&quot;.</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
