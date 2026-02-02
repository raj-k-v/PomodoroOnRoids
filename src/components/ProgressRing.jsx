import { motion } from "framer-motion";

export default function ProgressRing({ progress }) {
  const radius = 110;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-[260px] h-[260px]">

      {/* OUTER BREATHING GLOW — REFINED */}
<motion.div
  aria-hidden
  className="absolute inset-[-7px] rounded-full pointer-events-none"
  animate={{
    boxShadow: [
      "0 0 0px rgba(124,124,255,0)",
      "0 0 20px rgba(124,124,255,0.22)",
      "0 0 0px rgba(124,124,255,0)"
    ]
  }}
  transition={{
    duration: 5,
    ease: "easeInOut",
    repeat: Infinity
  }}
/>

      {/* SVG RING */}
      <svg
        width="260"
        height="260"
        className="rotate-[-90deg] relative z-10"
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
            strokeDashoffset: offset,
            strokeWidth: progress > 0.92 ? 6 : stroke
          }}
          transition={{
            strokeDashoffset: { duration: 0.4, ease: "easeOut" },
            strokeWidth: { duration: 0.4, ease: "easeOut" }
          }}
        />

        {/* GRADIENT */}
        <defs>
          <linearGradient
            id="ringGradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="260"
            y2="260"
          >
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
    </div>
  );
}
