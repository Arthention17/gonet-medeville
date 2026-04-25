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
      <img src="/photos/logo-white.png" alt="" className="w-20 h-20 object-contain mb-8" style={{
        opacity: pct > 5 ? 0.7 : 0, transition: "opacity 0.8s",
      }} />
      <div className="w-40 h-[1px]" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full transition-[width] duration-100" style={{ background: "var(--gold)", width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[9px] tracking-[4px] uppercase mt-5 text-white/25" style={{ fontFamily: "'DM Mono', monospace" }}>
        Gonet-Medeville
      </span>
    </div>
  );
}
