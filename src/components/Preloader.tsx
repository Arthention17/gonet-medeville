"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

/**
 * Preloader: an elegant wine glass that fills with red wine.
 * - Glass is a single tuned SVG (bowl + stem + base).
 * - Wine fill is a clipped rect whose y rises over ~2.4s.
 * - Wine surface is an animated sine path for a live ripple.
 * - When the bowl is full, a curtain clip-path slides up to reveal the page.
 */
export default function Preloader({ onComplete }: Props) {
  const [hiding, setHiding] = useState(false);
  const fillRef = useRef<SVGRectElement>(null);
  const surfaceRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 2400;
    let raf = 0;

    const animate = (t: number) => {
      const elapsed = t - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      // y: 100 (empty) -> 32 (filled to near rim)
      const yTop = 100 - eased * 68;
      if (fillRef.current) fillRef.current.setAttribute("y", String(yTop));

      // surface ripple — animated sine
      if (surfaceRef.current) {
        const w = 70;
        const cx = 60;
        const left = cx - w / 2;
        const phase = elapsed / 220;
        const amp = 1.4 + Math.sin(elapsed / 600) * 0.3;
        let d = `M ${left} ${yTop} `;
        for (let i = 0; i <= 30; i++) {
          const t2 = i / 30;
          const x = left + t2 * w;
          const y = yTop + Math.sin(t2 * Math.PI * 5 + phase) * amp;
          d += `L ${x.toFixed(2)} ${y.toFixed(2)} `;
        }
        surfaceRef.current.setAttribute("d", d);
      }

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setTimeout(() => setHiding(true), 350);
        setTimeout(() => onComplete(), 1450);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: "var(--bg)",
        clipPath: hiding ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
        transition: hiding ? "clip-path 1.2s cubic-bezier(0.76, 0, 0.24, 1)" : "none",
        pointerEvents: hiding ? "none" : "all",
      }}
    >
      <svg viewBox="0 0 120 220" width="180" height="330" className="mb-10" aria-hidden>
        <defs>
          <clipPath id="bowlInterior">
            <path d="M 27 24 Q 27 100 60 110 Q 93 100 93 24 Z" />
          </clipPath>
          <linearGradient id="wineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d1e36" />
            <stop offset="60%" stopColor="#4a0d1a" />
            <stop offset="100%" stopColor="#2a0510" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>
        </defs>

        {/* Wine fill clipped to bowl shape */}
        <g clipPath="url(#bowlInterior)">
          <rect ref={fillRef} x="20" y="100" width="80" height="120" fill="url(#wineGrad)" />
          <path ref={surfaceRef} d="M 25 100 L 95 100" fill="none" stroke="rgba(255,210,180,0.28)" strokeWidth="0.7" />
        </g>

        {/* Glass outline (bowl + rim) */}
        <path d="M 27 24 Q 27 100 60 110 Q 93 100 93 24" fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.85" />
        <ellipse cx="60" cy="24" rx="33" ry="3.2" fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.55" />
        <path d="M 31 30 Q 30 80 56 105" fill="none" stroke="url(#glassGrad)" strokeWidth="2" opacity="0.7" />

        {/* Stem */}
        <line x1="60" y1="110" x2="60" y2="180" stroke="var(--ink)" strokeWidth="0.9" opacity="0.7" />

        {/* Base */}
        <ellipse cx="60" cy="180" rx="22" ry="2.2" fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.45" />
        <ellipse cx="60" cy="184" rx="22" ry="2.6" fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.75" />
      </svg>

      <span className="font-serif tracking-[6px] mb-2 font-light" style={{ color: "var(--ink)", fontSize: "clamp(20px, 2.2vw, 26px)" }}>
        GONET <span className="italic" style={{ color: "var(--gold)" }}>·</span> MEDEVILLE
      </span>
      <span className="font-mono text-[10px] tracking-[4px] uppercase" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>
        MDCCX
      </span>
    </div>
  );
}
