import { useEffect, useState } from "react";

const themes = [
  {
    name: "Light",
    vars: {
      "--bg": "#f5f7fb",
      "--card": "#ffffff",
      "--accent": "#6366f1",
      "--text": "#0f172a",
    },
  },
  {
    name: "Dark",
    vars: {
      "--bg": "#0b1020",
      "--card": "#111827",
      "--accent": "#38bdf8",
      "--text": "#e5e7eb",
    },
  },
  {
    name: "Ocean",
    vars: {
      "--bg": "#0f172a",
      "--card": "#020617",
      "--accent": "#22d3ee",
      "--text": "#e0f2fe",
    },
  },
  {
    name: "Lavender",
    vars: {
      "--bg": "#faf5ff",
      "--card": "#f3e8ff",
      "--accent": "#a855f7",
      "--text": "#2e1065",
    },
  },
  {
    name: "Forest",
    vars: {
      "--bg": "#052e16",
      "--card": "#064e3b",
      "--accent": "#22c55e",
      "--text": "#ecfdf5",
    },
  },
];

export default function ThemeSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("theme-index");
    if (saved) setActive(Number(saved));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[active];

    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    localStorage.setItem("theme-index", active);
  }, [active]);

  return (
    <div className="relative flex items-center bg-black/5 rounded-full p-1 w-[420px]">
      {/* SLIDER INDICATOR */}
      <div
        className="absolute top-1 left-1 h-[36px] rounded-full bg-[var(--accent)] transition-all duration-300"
        style={{
          width: `calc(100% / ${themes.length})`,
          transform: `translateX(${active * 100}%)`,
        }}
      />

      {themes.map((theme, index) => (
        <button
          key={theme.name}
          onClick={() => setActive(index)}
          className={`relative z-10 flex-1 text-sm font-medium py-2 rounded-full
            ${
              active === index
                ? "text-white"
                : "text-[var(--text)] opacity-70"
            }`}
        >
          {theme.name}
        </button>
      ))}
    </div>
  );
}
