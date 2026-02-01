import { motion } from "framer-motion";
import { playClick } from "../utils/sound";

const modes = [
  { key: "focus", label: "Pomodoro" },
  { key: "short", label: "Short Break" },
  { key: "long", label: "Long Break" }
];

export default function ModeTabs({ mode, switchMode }) {
  return (
    <div className="flex items-center glass-btn px-2 py-2 rounded-full active:scale-100">
      <div className="relative flex gap-1">
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => switchMode(m.key)}
            className="
              relative px-4 py-2
              rounded-full text-sm font-semibold
              cursor-pointer
              z-10
            "
          >
            {/* Animated pill */}
            {mode === m.key && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-white/20"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40
                }}
              />
            )}

            <span
              className={`relative transition ${
                mode === m.key
                  ? "opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              {m.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
