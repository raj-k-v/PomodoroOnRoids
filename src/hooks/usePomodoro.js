import { useEffect, useRef, useState } from "react";
import { playComplete } from "../utils/sound";

const DEFAULT_DURATIONS = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

export function usePomodoro() {
  const [mode, setMode] = useState("focus");
  const [running, setRunning] = useState(false);

  const [durations, setDurations] = useState(() => {
    const saved = localStorage.getItem("durations");
    return saved ? JSON.parse(saved) : DEFAULT_DURATIONS;
  });

  const [time, setTime] = useState(durations.focus);

  const [pomodoroCount, setPomodoroCount] = useState(1);
  const [session, setSession] = useState(1);

  /* 🔒 prevent double-complete sound */
  const playedRef = useRef(false);

  /* persist durations */
  useEffect(() => {
    localStorage.setItem("durations", JSON.stringify(durations));
  }, [durations]);

  /* ticking */
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTime(t => (t <= 1 ? 0 : t - 1));
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  /* 🔔 when timer ends */
  useEffect(() => {
    if (time > 0) return;

    // play completion sound ONCE
    if (!playedRef.current) {
      playComplete();
      playedRef.current = true;
    }

    setRunning(false);

    if (mode === "focus") {
      if (pomodoroCount % 3 === 0) {
        setMode("long");
      } else {
        setMode("short");
      }
    } else {
      if (mode === "long") {
        setSession(s => s + 1);
        setPomodoroCount(1);
      } else {
        setPomodoroCount(c => c + 1);
      }
      setMode("focus");
    }
  }, [time]);

  /* sync timer when mode OR duration changes */
  useEffect(() => {
    setTime(durations[mode]);
    setRunning(false);
    playedRef.current = false; // reset sound lock
  }, [mode, durations]);

  function start() {
    playedRef.current = false;
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    playedRef.current = false;
    setRunning(false);
    setTime(durations[mode]);
  }

  return {
    time,
    setTime,
    running,
    start,
    pause,
    reset,
    mode,
    setMode,
    session,
    pomodoroCount,
    durations,
    setDurations
  };
}
