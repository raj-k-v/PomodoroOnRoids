import { useRef, useState } from "react";

export default function ThemeSlider({ value, setValue }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);

  const updateValueFromClientX = clientX => {
    const rect = ref.current.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    setValue(x / rect.width);
  };

  const onMouseDown = e => {
    setDragging(true);
    updateValueFromClientX(e.clientX);
  };

  const onMouseMove = e => {
    if (!dragging) return;
    updateValueFromClientX(e.clientX);
  };

  const stopDrag = () => setDragging(false);

  const onTouchStart = e => {
    setDragging(true);
    updateValueFromClientX(e.touches[0].clientX);
  };

  const onTouchMove = e => {
    if (!dragging) return;
    updateValueFromClientX(e.touches[0].clientX);
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={stopDrag}
      className="
        relative w-[200px] h-10
        glass-btn
        cursor-grab
        active:cursor-grabbing
        overflow-hidden
        select-none
      "
    >
      {/* ticks */}
      <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-px h-3 bg-white/40" />
        ))}
      </div>

      {/* thumb */}
      <div
        className="
          absolute top-1/2
          w-6 h-6
          rounded-full
          bg-white
          shadow-lg
          -translate-y-1/2
          transition-[left]
          duration-200
          ease-[cubic-bezier(.22,1,.36,1)]
        "
        style={{
          left: `calc(${value * 100}% - 14px)`
        }}
      >
        <div
          className="
            absolute inset-0
            rounded-full
            bg-[var(--primary)]
            opacity-30
            blur-md
          "
        />
      </div>
    </div>
  );
}
