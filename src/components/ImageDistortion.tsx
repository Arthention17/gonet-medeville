"use client";
import { useRef, useCallback } from "react";
import { gsap } from "gsap";

interface Props {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Image with SVG displacement distortion on hover.
 * Uses native SVG feTurbulence + feDisplacementMap — no WebGL needed.
 * On hover: turbulence scale animates creating a liquid ripple effect.
 */
export default function ImageDistortion({ src, alt = "", className = "", style }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const filterId = useRef(`distort-${Math.random().toString(36).slice(2, 8)}`).current;

  const onEnter = useCallback(() => {
    const turb = turbRef.current;
    if (!turb) return;
    // Animate turbulence baseFrequency to create ripple
    gsap.fromTo(turb,
      { attr: { baseFrequency: "0 0" } },
      {
        attr: { baseFrequency: "0.015 0.015" },
        duration: 0.6,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      }
    );
  }, []);

  const onLeave = useCallback(() => {
    const turb = turbRef.current;
    if (!turb) return;
    gsap.to(turb, { attr: { baseFrequency: "0 0" }, duration: 0.8, ease: "power3.out" });
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden group ${className}`}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor="voir"
    >
      {/* SVG displacement filter */}
      <svg className="absolute w-0 h-0" aria-hidden>
        <defs>
          <filter id={filterId}>
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0 0"
              numOctaves="3"
              result="noise"
              seed="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="30"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
        style={{ filter: `url(#${filterId})`, willChange: "filter" }}
      />

      {/* Subtle gold overlay on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: "linear-gradient(135deg, rgba(158,130,90,0.08) 0%, transparent 60%)" }}
      />
    </div>
  );
}
