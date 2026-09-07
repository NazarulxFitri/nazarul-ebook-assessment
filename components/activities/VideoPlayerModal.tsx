"use client";

import React, { useState, useEffect, useRef } from "react";
import Modal from "../ui/Modal";
import { soundManager } from "../../lib/soundEffects";
import { speakTeacherText, stopTeacherSpeech } from "../../lib/teacherVoiceUtils";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JAPAN_VIDEO = {
  id: "japan",
  title: "Japan: Cultural Explorer Video",
  flag: "🇯🇵",
  image: "/videos/japan_culture.jpg",
  segments: [
    {
      time: "0:00 - 0:04",
      text: "Japan is in Asia. The national anthem of Japan is Kimigayo and its national flag is Hinomaru.",
      caption: "Japan is in Asia. National anthem: Kimigayo • National flag: Hinomaru.",
    },
    {
      time: "0:04 - 0:08",
      text: "The people in Japan speak Japanese. Chopsticks are used to eat meals of rice, fish, and sushi.",
      caption: "Languages: Japanese & English • Food: Chopsticks, Rice, Fish & Sushi.",
    },
    {
      time: "0:08 - 0:12",
      text: "Before entering a Japanese home, it is polite to take off your shoes and greet each other by bowing.",
      caption: "Etiquette: Take off shoes before entering • Greeting: Bowing with respect.",
    },
    {
      time: "0:12 - 0:16",
      text: "Family is very important to the Japanese. During festivals and celebrations, many wear the kimono.",
      caption: "Culture: Respect for elders & family • Attire: Traditional Kimono.",
    },
  ],
};

const INDIA_VIDEO = {
  id: "india",
  title: "India: Cultural Explorer Video",
  flag: "🇮🇳",
  image: "/videos/india_culture.jpg",
  segments: [
    {
      time: "0:00 - 0:04",
      text: "India is a country in Asia. The national anthem of India is Jana Gana Mana and its flag is Tiranga.",
      caption: "India is in Asia. National anthem: Jana Gana Mana • National flag: Tiranga.",
    },
    {
      time: "0:04 - 0:08",
      text: "Indians speak mainly Hindi and English. Many Indians are vegetarians, enjoying rice, bread, and yogurt.",
      caption: "Languages: Hindi & English • Cuisine: Rice, Vegetables, Flatbread & Yogurt.",
    },
    {
      time: "0:08 - 0:12",
      text: "Women wear the sari and men wear the dhoti. Visitors take off their shoes at the entrance of homes.",
      caption: "Attire: Women wear Sari, Men wear Dhoti • Etiquette: Take off shoes at entrance.",
    },
    {
      time: "0:12 - 0:16",
      text: "Indians greet each other by holding their palms together in Namaste and bowing their heads.",
      caption: "Greeting: Namaste with palms together & bow • Values: Family & respect for parents.",
    },
  ],
};

