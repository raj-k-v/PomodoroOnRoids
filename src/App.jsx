import { useEffect, useState } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { useParallax } from "./hooks/useParallax";

import ThemeSlider from "./components/ThemeSlider";
import ProgressRing from "./components/ProgressRing";
import SunMoon from "./components/SunMoon";
import ModeTabs from "./components/ModeTabs";
import Tasks from "./components/Tasks";
import SessionsCard from "./components/SessionsCard";
import VolumeSlider from "./components/VolumeSlider";
import BrownNoiseButton from "./components/BrownNoiseButton";

import { playClick } from "./utils/sound";

export default function App() {
  useParallax();

  const {
    time,
    running,
    start,
    pause,
    reset,
    session,
    mode,
    setMode,
    MODES
  } = usePomodoro();

  const [t, setT] = useState(
    Number(localStorage.getItem("themeT")) || 0
  );

  const [focusMode, setFocusMode] = useState(false);

  /* THEME + TASK TEXT COLOR */
  useEffect(() => {
    document.documentElement.style.setProperty("--t", t);

    const taskColor =
      t > 0.5
        ? "rgb(15, 23, 42)"
        : "rgb(255, 255, 255)";

    document.documentElement.style.setProperty(
      "--task-text",
      taskColor
    );

    localStorage.setItem("themeT", t);
  }, [t]);

  const progress = MODES[mode] ? time / MODES[mode] : 0;

  return (
    <div className="min-h-screen relative z-10">

      {/* LEFT — TASKS */}
      {!focusMode && (
        <aside className="absolute left-8 top-32 z-50">
          <Tasks isFocus={mode === "focus" && running} />
        </aside>
      )}

      {/* RIGHT — SESSIONS */}
      {!focusMode && (
        <aside className="absolute right-8 top-32 z-50">
          <SessionsCard />
        </aside>
      )}

      {/* TOP RIGHT — CONTROLS */}
      {!focusMode && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          <BrownNoiseButton />
          <VolumeSlider />

          <div className="glass-btn w-10 h-10 flex items-center justify-center">
            <SunMoon t={t} />
          </div>

          <ThemeSlider value={t} setValue={setT} />
        </div>
      )}

      {/* CENTER — TIMER */}
      <main className="h-screen flex flex-col items-center justify-center gap-6 relative z-20">

        {/* FOCUS MODE TOGGLE */}
        <button
          onClick={() => {
            playClick();
            setFocusMode(f => !f);
          }}
          className="
            glass-btn
            px-6 py-2
            text-sm font-semibold
            tracking-wide
            opacity-80 hover:opacity-100
            cursor-pointer
          "
        >
          {focusMode ? "Exit Focus Mode" : "Focus Mode"}
        </button>

        {/* MODE TABS */}
        {!focusMode && (
          <ModeTabs mode={mode} switchMode={setMode} />
        )}

        {/* TIMER */}
        <div className="relative my-8">
          <ProgressRing progress={progress} />

          <div
            className={`
              absolute inset-0 flex items-center justify-center
              font-light tracking-wide
              transition-all duration-500
              ${focusMode ? "text-7xl" : "text-5xl"}
            `}
          >
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </div>
        </div>

        {/* BROWN NOISE IN FOCUS MODE */}
        {focusMode && (
          <BrownNoiseButton compact />
        )}

        {/* BUTTONS */}
        <div className="flex gap-4">
          {!running ? (
            <button
              onClick={() => {
                playClick();
                start();
              }}
              className="glass-btn cursor-pointer w-36 py-4 text-lg"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => {
                playClick();
                pause();
              }}
              className="glass-btn cursor-pointer w-36 py-4 text-lg"
            >
              Pause
            </button>
          )}

          <button
            onClick={() => {
              playClick();
              reset();
            }}
            className="glass-btn cursor-pointer w-36 py-4 text-lg opacity-80"
          >
            Reset
          </button>
        </div>

        <p className="mt-4 opacity-70">
          #{session} — Time to focus
        </p>
      </main>
    </div>
  );
}
