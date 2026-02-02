import { useEffect, useRef, useState } from "react";
import {
  getVolume,
  setVolume,
  toggleMute,
  isMuted
} from "../utils/sound";

export default function VolumeSlider() {
  const [volume, setVol] = useState(getVolume());
  const [muted, setMuted] = useState(isMuted());
  const lastVolume = useRef(volume || 0.6);

  useEffect(() => {
    setVolume(volume);
  }, [volume]);

  function handleMute() {
    toggleMute();
    setMuted(m => !m);

    if (!muted) {
      lastVolume.current = volume;
    } else {
      setVol(lastVolume.current || 0.6);
    }
  }

  return (
    <div className="glass-btn flex items-center gap-3 h-10 px-4">
      {/* Speaker */}
      <button
        onClick={handleMute}
        className="cursor-pointer text-white/70 hover:text-white transition"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {muted || volume === 0 ? (
            <>
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          ) : (
            <>
              <path d="M15 9a4 4 0 0 1 0 6" />
              <path d="M17.5 6.5a7 7 0 0 1 0 11" />
            </>
          )}
        </svg>
      </button>

      {/* Slider */}
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={muted ? 0 : volume}
        onChange={e => setVol(Number(e.target.value))}
        className="volume-slider w-[150px]"
        style={{ "--fill": `${(muted ? 0 : volume) * 100}%` }}
      />
    </div>
  );
}
