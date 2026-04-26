"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  from?: string;
  to?: string;
  flip?: boolean;
}

export default function WaveDivider({ from = "var(--bg)", to = "#0E0E0C", flip = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const waveRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = ref.current;
    const wave = waveRef.current;
    if (!el || !wave) return;

    // Animate the wave path morphing as it scrolls into view
    gsap.fromTo(wave,
      { attr: { d: "M 0,120 L 0,90 Q 360,90 720,90 Q 1080,90 1440,90 L 1440,120 Z" } },
      {
        attr: { d: "M 0,120 L 0,70 Q 180,20 360,55 Q 540,90 720,45 Q 900,0 1080,50 Q 1260,100 1440,60 L 1440,120 Z" },
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 30%",
          scrub: 0.5,
        },
      }
    );

    // Fade in
    gsap.fromTo(el, { opacity: 0 }, {
      opacity: 1,
      scrollTrigger: { trigger: el, start: "top 95%", end: "top 70%", scrub: true },
    });
  }, []);

  return (
    <div ref={ref} className="relative w-full overflow-hidden pointer-events-none" style={{ marginTop: "-1px", marginBottom: "-1px", transform: flip ? "scaleY(-1)" : undefined }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px] block">
        {/* Top fill (from color) */}
        <rect width="1440" height="120" fill={from} />
        {/* Animated wave path (bottom color) */}
        <path
          ref={waveRef}
          d="M 0,120 L 0,90 Q 360,90 720,90 Q 1080,90 1440,90 L 1440,120 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
