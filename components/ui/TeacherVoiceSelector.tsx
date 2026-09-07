"use client";

import React, { useState } from "react";
import { TEACHER_PERSONAS, findBestVoiceForPersona } from "../../lib/teacherVoiceUtils";
import { soundManager } from "../../lib/soundEffects";

interface TeacherVoiceSelectorProps {
  selectedPersona: string;
  onSelectPersona: (personaId: string) => void;
  voices: SpeechSynthesisVoice[];
  speedRate: number;
  onChangeSpeed: (rate: number) => void;
  pitchOffset: number;
  onChangePitch: (pitch: number) => void;
  compact?: boolean;
}

export default function TeacherVoiceSelector({
  selectedPersona,
  onSelectPersona,
  voices,
  speedRate,
  onChangeSpeed,
  pitchOffset,
  onChangePitch,
  compact = false,
}: TeacherVoiceSelectorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const activeVoiceObj = findBestVoiceForPersona(voices, selectedPersona);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Header & Persona Selector */}
        <div className="flex items-center gap-2">
          <span className="text-base">🎙️</span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-300">
            Teacher Voice:
          </span>

          <div className="flex flex-wrap gap-1.5">
            {TEACHER_PERSONAS.map((p) => {
              const isSelected = selectedPersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPersona(p.id);
                  }}
                  title={p.description}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md scale-[1.02] ring-1 ring-amber-300"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span>{p.avatar}</span>
                  <span>{p.name.split(" ")[0]} {p.name.split(" ")[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Speed Controls & Settings Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 text-[10px] font-bold uppercase">Pace:</span>
            {[0.8, 0.9, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => {
                  soundManager.playClick();
                  onChangeSpeed(s);
                }}
                className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                  Math.abs(speedRate - s) < 0.05
                    ? "bg-amber-400 text-slate-950"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {s === 0.9 ? "Teacher" : `${s}x`}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowAdvanced(!showAdvanced);
            }}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg font-medium border border-slate-700"
            title="Adjust voice pitch and hardware system voices"
          >
            ⚙️ Tune
          </button>
        </div>
      </div>

      {/* Active Voice Info & Advanced Controls */}
      {showAdvanced && (
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Hardware Voice Picker */}
          {englishVoices.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-400">System Voice:</span>
              <select
                value={selectedPersona}
                onChange={(e) => {
                  soundManager.playClick();
                  onSelectPersona(e.target.value);
                }}
                className="bg-slate-950 border border-slate-700 text-amber-200 rounded px-2 py-1 max-w-[220px] truncate focus:outline-none focus:border-amber-400"
              >
                <optgroup label="Teacher Personas">
                  {TEACHER_PERSONAS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.avatar} {p.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="System Installed Voices">
                  {englishVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          )}

          {/* Warmth Pitch Tuner */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Warmth/Tone:</span>
            {[
              { label: "Gentle", val: -0.05 },
              { label: "Warm Teacher", val: 0.08 },
              { label: "Bright", val: 0.15 },
            ].map((pt) => (
              <button
                key={pt.label}
                onClick={() => {
                  soundManager.playClick();
                  onChangePitch(pt.val);
                }}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  Math.abs(pitchOffset - pt.val) < 0.03
                    ? "bg-amber-500/30 text-amber-200 border border-amber-400"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>

          {activeVoiceObj && (
            <div className="text-[11px] text-slate-400 font-mono italic">
              Active Voice Engine: <span className="text-emerald-400">{activeVoiceObj.name}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
