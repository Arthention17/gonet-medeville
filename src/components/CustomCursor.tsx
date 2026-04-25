"use client";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    const over = () => setHovering(true);
    const out = () => setHovering(false);

    window.addEventListener("mousemove", move);

    // Track hover on interactive elements
    const observe = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", over);
        el.addEventListener("mouseleave", out);
      });
    };

    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className="cursor-ring"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${hovering ? 1.6 : 1})`,
        }}
      />
      <div
        className="cursor-dot"
        style={{ left: pos.x, top: pos.y }}
      />
    </>
  );
}
