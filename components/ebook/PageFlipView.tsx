"use client";

import React, { useState } from "react";
import { EBOOK_PAGES, Hotspot, EBookPageData } from "../../data/ebookPagesData";
import { soundManager } from "../../lib/soundEffects";

interface PageFlipViewProps {
  currentPage: number;
  isDualView: boolean;
  onOpenHotspot: (hotspotType: "dragdrop" | "video" | "audio" | "game") => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  isFullscreen?: boolean;
}

export default function PageFlipView({
  currentPage,
  isDualView,
  onOpenHotspot,
  onPrevPage,
  onNextPage,
  isFullscreen = false,
}: PageFlipViewProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const leftPageData = EBOOK_PAGES.find((p) => p.pageNumber === currentPage);
  const rightPageData = isDualView
    ? EBOOK_PAGES.find((p) => p.pageNumber === currentPage + 1)
    : undefined;

  // Target pages for next/prev spreads
  const step = isDualView ? 2 : 1;
  const nextLeftPage = EBOOK_PAGES.find((p) => p.pageNumber === currentPage + step);
  const nextRightPage = isDualView
    ? EBOOK_PAGES.find((p) => p.pageNumber === currentPage + step + 1)
    : undefined;

  const prevLeftPage = EBOOK_PAGES.find((p) => p.pageNumber === currentPage - step);
  const prevRightPage = isDualView
    ? EBOOK_PAGES.find((p) => p.pageNumber === currentPage - step + 1)
    : undefined;

  // Base underlay page data during flipping to prevent background glitching
  let displayLeftPage = leftPageData;
  let displayRightPage = rightPageData;

  if (isFlipping) {
    if (flipDirection === "next") {
      // Reveal nextRightPage under the flipping leaf on the right side
      displayLeftPage = leftPageData;
      displayRightPage = nextRightPage || rightPageData;
    } else {
      // Reveal prevLeftPage under the flipping leaf on the left side
      displayLeftPage = prevLeftPage || leftPageData;
      displayRightPage = rightPageData;
    }
  }

  const handleFlip = (direction: "prev" | "next") => {
    if (isFlipping) return;

    soundManager.playPageFlip();
    setFlipDirection(direction);
    setIsFlipping(true);

    setTimeout(() => {
      setIsFlipping(false);
      if (direction === "next") {
        onNextPage();
      } else {
        onPrevPage();
      }
    }, 520);
  };

  return (
    <div
      className={`relative flex-1 w-full mx-auto flex items-center justify-center overflow-hidden perspective-2000 ${
        isFullscreen ? "max-w-none p-1 sm:p-2 h-full" : "max-w-7xl p-2 sm:p-6"
      }`}
    >
      {/* Hidden Offscreen Preloader for All Page Assets */}
      <div className="hidden pointer-events-none opacity-0 select-none">
        {EBOOK_PAGES.map((p) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img key={p.pageNumber} src={p.image} alt="preload" />
        ))}
      </div>

      {/* eBook Outer Book Container with Spine & Shadow */}
      <div
        className={`relative w-full h-full flex items-center justify-center rounded-2xl bg-slate-200/80 border border-slate-300 shadow-xl transition-all duration-300 ${
          isFullscreen ? "max-h-full border-0 rounded-none shadow-none" : "max-h-[85vh]"
        }`}
      >
        {/* Previous Page Button */}
        {currentPage > 128 && (
          <button
            onClick={() => handleFlip("prev")}
            disabled={isFlipping}
            className="absolute left-1 sm:left-2 z-30 p-2.5 sm:p-3.5 rounded-full bg-white/95 hover:bg-indigo-600 text-slate-700 hover:text-white shadow-xl backdrop-blur border border-slate-200 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer text-xs sm:text-base"
            aria-label="Previous Page"
          >
            ◀
          </button>
        )}

        {/* Next Page Button */}
        {currentPage < (isDualView ? 137 : 138) && (
          <button
            onClick={() => handleFlip("next")}
            disabled={isFlipping}
            className="absolute right-1 sm:right-2 z-30 p-2.5 sm:p-3.5 rounded-full bg-white/95 hover:bg-indigo-600 text-slate-700 hover:text-white shadow-xl backdrop-blur border border-slate-200 transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer text-xs sm:text-base"
            aria-label="Next Page"
          >
            ▶
          </button>
        )}

        {/* Book Spreads Base Container */}
        <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 perspective-2000">
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              isDualView && displayRightPage ? "grid grid-cols-2 gap-1 sm:gap-2" : "max-w-4xl"
            }`}
          >
            {/* Base Left Page Spread */}
            {displayLeftPage && (
              <SingleBookPage
                pageData={displayLeftPage}
                isLeft={isDualView}
                onOpenHotspot={onOpenHotspot}
              />
            )}

            {/* Base Right Page Spread */}
            {isDualView && displayRightPage && (
              <SingleBookPage
                pageData={displayRightPage}
                isLeft={false}
                onOpenHotspot={onOpenHotspot}
              />
            )}

            {/* --- 3D PAGE FLIP ANIMATION OVERLAY --- */}
            {isFlipping && isDualView && (
              <>
                {/* 3D Flipping Leaf going NEXT (Right to Left turn) */}
                {flipDirection === "next" && rightPageData && (
                  <div className="absolute top-0 right-0 w-1/2 h-full z-20 transform-origin-left transform-style-3d animate-pageFlipNext">
                    {/* Front of flipping page (Current Right Page) */}
                    <div className="absolute inset-0 backface-hidden rounded-r-xl overflow-hidden border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rightPageData.image}
                        alt={rightPageData.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Back of flipping page (Target Left Page) */}
                    <div
                      className="absolute inset-0 backface-hidden rounded-l-xl overflow-hidden border border-slate-200 bg-white"
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      {nextLeftPage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={nextLeftPage.image}
                          alt={nextLeftPage.title}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* 3D Flipping Leaf going PREV (Left to Right turn) */}
                {flipDirection === "prev" && leftPageData && (
                  <div className="absolute top-0 left-0 w-1/2 h-full z-20 transform-origin-right transform-style-3d animate-pageFlipPrev">
                    {/* Front of flipping page (Current Left Page) */}
                    <div className="absolute inset-0 backface-hidden rounded-l-xl overflow-hidden border border-slate-200 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={leftPageData.image}
                        alt={leftPageData.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Back of flipping page (Target Right Page) */}
                    <div
                      className="absolute inset-0 backface-hidden rounded-r-xl overflow-hidden border border-slate-200 bg-white"
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      {prevRightPage && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={prevRightPage.image}
                          alt={prevRightPage.title}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Book Center Spine Gradient Shadow */}
          {isDualView && displayRightPage && (
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-slate-400/40 via-slate-500/50 to-slate-400/40 pointer-events-none z-30 rounded-full blur-[1px]" />
          )}
        </div>
      </div>
    </div>
  );
}

function SingleBookPage({
  pageData,
  isLeft,
  onOpenHotspot,
}: {
  pageData: EBookPageData;
  isLeft: boolean;
  onOpenHotspot: (type: "dragdrop" | "video" | "audio" | "game") => void;
}) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center rounded-xl bg-white overflow-hidden shadow-lg border border-slate-200 group">
      {/* Textbook Page Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pageData.image}
        alt={pageData.title}
        className="w-full h-full object-contain pointer-events-auto select-none"
      />

      {/* Interactive Page Hotspot Badges Overlay */}
      {pageData.hotspots &&
        pageData.hotspots.map((hotspot: Hotspot) => (
          <div
            key={hotspot.id}
            style={{ top: hotspot.top, left: hotspot.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenHotspot(hotspot.type);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-black rounded-full shadow-2xl border-2 border-white flex items-center gap-2 transform transition-all hover:scale-110 active:scale-95 animate-pulse"
            >
              <span className="text-base">
                {hotspot.type === "dragdrop" && "🧩"}
                {hotspot.type === "video" && "🎬"}
                {hotspot.type === "audio" && "🎧"}
                {hotspot.type === "game" && "🎲"}
              </span>
              <span className="whitespace-nowrap">{hotspot.label}</span>
            </button>
          </div>
        ))}

      {/* Page Corner Fold Effect */}
      <div
        className={`absolute top-0 ${
          isLeft ? "left-0 bg-gradient-to-br" : "right-0 bg-gradient-to-bl"
        } from-slate-300/40 to-transparent w-8 h-8 pointer-events-none`}
      />
    </div>
  );
}
