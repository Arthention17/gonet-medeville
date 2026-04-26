"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props { onComplete: () => void; }

export default function Preloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<SVGPathElement>(null);
  const wineRef = useRef<SVGPathElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const glass = glassRef.current;
    const wine = wineRef.current;
    const logo = logoRef.current;
    const text = textRef.current;
    const curtain = curtainRef.current;
    const root = rootRef.current;
    if (!glass || !wine || !logo || !text || !curtain || !root) return;

    // Glass stroke draw
    const glassLen = glass.getTotalLength();
    gsap.set(glass, { strokeDasharray: glassLen, strokeDashoffset: glassLen });
    gsap.set(wine, { scaleY: 0, transformOrigin: "center bottom" });
    gsap.set(logo, { opacity: 0, scale: 0.8 });
    gsap.set(text, { opacity: 0, y: 15 });

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        setTimeout(onComplete, 100);
      },
    });

    // Phase 1: Zalto glass draws itself (stroke animation)
    tl.to(glass, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.3)

    // Phase 2: Wine fills the glass from bottom
      .to(wine, { scaleY: 1, duration: 1.0, ease: "power2.out" }, 1.8)

    // Phase 3: Glass + wine fade, logo appears
      .to([glass, wine], { opacity: 0, duration: 0.5 }, 3.2)
      .to(logo, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }, 3.4)
      .to(text, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 3.8)

    // Phase 4: Pause
      .to({}, { duration: 0.6 }, 4.4)

    // Phase 5: Curtain lifts
      .to(curtain, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, 5.0);

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "#0E0E0C",
        pointerEvents: done ? "none" : "auto",
        opacity: done ? 0 : 1,
        transition: "opacity 0.5s ease 0.2s",
      }}
    >
      {/* Zalto Bordeaux glass SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 520" width="120" height="312" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glass outline — Zalto Bordeaux shape */}
          <path
            ref={glassRef}
            d="
              M 68 495 L 132 495
              M 100 495 L 100 350
              M 100 350 C 60 340, 38 280, 35 220
              C 32 160, 42 100, 55 65
              C 62 45, 72 32, 82 26
              C 90 22, 95 20, 100 20
              C 105 20, 110 22, 118 26
              C 128 32, 138 45, 145 65
              C 158 100, 168 160, 165 220
              C 162 280, 140 340, 100 350
            "
            stroke="var(--gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.8"
          />
          {/* Wine fill shape — inside the bowl */}
          <path
            ref={wineRef}
            d="
              M 42 240 C 44 200, 50 170, 60 145
              C 70 125, 80 115, 100 112
              C 120 115, 130 125, 140 145
              C 150 170, 156 200, 158 240
              C 155 280, 140 320, 100 340
              C 60 320, 45 280, 42 240 Z
            "
            fill="rgba(180,80,60,0.6)"
            opacity="1"
          />
        </svg>
      </div>

      {/* Logo reveal */}
      <img
        ref={logoRef}
        src="/logo.png"
        alt="Gonet-Medeville"
        width={100}
        height={100}
        className="absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
        style={{ filter: "invert(1) brightness(1.3) drop-shadow(0 0 30px rgba(158,130,90,0.3))" }}
      />

      {/* Text sous le logo */}
      <div ref={textRef} className="absolute" style={{ top: "calc(50% + 70px)" }}>
        <span className="font-mono text-[9px] tracking-[6px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
          GONET-MEDEVILLE
        </span>
      </div>

      {/* Curtain — slides up to reveal the site */}
      <div
        ref={curtainRef}
        className="absolute inset-0"
        style={{ background: "#0E0E0C" }}
      />
    </div>
  );
}
