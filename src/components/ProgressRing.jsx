import { motion } from "framer-motion";

export default function ProgressRing({ progress }) {
  const radius = 110;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-[260px] h-[260px]">
      <svg
        width="260"
        height="260"
        className="rotate-[-90deg]"
      >
        {/* TRACK */}
        <circle
          cx="130"
          cy="130"
          r={normalizedRadius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />

        {/* PROGRESS */}
        <motion.circle
          cx="130"
          cy="130"
          r={normalizedRadius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          animate={{
            strokeWidth: progress > 0.92 ? 6 : stroke
          }}
          transition={{
            strokeWidth: { duration: 0.4, ease: "easeOut" }
          }}
        />
      </svg>

      {/* GRADIENT */}
      <svg width="0" height="0">
        <defs>
          <linearGradient
            id="ringGradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="260"
            y2="260"
          >
            {/* Cool → Warm mapped to --t */}
            <stop
              offset="0%"
              stopColor={`color-mix(
                in oklab,
                #7c7cff calc((1 - var(--t)) * 100%),
                #f97316 calc(var(--t) * 100%)
              )`}
            />
            <stop
              offset="100%"
              stopColor={`color-mix(
                in oklab,
                #6366f1 calc((1 - var(--t)) * 100%),
                #ef4444 calc(var(--t) * 100%)
              )`}
            />
          </linearGradient>
        </defs>
      </svg>

      {/* BREATHING GLOW */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            "0 0 0 rgba(0,0,0,0)",
            "0 0 40px rgba(124,124,255,0.35)",
            "0 0 0 rgba(0,0,0,0)"
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}