export default function VideoPlayerModal({ isOpen, onClose }: VideoPlayerModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<"japan" | "india">("japan");
  const [isPlaying, setIsPlaying] = useState(false);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"video" | "quiz">("video");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const isPlayingRef = useRef(isPlaying);

  const videoData = selectedVideo === "japan" ? JAPAN_VIDEO : INDIA_VIDEO;
  const currentSegment = videoData.segments[segmentIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!isOpen) {
      stopTeacherSpeech();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
      setSegmentIndex(0);
    }
  }, [isOpen]);

  const speakSegment = (index: number) => {
    const segments = videoData.segments;
    if (index >= segments.length) {
      setIsPlaying(false);
      setSegmentIndex(0);
      return;
    }

    setSegmentIndex(index);
    const targetSeg = segments[index];

    speakTeacherText(
      targetSeg.text,
      "female_teacher",
      1.0,
      0,
      () => {
        if (isPlayingRef.current) {
          timerRef.current = setTimeout(() => {
            if (isPlayingRef.current) {
              const next = index + 1;
              if (next < segments.length) {
                speakSegment(next);
              } else {
                setIsPlaying(false);
                setSegmentIndex(0);
              }
            }
          }, 800);
        }
      }
    );
  };

  const handlePlayPause = () => {
    soundManager.playClick();
    if (isPlaying) {
      stopTeacherSpeech();
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakSegment(segmentIndex);
    }
  };

  const handleSelectVideo = (videoKey: "japan" | "india") => {
    soundManager.playClick();
    stopTeacherSpeech();
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setSelectedVideo(videoKey);
    setSegmentIndex(0);
  };

  const handleClose = () => {
    stopTeacherSpeech();
    if (timerRef.current) clearTimeout(timerRef.current);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Page 130: Educational Video - Japan & India Culture"
      badgeText="Interactive Video"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-5">
        {/* Country Video Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex gap-2">
            <button
              onClick={() => handleSelectVideo("japan")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black border transition-all flex items-center gap-2 cursor-pointer ${
                selectedVideo === "japan"
                  ? "bg-rose-100 border-rose-400 text-rose-900 shadow-xs ring-1 ring-rose-300"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🇯🇵</span>
              <span>Japan Video</span>
            </button>

            <button
              onClick={() => handleSelectVideo("india")}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black border transition-all flex items-center gap-2 cursor-pointer ${
                selectedVideo === "india"
                  ? "bg-amber-100 border-amber-400 text-amber-900 shadow-xs ring-1 ring-amber-300"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🇮🇳</span>
              <span>India Video</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab("video");
              }}
              className={`px-3.5 py-1.5 font-bold text-xs rounded-lg border transition-all cursor-pointer ${
                activeTab === "video"
                  ? "bg-indigo-100 border-indigo-400 text-indigo-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              🎬 Video Mode
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveTab("quiz");
              }}
              className={`px-3.5 py-1.5 font-bold text-xs rounded-lg border transition-all cursor-pointer ${
                activeTab === "quiz"
                  ? "bg-indigo-100 border-indigo-400 text-indigo-900 shadow-xs"
                  : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              ❓ Video Quiz
            </button>
          </div>
        </div>

        {activeTab === "video" ? (
          <div className="space-y-4">
            {/* Dedicated HTML5 Animated Video Player Container */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-950 aspect-video max-h-[480px] shadow-xl flex flex-col justify-between group">
              
              {/* Ken-Burns Motion Background Scene */}
              <div className="absolute inset-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={videoData.image}
                  alt={videoData.title}
                  className={`w-full h-full object-cover transition-transform duration-1000 ${
                    isPlaying ? "scale-105" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60" />
              </div>

              {/* Video Header Badge */}
              <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                  <span className="text-3xl animate-bounce">{videoData.flag}</span>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-white">{videoData.title}</h3>
                    <p className="text-xs text-indigo-300 font-medium">Segment {segmentIndex + 1} of {videoData.segments.length}</p>
                  </div>
                </div>

                <div className="px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-mono font-bold text-amber-300 border border-white/10">
                  {currentSegment.time}
                </div>
              </div>

              {/* Synchronized Closed Caption Subtitle */}
              <div className="relative z-10 px-6 py-3 my-auto text-center">
                <div className="inline-block px-5 py-3 bg-black/90 backdrop-blur-md rounded-2xl border border-amber-500/40 shadow-2xl max-w-2xl">
                  <p className="text-sm md:text-base font-bold text-amber-200 leading-snug animate-fadeIn">
                    &quot;{currentSegment.text}&quot;
                  </p>
                  <p className="text-xs font-semibold text-indigo-300 mt-1">
                    📌 {currentSegment.caption}
                  </p>
                </div>
              </div>

              {/* Video Controls Footer */}
              <div className="relative z-10 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 flex flex-col gap-3">
                {/* Segment Progress Indicators */}
                <div className="grid grid-cols-4 gap-2">
                  {videoData.segments.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        soundManager.playClick();
                        setSegmentIndex(idx);
                        if (isPlaying) speakSegment(idx);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        segmentIndex === idx
                          ? "bg-amber-400 ring-2 ring-amber-300 scale-105"
                          : idx < segmentIndex
                          ? "bg-indigo-500"
                          : "bg-slate-700 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isPlaying ? "⏸ Pause Video" : "▶ Play Video"}</span>
                    </button>

                    <button
                      onClick={() => {
                        soundManager.playClick();
                        const nextIdx = (segmentIndex + 1) % videoData.segments.length;
                        setSegmentIndex(nextIdx);
                        if (isPlaying) speakSegment(nextIdx);
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                    >
                      Next Scene ⏭
                    </button>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">
                    Line-by-line Sync Narration Enabled
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Comprehension Quiz Tab */
          <div className="space-y-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Video Comprehension Question (Page 130):</h3>
            <p className="text-sm text-slate-600">
              How do people in Japan and India greet each other traditionally according to the video passage?
            </p>

            <div className="space-y-3 text-sm">
              {[
                { label: "Japan greets by bowing; India greets by holding palms together (Namaste) & bowing", isCorrect: true },
                { label: "Japan greets by shaking hands; India greets by waving", isCorrect: false },
                { label: "Both countries greet by high-fiving", isCorrect: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    soundManager.playClick();
                    setQuizAnswer(opt.label);
                    if (opt.isCorrect) {
                      soundManager.playCorrect();
                      setQuizScore(1);
                    } else {
                      soundManager.playWrong();
                      setQuizScore(0);
                    }
                  }}
                  className={`w-full p-4 text-left rounded-xl border font-medium transition-all cursor-pointer ${
                    quizAnswer === opt.label
                      ? opt.isCorrect
                        ? "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs"
                        : "bg-rose-100 border-rose-400 text-rose-950 font-bold shadow-xs"
                      : "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {quizScore !== null && (
              <div
                className={`p-4 rounded-xl text-center font-bold text-sm border ${
                  quizScore === 1
                    ? "bg-emerald-100 border-emerald-400 text-emerald-900"
                    : "bg-rose-100 border-rose-400 text-rose-900"
                }`}
              >
                {quizScore === 1
                  ? "✨ Correct! Bowing in Japan and holding palms together in India are respectful traditional greetings."
                  : "❌ Incorrect. Review the video on Page 130 and try again!"}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
