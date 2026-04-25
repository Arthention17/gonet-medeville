"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Twin soil cross-sections — left = chalky Champagne, right = gravelly Bordeaux.
 * Layers are SVG paths whose stroke draws on scroll via stroke-dashoffset.
 * Pure complementarity, no "vs" framing. Discreet caption between the two.
 */
export default function SoilCrossSection() {
  const sec = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = sec.current;
    if (!root) return;
    const paths = root.querySelectorAll<SVGPathElement>("[data-draw]");
    paths.forEach((p) => {
      const length = p.getTotalLength();
      p.style.strokeDasharray = String(length);
      p.style.strokeDashoffset = String(length);
    });
    const tween = gsap.to(paths, {
      strokeDashoffset: 0,
      ease: "none",
      stagger: 0.05,
      scrollTrigger: { trigger: root, start: "top 75%", end: "bottom 30%", scrub: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sec} className="relative py-20 md:py-24 px-8 md:px-16 lg:px-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1300px] mx-auto">
        <div className="text-center mb-12">
          <span className="font-mono text-[11px] tracking-[5px] block mb-3" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
            COMPLÉMENTARITÉ DES TERROIRS
          </span>
          <h2 className="font-serif font-light italic tracking-[-1px]" style={{ fontSize: "clamp(28px, 3.5vw, 48px)", color: "var(--ink)" }}>
            De la craie à la grave.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-16 items-end">
          {/* Champagne — chalk */}
          <div className="relative">
            <svg viewBox="0 0 400 260" className="w-full h-auto" preserveAspectRatio="none">
              {/* Top vines hint */}
              <path data-draw d="M 20 30 Q 80 22 140 30" fill="none" stroke="#9E825A" strokeWidth="0.8" />
              <path data-draw d="M 200 32 Q 280 24 380 32" fill="none" stroke="#9E825A" strokeWidth="0.8" />
              {/* Topsoil */}
              <path data-draw d="M 0 60 Q 100 52 200 60 T 400 60" fill="none" stroke="#7E6E5A" strokeWidth="1" />
              {/* Chalk layers — multiple curves */}
              <path data-draw d="M 0 90 Q 100 84 200 90 T 400 90" fill="none" stroke="#C8C0B0" strokeWidth="1.2" />
              <path data-draw d="M 0 120 Q 100 113 200 120 T 400 120" fill="none" stroke="#D4CDBE" strokeWidth="1.2" />
              <path data-draw d="M 0 150 Q 100 146 200 150 T 400 150" fill="none" stroke="#DDD6C8" strokeWidth="1.2" />
              <path data-draw d="M 0 180 Q 100 175 200 180 T 400 180" fill="none" stroke="#E5DECF" strokeWidth="1.4" />
              <path data-draw d="M 0 215 Q 100 209 200 215 T 400 215" fill="none" stroke="#EDE6D5" strokeWidth="1.6" />
              {/* Vertical chalk veins */}
              <path data-draw d="M 80 92 L 80 240" fill="none" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.55" />
              <path data-draw d="M 180 95 L 180 248" fill="none" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.55" />
              <path data-draw d="M 290 90 L 290 245" fill="none" stroke="#C8C0B0" strokeWidth="0.6" opacity="0.55" />
              {/* Roots */}
              <path data-draw d="M 60 30 Q 56 70 64 110 Q 70 150 58 180" fill="none" stroke="#9E825A" strokeWidth="0.5" />
              <path data-draw d="M 160 30 Q 158 80 168 130 Q 174 170 160 200" fill="none" stroke="#9E825A" strokeWidth="0.5" />
              <path data-draw d="M 260 30 Q 264 80 256 130 Q 250 170 268 195" fill="none" stroke="#9E825A" strokeWidth="0.5" />
            </svg>
            <div className="text-center mt-4">
              <div className="font-serif text-[20px] font-light tracking-[-0.5px]" style={{ color: "var(--ink)" }}>Champagne</div>
              <div className="font-mono text-[10px] tracking-[2px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>CRAIE · 12 HA</div>
            </div>
          </div>

          {/* Bordeaux — gravel */}
          <div className="relative">
            <svg viewBox="0 0 400 260" className="w-full h-auto" preserveAspectRatio="none">
              <path data-draw d="M 20 30 Q 80 22 140 30" fill="none" stroke="#9E825A" strokeWidth="0.8" />
              <path data-draw d="M 200 32 Q 280 24 380 32" fill="none" stroke="#9E825A" strokeWidth="0.8" />
              <path data-draw d="M 0 60 Q 100 53 200 60 T 400 60" fill="none" stroke="#5C4A38" strokeWidth="1" />
              {/* Gravel — broken horizontal strokes mimicking pebbles */}
              <path data-draw d="M 10 90 L 60 90 M 80 92 L 130 92 M 150 90 L 200 90 M 220 92 L 270 92 M 290 90 L 340 90 M 360 92 L 395 92" fill="none" stroke="#7A5C3D" strokeWidth="1.4" />
              <path data-draw d="M 5 120 L 50 120 M 70 122 L 120 122 M 140 120 L 195 120 M 215 122 L 265 122 M 285 120 L 335 120 M 355 122 L 395 122" fill="none" stroke="#8A6A48" strokeWidth="1.4" />
              <path data-draw d="M 0 150 L 55 150 M 75 152 L 125 152 M 145 150 L 200 150 M 220 152 L 270 152 M 290 150 L 345 150 M 365 152 L 400 152" fill="none" stroke="#9A7A52" strokeWidth="1.5" />
              <path data-draw d="M 0 180 L 60 180 M 80 182 L 135 182 M 155 180 L 210 180 M 230 182 L 280 182 M 300 180 L 350 180 M 370 182 L 400 182" fill="none" stroke="#A88860" strokeWidth="1.6" />
              <path data-draw d="M 0 215 L 50 215 M 70 217 L 125 217 M 145 215 L 200 215 M 220 217 L 275 217 M 295 215 L 350 215 M 370 217 L 400 217" fill="none" stroke="#B89870" strokeWidth="1.8" />
              {/* Roots — deeper, more entwined */}
              <path data-draw d="M 60 30 Q 54 70 70 120 Q 78 170 60 220" fill="none" stroke="#9E825A" strokeWidth="0.5" />
              <path data-draw d="M 160 30 Q 168 80 152 130 Q 146 180 168 230" fill="none" stroke="#9E825A" strokeWidth="0.5" />
              <path data-draw d="M 260 30 Q 252 80 270 140 Q 282 190 260 235" fill="none" stroke="#9E825A" strokeWidth="0.5" />
            </svg>
            <div className="text-center mt-4">
              <div className="font-serif text-[20px] font-light tracking-[-0.5px]" style={{ color: "var(--ink)" }}>Bordeaux</div>
              <div className="font-mono text-[10px] tracking-[2px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>GRAVE · 31 HA</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
