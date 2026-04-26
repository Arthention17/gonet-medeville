"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Ambilight — subtle color glow on left/right edges of the viewport,
 * matching the current section's accent color.
 *
 * Sections set their accent via data-ambilight="#color".
 * The component observes which section is most visible and transitions
 * the edge glow to match.
 */
export default function Ambilight() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("rgba(158,130,90,0.06)");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const u = () => setEnabled(mq.matches);
    u(); mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const sections: { el: Element; color: string }[] = [];

    const gather = () => {
      sections.length = 0;
      document.querySelectorAll("[data-ambilight]").forEach(el => {
        sections.push({ el, color: el.getAttribute("data-ambilight") || "rgba(158,130,90,0.06)" });
      });
    };
    gather();

    const observer = new IntersectionObserver((entries) => {
      // Find the most visible section
      let best: { ratio: number; color: string } = { ratio: 0, color: "rgba(158,130,90,0.06)" };
      entries.forEach(e => {
        const sec = sections.find(s => s.el === e.target);
        if (sec && e.intersectionRatio > best.ratio) {
          best = { ratio: e.intersectionRatio, color: sec.color };
        }
      });
      if (best.ratio > 0.2) setColor(best.color);
    }, { threshold: [0.1, 0.3, 0.5, 0.7] });

    sections.forEach(s => observer.observe(s.el));

    const mo = new MutationObserver(() => { gather(); sections.forEach(s => observer.observe(s.el)); });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { observer.disconnect(); mo.disconnect(); };
  }, [enabled]);

  if (!enabled) return null;

  const gradientL = `linear-gradient(90deg, ${color} 0%, transparent 100%)`;
  const gradientR = `linear-gradient(270deg, ${color} 0%, transparent 100%)`;

  return (
    <>
      <div
        ref={leftRef}
        className="fixed top-0 left-0 w-[60px] h-full pointer-events-none z-[9990]"
        style={{ background: gradientL, transition: "background 1.5s ease", opacity: 0.7 }}
      />
      <div
        ref={rightRef}
        className="fixed top-0 right-0 w-[60px] h-full pointer-events-none z-[9990]"
        style={{ background: gradientR, transition: "background 1.5s ease", opacity: 0.7 }}
      />
    </>
  );
}
