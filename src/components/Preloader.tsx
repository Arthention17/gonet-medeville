"use client";
import { useEffect, useState } from "react";

interface Props {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const [pct, setPct] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    let current = 0;
    const iv = setInterval(() => {
      current += Math.random() * 4 + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(iv);
        setTimeout(() => setHiding(true), 400);
        setTimeout(() => onComplete(), 1400);
      }
      setPct(Math.min(100, Math.floor(current)));
    }, 40);
    return () => clearInterval(iv);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "var(--bg)",
        clipPath: hiding ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: hiding
          ? "clip-path 1.2s cubic-bezier(0.76, 0, 0.24, 1)"
          : "none",
        pointerEvents: hiding ? "none" : "all",
      }}
    >
      <div className="relative mb-12">
        <span
          className="font-serif text-[clamp(60px,12vw,120px)] font-light tracking-tighter leading-none"
          style={{
            color: "var(--ink)",
            opacity: pct > 5 ? 1 : 0,
            transition: "opacity 0.6s",
          }}
        >
          {String(pct).padStart(2, "0")}
        </span>
        <span
          className="absolute -right-6 top-2 font-sans text-sm"
          style={{ color: "var(--gold)" }}
        >
          %
        </span>
      </div>

      <div className="w-48 h-[1px]" style={{ background: "rgba(0,0,0,0.08)" }}>
        <div
          className="h-full transition-[width] duration-100"
          style={{
            background: "var(--gold)",
            width: `${pct}%`,
          }}
        />
      </div>

      <span
        className="font-sans text-[10px] tracking-[6px] uppercase mt-6"
        style={{ color: "var(--ink2)" }}
      >
        Gonet-Médeville
      </span>
    </div>
  );
}
