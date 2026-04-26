"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: "h2" | "h3" | "span" | "div";
  fillColor?: string;
  strokeColor?: string;
}

/**
 * FillText — text starts as outline (transparent fill + stroke),
 * then fills progressively from left to right as user scrolls.
 * Like wine being poured into the letters.
 */
export default function FillText({
  children,
  className,
  style,
  as: Tag = "h2",
  fillColor = "var(--gold)",
  strokeColor = "rgba(158,130,90,0.3)",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const mask = maskRef.current;
    if (!el || !mask) return;

    gsap.set(mask, { clipPath: "inset(0 100% 0 0)" });

    const st = gsap.to(mask, {
      clipPath: "inset(0 0% 0 0)",
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 75%",
        end: "top 30%",
        scrub: 0.5,
      },
    }).scrollTrigger;

    return () => { st?.kill(); };
  }, [children]);

  const textStyle: React.CSSProperties = {
    ...style,
    WebkitTextStroke: `1px ${strokeColor}`,
    color: "transparent",
  };

  const fillStyle: React.CSSProperties = {
    ...style,
    color: fillColor,
    WebkitTextStroke: "0px transparent",
  };

  return (
    <span className="relative inline-block">
      {/* Outline version (always visible) */}
      <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} style={textStyle} aria-label={children}>
        {children}
      </Tag>
      {/* Filled version (revealed by clip-path) */}
      <div ref={maskRef} className="absolute inset-0 will-change-[clip-path]" aria-hidden>
        <Tag className={className} style={fillStyle}>
          {children}
        </Tag>
      </div>
    </span>
  );
}
