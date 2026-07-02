import { Volume2, VolumeX } from "lucide-react";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { motion } from "framer-motion";

interface SpeakButtonProps {
  text: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "ghost";
  className?: string;
}

const SpeakButton = ({ text, size = "md", variant = "default", className = "" }: SpeakButtonProps) => {
  const { speak, speaking, currentText } = useTextToSpeech();

  const isActive = speaking && currentText === text;

  const sizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };
  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const variants = {
    default: isActive
      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
      : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20",
    ghost: isActive
      ? "bg-primary/20 text-primary"
      : "bg-transparent text-muted-foreground hover:text-primary hover:bg-primary/10",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.stopPropagation();
        speak(text);
      }}
      className={`${sizes[size]} shrink-0 rounded-full flex items-center justify-center transition-all ${variants[variant]} ${className}`}
      aria-label={isActive ? "Arrêter" : "Écouter"}
    >
      {isActive ? (
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <VolumeX className={iconSizes[size]} />
        </motion.div>
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
    </motion.button>
  );
};

export default SpeakButton;
