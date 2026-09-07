"use client";

import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import PageFlipView from "./PageFlipView";
import SidebarMenu from "./SidebarMenu";
import PageSearch from "./PageSearch";

import DragDropActivityModal from "../activities/DragDropActivityModal";
import VideoPlayerModal from "../activities/VideoPlayerModal";
import AudioPoemPlayerModal from "../activities/AudioPoemPlayerModal";
import StarChallengeGameModal from "../activities/StarChallengeGameModal";

export default function EBookReader() {
  const [currentPage, setCurrentPage] = useState(128); // Starts at page 128
  const [isDualView, setIsDualView] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Responsive breakpoint check for mobile single page view vs desktop dual view
  useEffect(() => {
    const handleResize = () => {
      setIsDualView(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Active activity modal state
  const [activeModal, setActiveModal] = useState<"dragdrop" | "video" | "audio" | "game" | null>(null);

  // Listen for browser fullscreen state changes across vendor implementations
  useEffect(() => {
    const handleFSChange = () => {
      const fsDoc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        mozFullScreenElement?: Element;
        msFullscreenElement?: Element;
      };
      const isFS = !!(
        fsDoc.fullscreenElement ||
        fsDoc.webkitFullscreenElement ||
        fsDoc.mozFullScreenElement ||
        fsDoc.msFullscreenElement
      );
      setIsFullscreen(isFS);
    };

    document.addEventListener("fullscreenchange", handleFSChange);
    document.addEventListener("webkitfullscreenchange", handleFSChange);
    document.addEventListener("mozfullscreenchange", handleFSChange);
    document.addEventListener("MSFullscreenChange", handleFSChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFSChange);
      document.removeEventListener("webkitfullscreenchange", handleFSChange);
      document.removeEventListener("mozfullscreenchange", handleFSChange);
      document.removeEventListener("MSFullscreenChange", handleFSChange);
    };
  }, []);

  const handlePrevPage = () => {
    const step = isDualView ? 2 : 1;
    setCurrentPage((prev) => Math.max(128, prev - step));
  };

  const handleNextPage = () => {
    const step = isDualView ? 2 : 1;
    setCurrentPage((prev) => Math.min(138, prev + step));
  };

  const handleToggleFullscreen = () => {
    const doc = document.documentElement as unknown as {
      requestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
      msRequestFullscreen?: () => Promise<void>;
    };
    const fsDoc = document as unknown as {
      exitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
      fullscreenElement?: Element;
      webkitFullscreenElement?: Element;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
    };

    const isFS = !!(
      fsDoc.fullscreenElement ||
      fsDoc.webkitFullscreenElement ||
      fsDoc.mozFullScreenElement ||
      fsDoc.msFullscreenElement
    );

    if (!isFS) {
      if (doc.requestFullscreen) {
        doc.requestFullscreen().catch(() => {});
      } else if (doc.webkitRequestFullscreen) {
        doc.webkitRequestFullscreen();
      } else if (doc.mozRequestFullScreen) {
        doc.mozRequestFullScreen();
      } else if (doc.msRequestFullscreen) {
        doc.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (fsDoc.exitFullscreen) {
        fsDoc.exitFullscreen().catch(() => {});
      } else if (fsDoc.webkitExitFullscreen) {
        fsDoc.webkitExitFullscreen();
      } else if (fsDoc.mozCancelFullScreen) {
        fsDoc.mozCancelFullScreen();
      } else if (fsDoc.msExitFullscreen) {
        fsDoc.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 text-slate-800 overflow-hidden font-sans select-none">
      {/* Top Toolbar */}
      <NavigationBar
        currentPage={currentPage}
        totalPages={11}
        minPage={128}
        maxPage={138}
        isDualView={isDualView}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onOpenSidebar={() => {
          if (isFullscreen) {
            handleToggleFullscreen();
          }
          setSidebarOpen(!sidebarOpen);
        }}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Contents (Hidden when Fullscreen is Active) */}
        {!isFullscreen && (
          <SidebarMenu
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            currentPage={currentPage}
            onSelectPage={(num) => setCurrentPage(num)}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {/* Main eBook Viewer Area */}
        <main
          className={`flex-1 flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-100 via-indigo-50/70 to-slate-200 ${
            isFullscreen ? "p-1 sm:p-2" : "p-1.5 sm:p-4"
          }`}
        >
          <PageFlipView
            currentPage={currentPage}
            isDualView={isDualView}
            onOpenHotspot={(type) => setActiveModal(type)}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            isFullscreen={isFullscreen}
          />
        </main>
      </div>

      {/* Bottom Floating Quick Launcher Bar (Hidden in Fullscreen Mode) */}
      {!isFullscreen && (
        <footer className="bg-white/90 border-t border-slate-200/90 py-2 px-3 sm:py-2.5 sm:px-4 z-20 backdrop-blur shadow-sm flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar text-xs font-semibold shrink-0">
          <span className="text-slate-500 font-bold uppercase tracking-wider hidden sm:inline shrink-0">Interactive Activities:</span>

          <button
            onClick={() => setActiveModal("dragdrop")}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 hover:border-pink-300 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span>🧩</span>
            <span>Drag & Drop (Pg 128-129)</span>
          </button>

          <button
            onClick={() => setActiveModal("video")}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 hover:border-sky-300 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span>🎬</span>
            <span>Japan & India Video (Pg 130)</span>
          </button>

          <button
            onClick={() => setActiveModal("audio")}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span>🎧</span>
            <span>Poem Audio (Pg 135)</span>
          </button>

          <button
            onClick={() => setActiveModal("game")}
            className="shrink-0 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span>🎲</span>
            <span>Star Challenge Game (Pg 136-137)</span>
          </button>
        </footer>
      )}

      {/* Search & Jump Modal */}
      <PageSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectPage={(num) => setCurrentPage(num)}
      />

      {/* Item 2: Drag & Drop Activity Modal (Pages 128 - 129) */}
      <DragDropActivityModal
        isOpen={activeModal === "dragdrop"}
        onClose={() => setActiveModal(null)}
      />

      {/* Item 3: Animation / Video Modal (Page 130) */}
      <VideoPlayerModal
        isOpen={activeModal === "video"}
        onClose={() => setActiveModal(null)}
      />

      {/* Item 4: Audio Poem Player Modal (Page 135) */}
      <AudioPoemPlayerModal
        isOpen={activeModal === "audio"}
        onClose={() => setActiveModal(null)}
      />

      {/* Item 5: Gamified Star Challenge Board Game Modal (Pages 136 - 137) */}
      <StarChallengeGameModal
        isOpen={activeModal === "game"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
