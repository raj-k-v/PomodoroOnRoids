import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    durations,
    setDurations
  } = usePomodoro();

  const [t, setT] = useState(
    Number(localStorage.getItem("themeT")) || 0
  );

  const [focusMode, setFocusMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(
    Math.round(durations[mode] / 60)
  );

  /* sync input when mode changes */
  useEffect(() => {
    setEditMinutes(Math.round(durations[mode] / 60));
  }, [mode, durations]);

  /* THEME */
  useEffect(() => {
    document.documentElement.style.setProperty("--t", t);
    document.documentElement.style.setProperty(
      "--task-text",
      t > 0.5 ? "rgb(15,23,42)" : "rgb(255,255,255)"
    );
    localStorage.setItem("themeT", t);
  }, [t]);

  const progress =
    durations[mode] ? time / durations[mode] : 0;

  function saveDuration() {
    const mins = Math.max(1, Number(editMinutes));
    setDurations(d => ({
      ...d,
      [mode]: mins * 60
    }));
    setEditing(false);
  }

  return (
    <div className="min-h-screen relative z-10 overflow-hidden">
      {/* FOCUS MODE DIMMER */}
<AnimatePresence>
  {focusMode && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.55 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-0 bg-black/30 z-30 pointer-events-none"
    />
  )}
</AnimatePresence>


      {/* LEFT — TASKS */}
      <AnimatePresence>
        {!focusMode && (
<motion.aside
  initial={{ opacity: 0, x: -30 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -60 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
  className="absolute left-8 top-32 z-50"
>

            <Tasks isFocus={mode === "focus" && running} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* RIGHT — SESSIONS */}
      <AnimatePresence>
        {!focusMode && (
<motion.aside
  initial={{ opacity: 0, x: 30 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: 60 }}
  transition={{ duration: 0.45, ease: "easeOut" }}
  className="absolute right-8 top-32 z-50"
>

            <SessionsCard
              mode={mode}
              time={time}
              running={running}
              durations={durations}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* TOP RIGHT — CONTROLS (Brown Noise ALWAYS visible) */}
<motion.div
  animate={{
    opacity: focusMode ? 0.4 : 1,
    scale: focusMode ? 0.94 : 1
  }}
  transition={{ duration: 0.4 }}
  className="absolute top-6 right-6 z-50 flex items-center gap-3"
>

        <BrownNoiseButton />
        <VolumeSlider />

        {!focusMode && (
          <>
            <div className="glass-btn w-10 h-10 flex items-center justify-center">
              <SunMoon t={t} />
            </div>
            <ThemeSlider value={t} setValue={setT} />
          </>
        )}
      </motion.div>

      {/* CENTER */}
      <main className="h-screen flex flex-col items-center justify-start pt-32 relative z-20">

        {!focusMode && (
          <div className="mb-8">
            <ModeTabs mode={mode} switchMode={setMode} />
          </div>
        )}

        {/* TIMER */}
<AnimatePresence mode="wait">
  {!focusMode ? (
    /* NORMAL MODE — RING + TIMER */
    <motion.div
      key="normal"
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="relative mb-10 text-center"
    >
      <ProgressRing progress={progress} />

      <div
        className="
          absolute inset-0 flex flex-col items-center justify-center
          font-semibold tracking-wide text-5xl
        "
      >
        {editing ? (
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            value={editMinutes}
            onChange={e =>
              setEditMinutes(e.target.value.replace(/\D/g, ""))
            }
            onBlur={saveDuration}
            onKeyDown={e => e.key === "Enter" && saveDuration()}
            className="w-24 text-center bg-transparent outline-none"
            style={{
              MozAppearance: "textfield",
              WebkitAppearance: "none"
            }}
          />
        ) : (
          <>
            {String(Math.floor(time / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
            {!running && (
              <button
                onClick={() => {
                  playClick();
                  setEditing(true);
                }}
                className="mt-2 z-50 text-xs opacity-50 hover:opacity-100 cursor-pointer"
              >
                ✎ Edit duration
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  ) : (
    /* FOCUS MODE — CLEAN, SEXY, NO RING */
    <motion.div
      key="focus"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-14 text-center"
    >
      <div className="text-[5.5rem] font-light tracking-tight">
        {String(Math.floor(time / 60)).padStart(2, "0")}
        <span className="opacity-40">:</span>
        {String(time % 60).padStart(2, "0")}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6 }}
        className="mt-3 text-xs tracking-widest uppercase"
      >
        stay focused
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        {/* BUTTONS */}
        <div className="flex gap-4 mb-4">
          {!running ? (
            <button onClick={() => { playClick(); start(); }} className="glass-btn w-36 py-4 text-lg">
              Start
            </button>
          ) : (
            <button onClick={() => { playClick(); pause(); }} className="glass-btn w-36 py-4 text-lg">
              Pause
            </button>
          )}

          <button onClick={() => { playClick(); reset(); }} className="glass-btn w-36 py-4 text-lg opacity-80">
            Reset
          </button>
        </div>

        {/* FOCUS MODE BUTTON */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playClick();
            setFocusMode(f => !f);
          }}
          className="glass-btn px-6 py-2 text-sm font-semibold opacity-80 hover:opacity-100 cursor-pointer mb-4"
        >
          {focusMode ? "Exit Focus Mode" : "Focus Mode"}
        </motion.button>

        <p className="opacity-70">
          #{session} — Time to focus
        </p>
      </main>
    </div>
  );
}
