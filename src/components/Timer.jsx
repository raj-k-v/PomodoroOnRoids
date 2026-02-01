const DURATIONS = {
  focus: 25 * 60,
  break: 5 * 60,
  long: 15 * 60,
};

export default function Controls({ running, setRunning, setTime, mode }) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => setRunning((r) => !r)}
        className="px-6 py-2 rounded-full bg-[var(--accent)] text-white"
      >
        {running ? "Pause" : "Start"}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setTime(DURATIONS[mode]);
        }}
        className="px-6 py-2 rounded-full bg-black/10"
      >
        Reset
      </button>
    </div>
  );
}
