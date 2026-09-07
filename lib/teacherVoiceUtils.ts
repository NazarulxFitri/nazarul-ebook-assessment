import { useState, useEffect } from "react";

export interface TeacherPersona {
  id: string;
  name: string;
  avatar: string;
  gender: "female" | "male" | "auto";
  description: string;
  defaultPitch: number;
  defaultRate: number;
  voiceKeywords: string[];
}

export const TEACHER_PERSONAS: TeacherPersona[] = [
  {
    id: "female_teacher",
    name: "Ms. Clara (Warm Female Teacher)",
    avatar: "👩‍🏫",
    gender: "female",
    description: "Friendly, gentle, and expressive reading tone for primary students",
    defaultPitch: 1.08,
    defaultRate: 0.88,
    voiceKeywords: [
      "samantha",
      "karen",
      "victoria",
      "moira",
      "fiona",
      "serena",
      "ava",
      "google us english",
      "google uk english female",
      "microsoft zira",
      "microsoft jenny",
      "microsoft aria",
      "natural",
      "enhanced",
    ],
  },
  {
    id: "male_teacher",
    name: "Mr. James (Clear Male Teacher)",
    avatar: "👨‍🏫",
    gender: "male",
    description: "Calm, clear, and reassuring storytelling voice",
    defaultPitch: 0.96,
    defaultRate: 0.88,
    voiceKeywords: [
      "daniel",
      "oliver",
      "alex",
      "google uk english male",
      "google us english",
      "microsoft guy",
      "microsoft david",
      "microsoft natural",
      "natural",
    ],
  },
  {
    id: "expressive_storyteller",
    name: "Storyteller (Natural Enhanced)",
    avatar: "📖",
    gender: "auto",
    description: "Prioritizes highest-quality neural/enhanced natural voice on device",
    defaultPitch: 1.02,
    defaultRate: 0.90,
    voiceKeywords: [
      "enhanced",
      "natural",
      "premium",
      "samantha",
      "google us english",
      "serena",
      "karen",
    ],
  },
];

export function findBestVoiceForPersona(
  voices: SpeechSynthesisVoice[],
  personaId: string
): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Direct match by voiceURI or name
  const directMatch = voices.find((v) => v.voiceURI === personaId || v.name === personaId);
  if (directMatch) return directMatch;

  const persona = TEACHER_PERSONAS.find((p) => p.id === personaId) || TEACHER_PERSONAS[0];

  // 2. Filter English voices first
  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  const pool = englishVoices.length > 0 ? englishVoices : voices;

  // 3. Match against persona voice keywords
  for (const keyword of persona.voiceKeywords) {
    const matched = pool.find((v) => v.name.toLowerCase().includes(keyword));
    if (matched) return matched;
  }

  // 4. Fallback
  return pool[0] || voices[0] || null;
}

export function createTeacherUtterance(
  text: string,
  personaId: string = "female_teacher",
  rateMultiplier: number = 1.0,
  pitchOffset: number = 0
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const voices = window.speechSynthesis.getVoices();
    const voice = findBestVoiceForPersona(voices, personaId);
    if (voice) {
      utterance.voice = voice;
    }
  }

  const persona = TEACHER_PERSONAS.find((p) => p.id === personaId) || TEACHER_PERSONAS[0];

  utterance.pitch = Math.max(0.5, Math.min(2.0, persona.defaultPitch + pitchOffset));
  utterance.rate = Math.max(0.5, Math.min(2.0, persona.defaultRate * rateMultiplier));
  utterance.volume = 1.0;

  return utterance;
}

// Global references to prevent GC and handle stop cleanly
let activeAudioElement: HTMLAudioElement | null = null;
let globalUtteranceRef: SpeechSynthesisUtterance | null = null;

export function stopTeacherSpeech() {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch {}
    activeAudioElement = null;
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  globalUtteranceRef = null;
}

export function speakTeacherText(
  text: string,
  personaId: string = "female_teacher",
  rateMultiplier: number = 1.0,
  pitchOffset: number = 0,
  onEnd?: () => void,
  onError?: (e: unknown) => void
) {
  stopTeacherSpeech();

  if (typeof window === "undefined") {
    if (onEnd) onEnd();
    return;
  }

  const cleanText = text.trim();
  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  let fallbackTriggered = false;

  const triggerWebSpeechFallback = () => {
    if (fallbackTriggered) return;
    fallbackTriggered = true;
    activeAudioElement = null;

    if (!("speechSynthesis" in window)) {
      if (onError) onError("SpeechSynthesis not supported");
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = createTeacherUtterance(cleanText, personaId, rateMultiplier, pitchOffset);

      utterance.onend = () => {
        globalUtteranceRef = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        console.warn("WebSpeech fallback error:", err);
        globalUtteranceRef = null;
        if (onError) onError(err);
        if (onEnd) onEnd();
      };

      globalUtteranceRef = utterance;
      window.speechSynthesis.speak(utterance);

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.error("WebSpeech fallback exception:", err);
      if (onError) onError(err);
      if (onEnd) onEnd();
    }
  };

  // 1. Primary Engine: High-quality natural HTML5 Audio MP3 TTS via local server proxy
  try {
    const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;

    const audio = new Audio(ttsUrl);
    audio.playbackRate = Math.max(0.5, Math.min(2.0, rateMultiplier));
    activeAudioElement = audio;

    audio.onended = () => {
      activeAudioElement = null;
      if (onEnd) onEnd();
    };

    audio.onerror = (err) => {
      console.warn("HTML5 Audio TTS error, falling back to WebSpeech:", err);
      triggerWebSpeechFallback();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Audio play promise rejected, falling back to WebSpeech:", err);
        triggerWebSpeechFallback();
      });
    }
  } catch (err) {
    console.warn("HTML5 Audio init failed, falling back to WebSpeech:", err);
    triggerWebSpeechFallback();
  }
}



export function useTeacherVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<string>("female_teacher");
  const [pitchOffset, setPitchOffset] = useState<number>(0);
  const [speedRate, setSpeedRate] = useState<number>(1.0);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    updateVoices();

    if ("onvoiceschanged" in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if ("onvoiceschanged" in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  return {
    voices,
    selectedPersona,
    setSelectedPersona,
    pitchOffset,
    setPitchOffset,
    speedRate,
    setSpeedRate,
  };
}

