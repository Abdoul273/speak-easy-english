import { useState, useEffect, useCallback, useRef } from "react";

const VOICE_STORAGE_KEY = "speakusa-voice";

export function useTextToSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>(
    () => localStorage.getItem(VOICE_STORAGE_KEY) || ""
  );
  const [speaking, setSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      // Filter for English voices (US preferred)
      const englishVoices = all.filter((v) => v.lang.startsWith("en"));
      setVoices(englishVoices);

      // Auto-select best default voice if none selected
      if (!selectedVoiceName && englishVoices.length > 0) {
        const preferred =
          englishVoices.find((v) => v.lang === "en-US" && v.name.toLowerCase().includes("samantha")) ||
          englishVoices.find((v) => v.lang === "en-US" && v.name.toLowerCase().includes("google")) ||
          englishVoices.find((v) => v.lang === "en-US" && !v.name.toLowerCase().includes("compact")) ||
          englishVoices.find((v) => v.lang === "en-US") ||
          englishVoices[0];
        if (preferred) {
          setSelectedVoiceName(preferred.name);
          localStorage.setItem(VOICE_STORAGE_KEY, preferred.name);
        }
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setVoice = useCallback((name: string) => {
    setSelectedVoiceName(name);
    localStorage.setItem(VOICE_STORAGE_KEY, name);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!text) return;
      // If clicking on same text while speaking → stop
      if (speaking && currentText === text) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setCurrentText(null);
        return;
      }
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.name === selectedVoiceName);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setSpeaking(true);
        setCurrentText(text);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setCurrentText(null);
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setCurrentText(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voices, selectedVoiceName, speaking, currentText]
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setCurrentText(null);
  }, []);

  return {
    voices,
    selectedVoiceName,
    setVoice,
    speak,
    stop,
    speaking,
    currentText,
  };
}
