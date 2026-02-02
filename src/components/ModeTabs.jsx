import { motion } from "framer-motion";
import { playClick } from "../utils/sound";

const modes = [
  { key: "focus", label: "Pomodoro" },
  { key: "short", label: "Short Break" },
  { key: "long", label: "Long Break" }
];

export default function ModeTabs({ mode, switchMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex items-center glass-btn px-2 py-2 rounded-full"
    >
      <div className="relative flex gap-1">
        {modes.map(m => {
          const active = mode === m.key;

          return (
            <motion.button
              key={m.key}
              onClick={() => {
                playClick();
                switchMode(m.key);
              }}
              whileHover={{ scale: active ? 1 : 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="
                relative px-4 py-2
                rounded-full text-sm font-semibold
                cursor-pointer
                z-10
                focus:outline-none
              "
            >
              {/* ACTIVE GLASS PILL */}
              {active && (
                <motion.span
                  layoutId="mode-pill"
                  className="
                    absolute inset-0 rounded-full
                    bg-white/20
                    shadow-[0_0_18px_rgba(120,140,255,0.35)]
                  "
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 42
                  }}
                />
              )}

              {/* LABEL */}
              <span
                className="relative transition-opacity"
                style={{
                  color: "var(--main-text)",
                  opacity: active ? 1 : 0.6
                }}
              >
                {m.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
