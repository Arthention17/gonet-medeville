"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Props { onComplete: () => void; }

export default function Preloader({ onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<SVGGElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const stemRef = useRef<SVGPathElement>(null);
  const wineBodyRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const outline = outlineRef.current;
    const stem = stemRef.current;
    const wineBody = wineBodyRef.current;
    const logo = logoRef.current;
    const glass = glassRef.current;
    if (!root || !outline || !stem || !wineBody || !logo || !glass) return;

    const outlineLen = outline.getTotalLength();
    const stemLen = stem.getTotalLength();

    gsap.set(outline, { strokeDasharray: outlineLen, strokeDashoffset: outlineLen });
    gsap.set(stem, { strokeDasharray: stemLen, strokeDashoffset: stemLen });
    gsap.set(wineBody, { clipPath: "inset(100% 0 0 0)" });
    gsap.set(logo, { opacity: 0, y: 30, scale: 0.85 });

    const tl = gsap.timeline();

    // Phase 1: Bowl outline draws (1.8s)
    tl.to(outline, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }, 0.5)

    // Phase 2: Stem + base draws (0.6s)
      .to(stem, { strokeDashoffset: 0, duration: 0.7, ease: "power2.out" }, 1.8)

    // Phase 3: Wine fills the bowl from bottom (1.4s)
      .to(wineBody, { clipPath: "inset(0% 0 0 0)", duration: 1.4, ease: "power1.out" }, 2.6)

    // Phase 4: Logo appears ABOVE the glass (0.8s)
      .to(logo, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out" }, 4.2)

    // Phase 5: Hold
      .to({}, { duration: 0.7 }, 5.1)

    // Phase 6: Ready + slide up
      .call(() => { onComplete(); }, [], 5.8)
      .to(root, { yPercent: -100, duration: 1.0, ease: "power4.inOut" }, 5.8)
      .call(() => { setHidden(true); }, [], 6.9);

    return () => { tl.kill(); };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: "#0E0E0C" }}>
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(158,130,90,0.05) 0%, transparent 50%)" }} />

      {/* ═══ Logo — appears ABOVE the glass ═══ */}
      <div ref={logoRef} className="absolute flex flex-col items-center" style={{ top: "14%", left: "50%", transform: "translateX(-50%)" }}>
        <img
          src="/logo.png"
          alt="Gonet-Medeville"
          width={90} height={90}
          className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] mb-4"
          style={{ filter: "invert(1) brightness(1.3) drop-shadow(0 0 30px rgba(158,130,90,0.35))" }}
        />
        <span className="font-mono text-[9px] tracking-[6px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
          GONET-MEDEVILLE
        </span>
      </div>

      {/* ═══ Zalto Bordeaux Glass ═══ */}
      <div className="relative" style={{ width: "200px", height: "380px", marginTop: "40px" }}>
        {/* SVG glass outline */}
        <svg ref={glassRef} viewBox="0 0 200 380" width="200" height="380" fill="none" className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          {/* Bowl — realistic Zalto Bordeaux tulip shape */}
          <path
            ref={outlineRef}
            d="
              M 100 245
              C 68 242, 50 225, 42 200
              C 34 175, 33 148, 38 125
              C 43 102, 52 82, 62 68
              C 72 54, 82 46, 90 42
              C 95 40, 98 39, 100 39
              C 102 39, 105 40, 110 42
              C 118 46, 128 54, 138 68
              C 148 82, 157 102, 162 125
              C 167 148, 166 175, 158 200
              C 150 225, 132 242, 100 245
            "
            stroke="var(--gold)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />

          {/* Rim highlight — thin line at top of bowl */}
          <ellipse cx="100" cy="39" rx="10" ry="2" stroke="var(--gold)" strokeWidth="0.5" opacity="0.3" />

          {/* Stem + base */}
          <path
            ref={stemRef}
            d="
              M 100 245
              L 100 330
              M 100 330
              C 85 330, 72 332, 65 336
              C 58 340, 58 344, 65 348
              C 72 352, 85 354, 100 354
              C 115 354, 128 352, 135 348
              C 142 344, 142 340, 135 336
              C 128 332, 115 330, 100 330
            "
            stroke="var(--gold)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>

        {/* Wine fill — div with matching shape, clipped from bottom */}
        <div
          ref={wineBodyRef}
          className="absolute"
          style={{
            top: "39px",
            left: "0",
            width: "200px",
            height: "210px",
            clipPath: "inset(100% 0 0 0)",
          }}
        >
          <svg viewBox="0 0 200 210" width="200" height="210" xmlns="http://www.w3.org/2000/svg">
            {/* Wine body — fills the interior of the bowl */}
            <path
              d="
                M 100 206
                C 70 203, 52 186, 44 162
                C 36 138, 35 112, 40 88
                C 45 66, 54 46, 64 32
                C 74 18, 84 10, 92 6
                C 96 4, 98 3, 100 3
                C 102 3, 104 4, 108 6
                C 116 10, 126 18, 136 32
                C 146 46, 155 66, 160 88
                C 165 112, 164 138, 156 162
                C 148 186, 130 203, 100 206
              "
              fill="url(#wine-gradient)"
              opacity="0.75"
            />
            <defs>
              <linearGradient id="wine-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(120,20,30,0.3)" />
                <stop offset="30%" stopColor="rgba(140,30,35,0.6)" />
                <stop offset="100%" stopColor="rgba(90,15,20,0.8)" />
              </linearGradient>
            </defs>

            {/* Wine surface highlight — subtle meniscus */}
            <ellipse cx="100" cy="8" rx="50" ry="3" fill="rgba(180,60,50,0.25)" />
          </svg>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-10 h-10" style={{ borderTop: "1px solid rgba(158,130,90,0.12)", borderLeft: "1px solid rgba(158,130,90,0.12)" }} />
      <div className="absolute top-6 right-6 w-10 h-10" style={{ borderTop: "1px solid rgba(158,130,90,0.12)", borderRight: "1px solid rgba(158,130,90,0.12)" }} />
      <div className="absolute bottom-6 left-6 w-10 h-10" style={{ borderBottom: "1px solid rgba(158,130,90,0.12)", borderLeft: "1px solid rgba(158,130,90,0.12)" }} />
      <div className="absolute bottom-6 right-6 w-10 h-10" style={{ borderBottom: "1px solid rgba(158,130,90,0.12)", borderRight: "1px solid rgba(158,130,90,0.12)" }} />
    </div>
  );
}
