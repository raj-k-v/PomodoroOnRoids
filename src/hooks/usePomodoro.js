import { useEffect, useState } from "react";

export const MODES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60
};

export function usePomodoro() {
  const [mode, setMode] = useState("focus");
  const [time, setTime] = useState(MODES.focus);
  const [running, setRunning] = useState(false);

  const [pomodoroCount, setPomodoroCount] = useState(1);
  const [session, setSession] = useState(1);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (time > 0) return;

    setRunning(false);

    if (mode === "focus") {
      // After each pomodoro → short or long break
      if (pomodoroCount % 3 === 0) {
        setMode("long");
      } else {
        setMode("short");
      }
    } else {
      // After break → next pomodoro
      if (mode === "long") {
        setSession(s => s + 1); // session completes after long break
        setPomodoroCount(1);
      } else {
        setPomodoroCount(c => c + 1);
      }
      setMode("focus");
    }
  }, [time]);

  useEffect(() => {
    setTime(MODES[mode]);
    setRunning(false);
  }, [mode]);

  function start() {
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setTime(MODES[mode]);
  }

  return {
    time,
    running,
    start,
    pause,
    reset,
    mode,
    setMode,
    session,
    pomodoroCount,
    MODES
  };
}
