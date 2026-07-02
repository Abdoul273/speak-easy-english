import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SpeakButton from "@/components/SpeakButton";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface DialogueLine {
  speaker: string;
  en: string;
  fr: string;
}

interface DialogueChatProps {
  dialogues: DialogueLine[];
  gradient: string;
}

const DialogueChat = ({ dialogues, gradient }: DialogueChatProps) => {
  const speakers = [...new Set(dialogues.map((d) => d.speaker))];
  const leftSpeaker = speakers[0];
  const { speak } = useTextToSpeech();

  const avatarColors = [
    "bg-primary text-primary-foreground",
    "bg-secondary text-secondary-foreground",
    "bg-accent text-accent-foreground",
  ];

  const playAll = async () => {
    for (const line of dialogues) {
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(line.en);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }
  };

  return (
    <motion.div
      key="dialogue"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-2"
    >
      {/* Chat header */}
      <div className="bg-card border border-border rounded-t-2xl px-4 py-3 flex items-center gap-3">
        <div className="flex -space-x-2">
          {speakers.map((speaker, i) => (
            <div
              key={speaker}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-card ${avatarColors[i % avatarColors.length]}`}
            >
              {speaker.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-semibold text-foreground truncate">
            {speakers.join(" & ")}
          </p>
          <p className="text-xs text-muted-foreground">Conversation</p>
        </div>
        <button
          onClick={playAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Play className="w-3.5 h-3.5" /> Tout écouter
        </button>
      </div>

      {/* Chat messages — regular div with overflow-y-auto so page scroll works */}
      <div className="bg-muted/30 border-x border-border px-4 py-4">
        <div className="space-y-3">
          {dialogues.map((line, i) => {
            const isLeft = line.speaker === leftSpeaker;
            const speakerIdx = speakers.indexOf(line.speaker);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5) }}
                className={`flex items-end gap-2 ${isLeft ? "justify-start" : "justify-end"}`}
              >
                {isLeft && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[speakerIdx % avatarColors.length]}`}
                  >
                    {line.speaker.charAt(0)}
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 space-y-1.5 ${
                    isLeft
                      ? `${gradient} text-primary-foreground rounded-2xl rounded-bl-md`
                      : "bg-card border border-border text-foreground rounded-2xl rounded-br-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase opacity-60">
                      {line.speaker}
                    </p>
                    <SpeakButton text={line.en} size="sm" variant="ghost" className={isLeft ? "text-primary-foreground/80" : ""} />
                  </div>
                  <p className="text-[15px] font-medium leading-snug">{line.en}</p>
                  <p className={`text-[13px] leading-snug ${isLeft ? "opacity-75" : "text-muted-foreground"}`}>
                    {line.fr}
                  </p>
                </div>

                {!isLeft && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[speakerIdx % avatarColors.length]}`}
                  >
                    {line.speaker.charAt(0)}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="bg-card border border-border rounded-b-2xl px-4 py-3">
        <p className="text-xs text-muted-foreground text-center">
          💬 Appuie sur 🔊 pour écouter chaque phrase
        </p>
      </div>
    </motion.div>
  );
};

export default DialogueChat;
