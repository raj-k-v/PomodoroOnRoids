import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function toEmbed(url) {
  if (!url) return "";
  return url.includes("/embed/")
    ? url
    : url.replace("open.spotify.com/", "open.spotify.com/embed/");
}

export default function SpotifyCard({ focusMode }) {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("spotifyCollapsed") === "true"
  );

  const [y, setY] = useState(
    Number(localStorage.getItem("spotifyY") || 0)
  );

  const [url, setUrl] = useState(
    localStorage.getItem("spotifyUrl") ||
      "https://open.spotify.com/playlist/37i9dQZF1DX3PFzdbtx1Us"
  );

  useEffect(() => {
    localStorage.setItem("spotifyCollapsed", collapsed);
  }, [collapsed]);

  function saveUrl(v) {
    const embed = toEmbed(v.trim());
    setUrl(embed);
    localStorage.setItem("spotifyUrl", embed);
  }

  return (
    <motion.div
      drag="y"
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const nextY = y + info.offset.y;
        setY(nextY);
        localStorage.setItem("spotifyY", nextY);
      }}
      style={{ y }}
      animate={{
        opacity: focusMode ? 0.35 : 1,
        pointerEvents: focusMode ? "none" : "auto"
      }}
      transition={{ duration: 0.3 }}
      className="
        w-[320px]
        rounded-2xl
        backdrop-blur-xl
        bg-white/8
        border border-white/15
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        font-light
        tracking-wide
        overflow-hidden
      "
    >
      {/* HEADER — EXACTLY LIKE TASKS */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3
          className="
            text-xs uppercase tracking-widest
            font-semibold
            text-[var(--task-text)]
          "
        >
          Music
        </h3>

        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          className="opacity-60 hover:opacity-100 transition"
        >
          <svg
            className={`
              w-4 h-4
              transition-transform duration-300
              ${collapsed ? "-rotate-90" : "rotate-0"}
            `}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* BODY */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {/* PLAYER */}
            <iframe
              src={toEmbed(url)}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="opacity-90"
            />

            {/* INPUT */}
            <div className="px-3 py-3">
              <input
                defaultValue={url.replace("/embed/", "/")}
                onBlur={e => saveUrl(e.target.value)}
                placeholder="Paste Spotify link…"
                className="
                  w-full px-4 py-2 rounded-full text-sm
                  bg-white/10 border border-white/15
                  backdrop-blur-md outline-none
                  focus:bg-white/15
                  text-[var(--task-text)]
                  font-medium
                  placeholder:text-black/40
                "
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
