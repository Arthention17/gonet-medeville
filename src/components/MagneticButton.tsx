"use client";
import { useRef, useCallback } from "react";
import { gsap } from "gsap";

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

/**
 * Magnetic button — the button moves toward the cursor when within range.
 * On hover, the inner content shifts MORE than the outer border = elastic feel.
 */
export default function MagneticButton({ children, className = "", style, href, onClick, strength = 0.35 }: Props) {
  const outerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = outerRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
    gsap.to(inner, { x: x * strength * 0.6, y: y * strength * 0.6, duration: 0.4, ease: "power3.out" });
  }, [strength]);

  const onLeave = useCallback(() => {
    gsap.to(outerRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  }, []);

  const Tag = href ? "a" : "button";
  const extraProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : { onClick };

  return (
    <Tag
      ref={outerRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>}
      className={`inline-block will-change-transform ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-hover
      data-cursor="enter"
      {...extraProps}
    >
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </Tag>
  );
}
