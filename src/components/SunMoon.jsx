export default function SunMoon({ t }) {
  return (
    <div
      className="
        relative w-6 h-6
        transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]
        moon-glow
      "
      style={{
        transform: `rotate(${t * 180}deg)`
      }}
    >
      {/* SUN */}
      <div
        className="
          absolute inset-0
          rounded-full
          bg-yellow-300
          transition-all duration-700
        "
        style={{
          opacity: t,
          transform: `scale(${0.6 + t * 0.4})`
        }}
      />

      {/* MOON */}
      <div
        className="
          absolute inset-0
          rounded-full
          bg-slate-200
          transition-all duration-700
        "
        style={{
          opacity: 1 - t,
          boxShadow: "inset -6px 0 0 rgba(0,0,0,0.35)"
        }}
      />
    </div>
  );
}
