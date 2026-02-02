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
import SpotifyCard from "./components/SpotifyCard";

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

  const [t, setT] = useState(Number(localStorage.getItem("themeT")) || 0);
  const [focusMode, setFocusMode] = useState(false);

  /* TIMER EDIT */
  const [editing, setEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(
    Math.round(durations[mode] / 60)
  );

  useEffect(() => {
    setEditMinutes(Math.round(durations[mode] / 60));
  }, [mode, durations]);

  /* THEME → GLOBAL CSS VARS */
  useEffect(() => {
    document.documentElement.style.setProperty("--t", t);

    const mainText = t > 0.5
      ? "rgb(15,23,42)"
      : "rgb(255,255,255)";

    document.documentElement.style.setProperty("--task-text", mainText);
    document.documentElement.style.setProperty("--main-text", mainText);

    localStorage.setItem("themeT", t);
  }, [t]);

  function saveDuration() {
    const mins = Math.max(1, Number(editMinutes));
    setDurations(d => ({ ...d, [mode]: mins * 60 }));
    setEditing(false);
  }

  const progress = durations[mode] ? time / durations[mode] : 0;

  return (
    <div className="min-h-screen relative z-10 overflow-hidden">

      {/* FOCUS DIMMER */}
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

      {/* LEFT — TASKS + SPOTIFY */}
      {!focusMode && (
        <aside className="absolute left-8 top-32 z-50 space-y-4">
          <Tasks isFocus={mode === "focus" && running} />
          <SpotifyCard focusMode={focusMode} />
        </aside>
      )}

      {/* RIGHT — SESSIONS */}
      {!focusMode && (
        <aside className="absolute right-8 top-32 z-50">
          <SessionsCard
            mode={mode}
            time={time}
            running={running}
            durations={durations}
          />
        </aside>
      )}

      {/* TOP RIGHT */}
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
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
      </div>

      {/* CENTER */}
      <main className="h-screen flex flex-col items-center justify-start pt-32">

        {!focusMode && (
          <div className="mb-8">
            <ModeTabs mode={mode} switchMode={setMode} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {!focusMode ? (
            <motion.div key="normal" className="relative mb-10 text-center">
              <ProgressRing progress={progress} />

              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-5xl font-semibold"
                style={{ color: "var(--main-text)" }}
              >
                {editing ? (
                  <input
                    autoFocus
                    value={editMinutes}
                    onChange={e =>
                      setEditMinutes(e.target.value.replace(/\D/g, ""))
                    }
                    onBlur={saveDuration}
                    onKeyDown={e => e.key === "Enter" && saveDuration()}
                    className="w-24 bg-transparent outline-none text-center"
                    style={{ color: "var(--main-text)" }}
                  />
                ) : (
                  <>
                    {String(Math.floor(time / 60)).padStart(2, "0")}:
                    {String(time % 60).padStart(2, "0")}
                    {!running && (
                      <button
                        onClick={() => setEditing(true)}
                        className="mt-2 z-50 text-xs opacity-50 hover:opacity-100"
                        style={{ color: "var(--main-text)" }}
                      >
                        ✎ Edit duration
                      </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="focus"
              className="text-[5.5rem] font-light tracking-tight"
              style={{ color: "var(--main-text)" }}
            >
              {String(Math.floor(time / 60)).padStart(2, "0")}
              <span className="opacity-40">:</span>
              {String(time % 60).padStart(2, "0")}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-4 mb-4">
          {!running ? (
            <button
              onClick={() => { playClick(); start(); }}
              className="glass-btn w-36 py-4"
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => { playClick(); pause(); }}
              className="glass-btn w-36 py-4"
            >
              Pause
            </button>
          )}
          <button
            onClick={() => { playClick(); reset(); }}
            className="glass-btn w-36 py-4 opacity-80"
          >
            Reset
          </button>
        </div>

        <button
          onClick={() => { playClick(); setFocusMode(f => !f); }}
          className="glass-btn px-6 py-2 text-sm cursor-pointer"
        >
          {focusMode ? "Exit Focus Mode" : "Focus Mode"}
        </button>

        <p className="opacity-70 mt-3">
          #{session} — Time to focus
        </p>
      </main>
    </div>
  );
}
