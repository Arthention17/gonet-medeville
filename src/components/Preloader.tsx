"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props { onComplete: () => void; }

export default function Preloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bowlRef = useRef<SVGPathElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const wineMaskRef = useRef<SVGRectElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const bowl = bowlRef.current;
    const stem = stemRef.current;
    const wineMask = wineMaskRef.current;
    const logo = logoRef.current;
    if (!root || !bowl || !stem || !wineMask || !logo) return;

    const bowlLen = bowl.getTotalLength();
    const stemLen = stem.getTotalLength();

    gsap.set(bowl, { strokeDasharray: bowlLen, strokeDashoffset: bowlLen });
    gsap.set(stem, { strokeDasharray: stemLen, strokeDashoffset: stemLen });
    // Wine mask rect starts at bottom (y=280 = fully hidden), rises to y=30 (fully revealed)
    gsap.set(wineMask, { attr: { y: 280 } });
    gsap.set(logo, { opacity: 0, y: 25, scale: 0.88 });

    const tl = gsap.timeline();

    // Phase 1: Bowl draws
    tl.to(bowl, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0.4)

    // Phase 2: Stem + base draws
      .to(stem, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 1.6)

    // Phase 3: Wine rises smoothly inside the bowl
      .to(wineMask, { attr: { y: 70 }, duration: 1.8, ease: "power1.out" }, 2.5)

    // Phase 4: Logo appears above
      .to(logo, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, 4.5)

    // Phase 5: Hold
      .to({}, { duration: 0.6 }, 5.4)

    // Phase 6: Ready + slide up
      .call(() => { onComplete(); }, [], 6.0)
      .to(root, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, 6.0)
      .call(() => { setHidden(true); }, [], 7.1);

    return () => { tl.kill(); };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "#0E0E0C" }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(158,130,90,0.04) 0%, transparent 50%)" }} />

      {/* Logo — above the glass */}
      <div ref={logoRef} className="absolute flex flex-col items-center" style={{ top: "12%", left: "50%", transform: "translateX(-50%)" }}>
        <img src="/logo.png" alt="Gonet-Medeville" width={90} height={90}
          className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] mb-3"
          style={{ filter: "invert(1) brightness(1.3) drop-shadow(0 0 30px rgba(158,130,90,0.3))" }} />
        <span className="font-mono text-[9px] tracking-[6px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>GONET-MEDEVILLE</span>
      </div>

      {/* Zalto Universal glass — accurate proportions from reference photo */}
      <svg viewBox="0 0 300 500" width="220" height="366" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -42%)" }}>
        <defs>
          {/* Mask for wine fill — a rect that rises to reveal the wine */}
          <mask id="wine-mask">
            <rect x="0" y="0" width="300" height="500" fill="black" />
            <rect ref={wineMaskRef} x="0" y="280" width="300" height="250" fill="white" />
          </mask>
        </defs>

        {/* Wine fill — visible through mask, fills the bowl interior */}
        <path
          d="
            M 150 268
            C 118 266, 98 255, 86 238
            C 74 220, 70 196, 72 172
            C 74 148, 82 124, 94 104
            C 106 84, 120 70, 132 62
            C 140 57, 146 55, 150 54
            C 154 55, 160 57, 168 62
            C 180 70, 194 84, 206 104
            C 218 124, 226 148, 228 172
            C 230 196, 226 220, 214 238
            C 202 255, 182 266, 150 268
          "
          fill="url(#wineGrad)"
          mask="url(#wine-mask)"
          opacity="0.8"
        />

        <linearGradient id="wineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(160,40,45,0.35)" />
          <stop offset="40%" stopColor="rgba(130,25,30,0.55)" />
          <stop offset="100%" stopColor="rgba(80,12,18,0.75)" />
        </linearGradient>

        {/* Bowl outline — Zalto Universal: wide at top, elegant taper to narrow bottom */}
        <path
          ref={bowlRef}
          d="
            M 150 270
            C 120 268, 100 258, 86 240
            C 72 222, 68 198, 70 172
            C 72 146, 80 120, 92 100
            C 104 80, 118 66, 130 58
            C 138 53, 144 50, 150 50
            C 156 50, 162 53, 170 58
            C 182 66, 196 80, 208 100
            C 220 120, 228 146, 230 172
            C 232 198, 228 222, 214 240
            C 200 258, 180 268, 150 270
          "
          stroke="rgba(200,200,200,0.35)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Rim — subtle ellipse at top */}
        <ellipse cx="150" cy="51" rx="22" ry="3" stroke="rgba(200,200,200,0.2)" strokeWidth="0.5" fill="none" />

        {/* Knob where bowl meets stem */}
        <ellipse cx="150" cy="272" rx="5" ry="3" stroke="rgba(200,200,200,0.25)" strokeWidth="0.8" fill="none" />

        {/* Stem + base — one continuous path */}
        <path
          ref={stemRef}
          d="
            M 150 275
            L 150 400
            C 150 404, 148 406, 144 408
            C 136 412, 122 415, 108 416
            C 96 417, 86 417, 80 416
            M 150 400
            C 150 404, 152 406, 156 408
            C 164 412, 178 415, 192 416
            C 204 417, 214 417, 220 416
          "
          stroke="rgba(200,200,200,0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Glass highlights — subtle reflections */}
        <path d="M 112 100 C 108 130, 106 160, 108 190" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 188 100 C 192 130, 194 160, 192 190" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </svg>

      {/* Corners */}
      <div className="absolute top-6 left-6 w-10 h-10" style={{ borderTop: "1px solid rgba(158,130,90,0.12)", borderLeft: "1px solid rgba(158,130,90,0.12)" }} />
      <div className="absolute top-6 right-6 w-10 h-10" style={{ borderTop: "1px solid rgba(158,130,90,0.12)", borderRight: "1px solid rgba(158,130,90,0.12)" }} />
      <div className="absolute bottom-6 left-6 w-10 h-10" style={{ borderBottom: "1px solid rgba(158,130,90,0.12)", borderLeft: "1px solid rgba(158,130,90,0.12)" }} />
      <div className="absolute bottom-6 right-6 w-10 h-10" style={{ borderBottom: "1px solid rgba(158,130,90,0.12)", borderRight: "1px solid rgba(158,130,90,0.12)" }} />
    </div>
  );
}
