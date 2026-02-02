import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TEMPLATE = [
  { label: "Pomodoro", mode: "focus" },
  { label: "Short Break", mode: "short" },
  { label: "Pomodoro", mode: "focus" },
  { label: "Short Break", mode: "short" },
  { label: "Pomodoro", mode: "focus" },
  { label: "Long Break", mode: "long" }
];

export default function SessionsCard({ mode, time, running, durations }) {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSession, setActiveSession] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  /* auto complete step */
  useEffect(() => {
    if (time !== 0 || running) return;

    const session = sessions[activeSession];
    if (!session) return;

    const index = session.steps.findIndex(
      (step, i) => !step.done && TEMPLATE[i].mode === mode
    );

    if (index === -1) return;

    setSessions(s =>
      s.map((sess, sIndex) =>
        sIndex !== activeSession
          ? sess
          : {
              ...sess,
              steps: sess.steps.map((st, i) =>
                i === index ? { ...st, done: true } : st
              )
            }
      )
    );
  }, [time, running]);

  /* sync highlight */
  useEffect(() => {
    const session = sessions[activeSession];
    if (!session) return setActiveStep(-1);

    const index = session.steps.findIndex(
      (step, i) => !step.done && TEMPLATE[i].mode === mode
    );

    setActiveStep(index);
  }, [mode, sessions, activeSession]);

  function addSession() {
    setSessions(s => [
      ...s,
      {
        id: crypto.randomUUID(),
        steps: TEMPLATE.map(t => ({
          label: t.label,
          duration: durations[t.mode],
          done: false
        }))
      }
    ]);
  }

  function deleteSession(index) {
    setSessions(s => s.filter((_, i) => i !== index));
    if (activeSession === index) {
      setActiveSession(0);
      setActiveStep(-1);
    }
  }

  function toggleStep(sIndex, stepIndex) {
    setSessions(s =>
      s.map((session, i) =>
        i !== sIndex
          ? session
          : {
              ...session,
              steps: session.steps.map((st, j) =>
                j === stepIndex
                  ? { ...st, done: !st.done }
                  : st
              )
            }
      )
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-[320px] space-y-3"
    >
      {/* HEADER TEXT */}
      <div className="px-1">
        <h2
          className="text-sm font-semibold"
          style={{ color: "var(--task-text)" }}
        >
          Track your study time
        </h2>
        <p className="text-xs opacity-60">
          Sessions update automatically
        </p>
      </div>

      {/* CARD */}
      <div
        className="
          rounded-2xl
          backdrop-blur-xl
          bg-white/8
          border border-white/15
          shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          overflow-hidden
        "
      >
        {/* CARD HEADER */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-xs uppercase tracking-widest opacity-70">
            Sessions
          </h3>
          <button
            onClick={addSession}
            className="glass-btn px-3 py-1 text-xs"
          >
            + Add
          </button>
        </div>

        {/* BODY */}
        <div className="px-3 pb-3 space-y-3 max-h-[420px] overflow-y-auto">
          {sessions.map((session, sIndex) => (
            <div
              key={session.id}
              className="
                rounded-xl
                bg-white/10
                border border-white/15
                p-3
              "
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className="font-semibold"
                  style={{ color: "var(--task-text)" }}
                >
                  Session {sIndex + 1}
                </span>
                <button
                  onClick={() => deleteSession(sIndex)}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-1.5">
                {session.steps.map((step, i) => {
                  const active =
                    sIndex === activeSession && i === activeStep;

                  return (
                    <motion.label
                      key={i}
                      layout
                      initial={false}
                      animate={{
                        backgroundColor: active
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(255,255,255,0)"
                      }}
                      className={`
                        flex items-center gap-2
                        px-2 py-1.5
                        rounded-md
                        cursor-pointer
                        transition
                        ${step.done ? "opacity-40 line-through" : ""}
                      `}
                      style={{ color: "var(--task-text)" }}
                    >
                      <input
                        type="checkbox"
                        checked={step.done}
                        onChange={() => toggleStep(sIndex, i)}
                        className="accent-white"
                      />
                      {step.label} ·{" "}
                      {Math.round(step.duration / 60)} min
                    </motion.label>
                  );
                })}
              </div>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="opacity-50 italic px-1">
              No sessions yet
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
