import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Check, X } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const VoiceSelector = () => {
  const [open, setOpen] = useState(false);
  const { voices, selectedVoiceName, setVoice, speak } = useTextToSpeech();

  const currentVoice = voices.find((v) => v.name === selectedVoiceName);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Mic className="w-3.5 h-3.5" />
        <span className="max-w-[120px] truncate">
          {currentVoice ? currentVoice.name : "Choisir une voix"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl w-full max-w-md max-h-[70vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-display font-bold text-foreground">
                  🎙️ Choisis ta voix
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-2">
                {voices.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground p-6">
                    Aucune voix anglaise détectée sur ton appareil.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {voices.map((voice) => {
                      const selected = voice.name === selectedVoiceName;
                      return (
                        <div
                          key={voice.name}
                          className={`flex items-center justify-between gap-2 p-3 rounded-xl transition-colors ${
                            selected
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-muted border border-transparent"
                          }`}
                        >
                          <button
                            onClick={() => {
                              setVoice(voice.name);
                            }}
                            className="flex-1 text-left"
                          >
                            <p className="font-medium text-sm text-foreground">
                              {voice.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {voice.lang}
                            </p>
                          </button>
                          <button
                            onClick={() => {
                              setVoice(voice.name);
                              setTimeout(() => speak("Hello, this is a test."), 100);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-muted hover:bg-muted-foreground/10 text-xs font-medium"
                          >
                            Tester
                          </button>
                          {selected && <Check className="w-4 h-4 text-primary" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceSelector;
