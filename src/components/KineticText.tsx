"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "span" | "div";
  intensity?: number; // how much chars spread (default 12)
}

/**
 * KineticText — each character has a slightly different scroll speed.
 * As user scrolls, characters "breathe" apart then recollect.
 * Best on large display titles.
 */
export default function KineticText({ children, className, style, as: Tag = "h2", intensity = 12 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-kinetic]");
    if (!chars.length) return;

    const triggers: ScrollTrigger[] = [];

    chars.forEach((char, i) => {
      const center = (chars.length - 1) / 2;
      const distFromCenter = (i - center) / center; // -1 to 1
      const yOffset = distFromCenter * intensity;

      const st = gsap.to(char, {
        y: yOffset,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.3,
        },
      }).scrollTrigger;
      if (st) triggers.push(st);
    });

    return () => { triggers.forEach(st => st.kill()); };
  }, [children, intensity]);

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} style={style} aria-label={children}>
      {[...children].map((c, i) => (
        <span
          key={i}
          data-kinetic
          className="inline-block will-change-transform"
          style={{ display: c === " " ? "inline" : undefined }}
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </Tag>
  );
}
