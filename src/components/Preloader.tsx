"use client";
import { useEffect, useState } from "react";

interface Props { onComplete: () => void; }

export default function Preloader({ onComplete }: Props) {
  const [pct, setPct] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    let current = 0;
    const iv = setInterval(() => {
      current += Math.random() * 4 + 2;
      if (current >= 100) { current = 100; clearInterval(iv); setTimeout(() => setHiding(true), 400); setTimeout(() => onComplete(), 1400); }
      setPct(Math.min(100, Math.floor(current)));
    }, 40);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center" style={{
      background: "var(--ink)",
      clipPath: hiding ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
      transition: hiding ? "clip-path 1.2s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
      pointerEvents: hiding ? "none" : "all",
    }}>
      <img src="/photos/logo.png" alt="" className="w-16 h-16 object-contain mb-8" style={{
        filter: "invert(1) brightness(1.5) sepia(1) hue-rotate(5deg) saturate(0.5)",
        opacity: pct > 5 ? 0.6 : 0,
        transition: "opacity 0.8s",
      }} />

      <div className="relative mb-6">
        <span className="font-serif text-[clamp(48px,10vw,80px)] font-light tracking-tighter leading-none text-white" style={{ opacity: pct > 5 ? 1 : 0, transition: "opacity 0.6s" }}>
          {String(pct).padStart(2, "0")}
        </span>
        <span className="absolute -right-5 top-1 font-mono text-[12px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>%</span>
      </div>

      <div className="w-40 h-[1px]" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="h-full transition-[width] duration-100" style={{ background: "var(--gold)", width: `${pct}%` }} />
      </div>

      <span className="font-mono text-[9px] tracking-[4px] uppercase mt-5 text-white/30" style={{ fontFamily: "'DM Mono', monospace" }}>
        Gonet-Medeville
      </span>
    </div>
  );
}
