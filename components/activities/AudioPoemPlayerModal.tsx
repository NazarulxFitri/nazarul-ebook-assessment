"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import { soundManager } from "../../lib/soundEffects";
import { speakTeacherText, stopTeacherSpeech } from "../../lib/teacherVoiceUtils";

interface AudioPoemPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POEM_STANZAS = [
  {
    lines: [
      "While walking into a toy store the day before today,",
      "I overheard a crayon box with many things to say,",
      "‘I don’t like Red!’ said Yellow, and Green said, ‘Nor do I.’",
      "‘And no one here likes Orange but no one knows just why.’",
    ],
  },
  {
    lines: [
      "‘We are a box of crayons that doesn’t get along.’",
      "Said Blue to all the others, ‘Something here is wrong.’",
      "Well, I bought that box of crayons and took it home with me,",
      "And laid out all the colours so the crayons all could see.",
    ],
  },
  {
    lines: [
      "They watched me as I coloured with Red and Blue and Green,",
      "And Black and White and Orange and every colour in between,",
      "They watched as Green became the grass and Blue became the sky,",
      "The Yellow sun was shining bright on White clouds drifting by.",
    ],
  },
  {
    lines: [
      "‘I do like Red!’ said Yellow, and Green said, ‘So do I.’",
      "‘And Blue, you were terrific so high up in the sky.’",
      "‘We are a box of crayons each one of us unique,",
      "but when we get together, the picture is complete.’",
    ],
  },
];

const ALL_LINES = POEM_STANZAS.flatMap((s) => s.lines);

export default function AudioPoemPlayerModal({ isOpen, onClose }: AudioPoemPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const isPlayingRef = useRef(isPlaying);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!isOpen) {
      stopTeacherSpeech();
      setIsPlaying(false);
      setActiveLineIndex(0);
    }
  }, [isOpen]);

  const speakLine = (index: number) => {
    if (index >= ALL_LINES.length) {
      setIsPlaying(false);
      setActiveLineIndex(0);
      return;
    }

    setActiveLineIndex(index);
    speakTeacherText(
      ALL_LINES[index],
      "female_teacher",
      1.0,
      0,
      () => {
        if (isPlayingRef.current) {
          speakLine(index + 1);
        }
      }
    );
  };

  const handlePlayPause = () => {
    soundManager.playClick();
    if (isPlaying) {
      stopTeacherSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakLine(activeLineIndex);
    }
  };

  const handleLineClick = (idx: number) => {
    soundManager.playClick();
    setActiveLineIndex(idx);
    if (isPlaying) {
      speakLine(idx);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        stopTeacherSpeech();
        onClose();
      }}
      title="Page 135: Audio Poem - The Crayon Box That Talked"
      badgeText="Audio Poem"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Audio Controller Bar */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white border border-amber-400/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="w-14 h-14 bg-white text-amber-600 hover:bg-amber-50 font-extrabold text-xl rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
              aria-label={isPlaying ? "Pause poem" : "Play poem"}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">The Crayon Box That Talked</h3>
              <p className="text-xs text-amber-100 font-medium">By Shane DeRolf • Narration & Synchronized Line Highlight</p>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1 h-8">
            {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30].map((h, idx) => (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-300 ${isPlaying ? "bg-white animate-pulse" : "bg-amber-200/50"
                  }`}
                style={{ height: isPlaying ? `${Math.max(15, Math.round(h * Math.random()))}px` : "12px" }}
              />
            ))}
          </div>
        </div>

        {/* Poem Text Karaoke Canvas */}
        <div className="space-y-6 p-6 bg-amber-50/70 rounded-2xl border border-amber-200/90 shadow-xs">
          {POEM_STANZAS.map((stanza, sIdx) => {
            return (
              <div key={sIdx} className="space-y-2 text-center md:text-left">
                {stanza.lines.map((line, lIdx) => {
                  const lineGlobalIdx = sIdx * 4 + lIdx;
                  const isCurrent = lineGlobalIdx === activeLineIndex;

                  return (
                    <p
                      key={lIdx}
                      onClick={() => handleLineClick(lineGlobalIdx)}
                      className={`cursor-pointer px-4 py-2 rounded-xl text-base md:text-lg font-medium transition-all duration-300 ${isCurrent && isPlaying
                        ? "bg-amber-200/80 text-amber-950 font-bold border-l-4 border-amber-500 shadow-sm scale-[1.01]"
                        : isCurrent
                          ? "bg-amber-100/60 text-amber-900 border-l-4 border-amber-400"
                          : "text-slate-700 hover:bg-amber-100/40 hover:text-slate-900"
                        }`}
                    >
                      {line}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
