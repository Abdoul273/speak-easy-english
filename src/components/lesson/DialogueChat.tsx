import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Get unique speakers to assign sides
  const speakers = [...new Set(dialogues.map((d) => d.speaker))];
  const leftSpeaker = speakers[0]; // First speaker on left

  // Avatar colors for different speakers
  const avatarColors = [
    "bg-primary text-primary-foreground",
    "bg-secondary text-secondary-foreground",
    "bg-accent text-accent-foreground",
  ];

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
        <div>
          <p className="text-sm font-display font-semibold text-foreground">
            {speakers.join(" & ")}
          </p>
          <p className="text-xs text-muted-foreground">Conversation</p>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="bg-muted/30 border-x border-border px-4 py-4 max-h-[500px]">
        <div className="space-y-3">
          {dialogues.map((line, i) => {
            const isLeft = line.speaker === leftSpeaker;
            const speakerIdx = speakers.indexOf(line.speaker);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-end gap-2 ${isLeft ? "justify-start" : "justify-end"}`}
              >
                {/* Left avatar */}
                {isLeft && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatarColors[speakerIdx % avatarColors.length]}`}
                  >
                    {line.speaker.charAt(0)}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-3 space-y-1.5 ${
                    isLeft
                      ? `${gradient} text-primary-foreground rounded-2xl rounded-bl-md`
                      : "bg-card border border-border text-foreground rounded-2xl rounded-br-md"
                  }`}
                >
                  <p className="text-[11px] font-bold uppercase opacity-60">
                    {line.speaker}
                  </p>
                  <p className="text-[15px] font-medium leading-snug">
                    {line.en}
                  </p>
                  <p className={`text-[13px] leading-snug ${isLeft ? "opacity-75" : "text-muted-foreground"}`}>
                    {line.fr}
                  </p>
                </div>

                {/* Right avatar */}
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
      </ScrollArea>

      {/* Chat footer */}
      <div className="bg-card border border-border rounded-b-2xl px-4 py-3">
        <p className="text-xs text-muted-foreground text-center">
          💬 Lis la conversation à voix haute pour pratiquer !
        </p>
      </div>
    </motion.div>
  );
};

export default DialogueChat;
