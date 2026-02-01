import { useEffect } from "react";

export function useParallax() {
  useEffect(() => {
    const onMove = e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;

      document.documentElement.style.setProperty("--cloud-x", `${x}px`);
      document.documentElement.style.setProperty("--cloud-y", `${y}px`);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}
