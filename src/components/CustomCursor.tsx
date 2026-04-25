"use client";
import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const target = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    const trailPos = Array.from({ length: 6 }, () => ({ x: -100, y: -100 }));

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate(${target.x}px, ${target.y}px)`;
      }
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.18;
      ringPos.y += (target.y - ringPos.y) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;

      // trail: each element lags more than the previous
      let prev = ringPos;
      for (let i = 0; i < trailPos.length; i++) {
        const t = trailPos[i];
        const k = 0.18 - i * 0.022;
        t.x += (prev.x - t.x) * k;
        t.y += (prev.y - t.y) * k;
        const el = trail.current[i];
        if (el) el.style.transform = `translate(${t.x}px, ${t.y}px)`;
        prev = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const enter = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      setHovering(true);
      const lbl = el.getAttribute("data-cursor") || "";
      setLabel(lbl);
    };
    const leave = () => {
      setHovering(false);
      setLabel("");
    };

    const observe = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
        el.removeEventListener("mouseenter", enter as EventListener);
        el.removeEventListener("mouseleave", leave as EventListener);
        el.addEventListener("mouseenter", enter as EventListener);
        el.addEventListener("mouseleave", leave as EventListener);
      });
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      mo.disconnect();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* SVG goo filter */}
      <svg className="fixed pointer-events-none" width="0" height="0" aria-hidden>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="b" />
            <feColorMatrix in="b" type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 18 -7
            " />
          </filter>
        </defs>
      </svg>

      {/* Liquid trail layer (filtered) */}
      <div className="fixed inset-0 pointer-events-none z-[9997]" style={{ filter: "url(#goo)" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) trail.current[i] = el;
            }}
            className="absolute top-0 left-0 rounded-full"
            style={{
              width: 26 - i * 2,
              height: 26 - i * 2,
              marginLeft: -(26 - i * 2) / 2,
              marginTop: -(26 - i * 2) / 2,
              background: "rgba(91,26,46,0.55)",
              willChange: "transform",
            }}
          />
        ))}
      </div>

      {/* Ring */}
      <div
        ref={ring}
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          width: hovering ? 110 : 36,
          height: hovering ? 110 : 36,
          marginLeft: hovering ? -55 : -18,
          marginTop: hovering ? -55 : -18,
          border: "1px solid var(--gold)",
          borderRadius: "50%",
          mixBlendMode: "difference",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1), height 0.5s cubic-bezier(0.16,1,0.3,1), margin 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[9px] tracking-[2px]"
          style={{
            fontFamily: "'DM Mono', monospace",
            color: "var(--gold)",
            opacity: label ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          {label.toUpperCase()}
        </span>
      </div>

      {/* Hard dot */}
      <div
        ref={dot}
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full"
        style={{
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          background: "var(--gold)",
        }}
      />
    </>
  );
}
