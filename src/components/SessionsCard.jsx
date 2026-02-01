import { useEffect, useState } from "react";

const TEMPLATE = [
  { label: "Pomodoro", mode: "focus" },
  { label: "Short Break", mode: "short" },
  { label: "Pomodoro", mode: "focus" },
  { label: "Short Break", mode: "short" },
  { label: "Pomodoro", mode: "focus" },
  { label: "Long Break", mode: "long" }
];

export default function SessionsCard({ mode, time, running }) {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("sessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSession, setActiveSession] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  /* -----------------------------
     Persist sessions
  ----------------------------- */
  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  /* -----------------------------
     Auto-complete step when timer ends
  ----------------------------- */
  useEffect(() => {
    if (time !== 0 || running) return;

    const session = sessions[activeSession];
    if (!session) return;

    const index = session.steps.findIndex(
      (step, i) =>
        !step.done && TEMPLATE[i].mode === mode
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

  /* -----------------------------
     Sync highlighted step with mode
  ----------------------------- */
  useEffect(() => {
    const session = sessions[activeSession];
    if (!session) {
      setActiveStep(-1);
      return;
    }

    const index = session.steps.findIndex(
      (step, i) =>
        !step.done && TEMPLATE[i].mode === mode
    );

    setActiveStep(index === -1 ? -1 : index);
  }, [mode, sessions, activeSession]);

  /* -----------------------------
     Actions
  ----------------------------- */
  function addSession() {
    setSessions(s => [
      ...s,
      {
        id: crypto.randomUUID(),
        steps: TEMPLATE.map(t => ({
          label: t.label,
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

  /* -----------------------------
     Render
  ----------------------------- */
  return (
    <div className="w-[300px] space-y-3">
      {/* FEATURE HEADING */}
      <div className="px-1">
        <h2 className="text-sm font-semibold tracking-wide opacity-85">
          Track your study time
        </h2>
        <p className="text-xs opacity-50">
          Sessions update automatically as you focus
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
          text-sm
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-xs uppercase tracking-widest font-semibold opacity-70">
            Sessions
          </h3>
          <button
            onClick={addSession}
            className="glass-btn px-3 py-1 text-xs font-semibold"
          >
            + Add
          </button>
        </div>

        {/* BODY */}
        <div className="px-3 pb-3 max-h-[420px] overflow-y-auto space-y-3">
          {sessions.map((session, sIndex) => {
            const completed = session.steps.every(s => s.done);
            const isActiveSession = sIndex === activeSession;

            return (
              <div
                key={session.id}
                onClick={() => setActiveSession(sIndex)}
                className={`
                  rounded-xl p-3 transition cursor-pointer
                  ${
                    completed
                      ? "bg-red-500/15 border border-red-400/40"
                      : isActiveSession
                      ? "bg-white/12 border border-white/25"
                      : "bg-white/8 border border-white/10"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold opacity-80">
                    Session {sIndex + 1}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteSession(sIndex);
                    }}
                    className="text-xs opacity-50 hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>

                <div className="space-y-2">
                  {session.steps.map((step, i) => {
                    const isActiveStep =
                      isActiveSession &&
                      i === activeStep &&
                      activeStep !== -1;

                    return (
                      <label
                        key={i}
                        className={`
                          flex items-center gap-2 px-2 py-1 rounded-md
                          cursor-pointer transition
                          ${
                            isActiveStep
                              ? "bg-white/15"
                              : ""
                          }
                          ${
                            step.done
                              ? "opacity-40 line-through"
                              : "opacity-85"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={step.done}
                          onChange={() =>
                            toggleStep(sIndex, i)
                          }
                          className="accent-white"
                        />
                        {step.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div className="opacity-50 italic px-1">
              No sessions yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
