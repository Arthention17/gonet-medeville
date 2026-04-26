"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props { onComplete: () => void; }

export default function Preloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glassGroupRef = useRef<SVGGElement>(null);
  const bowlRef = useRef<SVGPathElement>(null);
  const stemRef = useRef<SVGLineElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const wineRef = useRef<SVGClipPathElement>(null);
  const wineRectRef = useRef<SVGRectElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const bowl = bowlRef.current;
    const stem = stemRef.current;
    const base = baseRef.current;
    const wineRect = wineRectRef.current;
    const logo = logoRef.current;
    const name = nameRef.current;
    const glassGroup = glassGroupRef.current;
    if (!root || !bowl || !stem || !base || !wineRect || !logo || !name || !glassGroup) return;

    // Measure strokes
    const bowlLen = bowl.getTotalLength();
    const baseLen = base.getTotalLength();

    // Initial state
    gsap.set(bowl, { strokeDasharray: bowlLen, strokeDashoffset: bowlLen });
    gsap.set(base, { strokeDasharray: baseLen, strokeDashoffset: baseLen });
    gsap.set(stem, { scaleY: 0, transformOrigin: "center top" });
    gsap.set(wineRect, { y: 300 }); // wine level starts below bowl
    gsap.set(logo, { opacity: 0, scale: 0.75, y: 20 });
    gsap.set(name, { opacity: 0, y: 12 });

    const tl = gsap.timeline();

    // ═══ Phase 1 (0→2s): Glass draws itself ═══
    // Bowl draws from top
    tl.to(bowl, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, 0.4)
    // Stem grows down
      .to(stem, { scaleY: 1, duration: 0.6, ease: "power2.out" }, 1.4)
    // Base draws
      .to(base, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 1.7)

    // ═══ Phase 2 (2→3s): Wine fills the bowl ═══
      .to(wineRect, { y: 115, duration: 1.2, ease: "power1.out" }, 2.2)

    // ═══ Phase 3 (3.4→4.2s): Glass fades, logo appears ═══
      .to(glassGroup, { opacity: 0, scale: 0.9, duration: 0.6, ease: "power2.in" }, 3.6)
      .to(logo, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3.9)
      .to(name, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 4.3)

    // ═══ Phase 4 (4.8s): Hold ═══
      .to({}, { duration: 0.5 }, 4.8)

    // ═══ Phase 5 (5.3s): Fire ready + slide root up ═══
      .call(() => { onComplete(); }, [], 5.3)
      .to(root, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, 5.3)
      .call(() => { setHidden(true); }, [], 6.4);

    return () => { tl.kill(); };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "#0E0E0C" }}
    >
      {/* Subtle gold radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 45%, rgba(158,130,90,0.06) 0%, transparent 50%)"
      }} />

      {/* ═══ Zalto Bordeaux glass ═══ */}
      <svg
        viewBox="0 0 200 400"
        width="160"
        height="320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -55%)" }}
      >
        <defs>
          {/* Clip path for wine fill — a shape matching the bowl interior */}
          <clipPath ref={wineRef} id="wine-clip">
            <path d="M 52 260 C 52 200, 55 160, 65 130 C 75 105, 85 95, 100 92 C 115 95, 125 105, 135 130 C 145 160, 148 200, 148 260 C 145 290, 130 310, 100 320 C 70 310, 55 290, 52 260 Z" />
          </clipPath>
        </defs>

        <g ref={glassGroupRef}>
          {/* Bowl — the Zalto's distinctive wide tulip shape */}
          <path
            ref={bowlRef}
            d="
              M 100 320
              C 60 310, 42 270, 40 230
              C 38 190, 42 150, 52 120
              C 60 96, 70 80, 80 72
              C 88 66, 94 63, 100 62
              C 106 63, 112 66, 120 72
              C 130 80, 140 96, 148 120
              C 158 150, 162 190, 160 230
              C 158 270, 140 310, 100 320
            "
            stroke="var(--gold)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
            fill="none"
          />

          {/* Stem — thin elegant line */}
          <line
            ref={stemRef}
            x1="100" y1="320"
            x2="100" y2="370"
            stroke="var(--gold)"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Base — subtle curved base */}
          <path
            ref={baseRef}
            d="M 72 370 Q 86 378, 100 380 Q 114 378, 128 370"
            stroke="var(--gold)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
            fill="none"
          />

          {/* Wine fill — red, clipped to bowl shape, rises via rect y */}
          <g clipPath="url(#wine-clip)">
            <rect
              ref={wineRectRef}
              x="30" y="300"
              width="140" height="240"
              fill="rgba(120,30,30,0.45)"
            />
            {/* Subtle highlight on wine surface */}
            <rect
              x="30"
              width="140" height="4"
              fill="rgba(180,60,50,0.3)"
              style={{ transform: "translateY(var(--wine-y, 300px))" }}
            />
          </g>
        </g>
      </svg>

      {/* ═══ Logo (appears after glass fades) ═══ */}
      <img
        ref={logoRef}
        src="/logo.png"
        alt="Gonet-Medeville"
        width={110}
        height={110}
        className="absolute w-[90px] h-[90px] md:w-[110px] md:h-[110px]"
        style={{
          top: "50%", left: "50%",
          transform: "translate(-50%, -55%)",
          filter: "invert(1) brightness(1.3) drop-shadow(0 0 40px rgba(158,130,90,0.35))",
        }}
      />

      {/* Name under logo */}
      <div
        ref={nameRef}
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: "calc(50% + 50px)" }}
      >
        <span className="font-mono text-[9px] tracking-[6px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
          GONET-MEDEVILLE
        </span>
      </div>

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-10 h-10" style={{ borderTop: "1px solid rgba(158,130,90,0.15)", borderLeft: "1px solid rgba(158,130,90,0.15)" }} />
      <div className="absolute top-6 right-6 w-10 h-10" style={{ borderTop: "1px solid rgba(158,130,90,0.15)", borderRight: "1px solid rgba(158,130,90,0.15)" }} />
      <div className="absolute bottom-6 left-6 w-10 h-10" style={{ borderBottom: "1px solid rgba(158,130,90,0.15)", borderLeft: "1px solid rgba(158,130,90,0.15)" }} />
      <div className="absolute bottom-6 right-6 w-10 h-10" style={{ borderBottom: "1px solid rgba(158,130,90,0.15)", borderRight: "1px solid rgba(158,130,90,0.15)" }} />
    </div>
  );
}
