"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  number: string;
  title: string;
  subtitle?: string;
  bg?: "ink" | "gold" | "cream";
  sweep?: string;
}

/**
 * Chapter divider — single 100vh section, no pin.
 * Sweep panel rises across the screen on entry, then the card lines reveal.
 * No scrub: the animation plays once and the chapter is then static while scrolling.
 */
export default function ChapterDivider({ number, title, subtitle, bg = "ink", sweep = "var(--gold)" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;

    const lines = card.current!.querySelectorAll("[data-line]");
    gsap.set(sweepRef.current, { yPercent: 100 });
    gsap.set(lines, { yPercent: 110, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: r,
        start: "top 75%",
        once: true,
      },
    });
    tl
      .to(sweepRef.current, { yPercent: -110, duration: 1.4, ease: "power2.inOut" })
      .to(lines, { yPercent: 0, opacity: 1, stagger: 0.08, ease: "power3.out", duration: 1 }, "-=1.0");

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const bgColor = bg === "ink" ? "#0E0E0C" : bg === "gold" ? "var(--gold)" : "var(--bg)";
  const fg = bg === "cream" ? "var(--ink)" : "#F7F5F0";

  return (
    <section ref={root} className="h-screen w-full relative overflow-hidden" style={{ background: bgColor, color: fg }}>
      <div
        ref={sweepRef}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: sweep, mixBlendMode: bg === "gold" ? "multiply" : "normal" }}
      />

      <div ref={card} className="relative z-[2] h-full w-full flex flex-col items-center justify-center px-8 text-center">
        <div className="overflow-hidden mb-6">
          <span data-line className="inline-block font-mono text-[11px] tracking-[6px] opacity-60" style={{ fontFamily: "'DM Mono', monospace" }}>
            CHAPTER {number}
          </span>
        </div>
        <div className="overflow-hidden mb-2">
          <span data-line className="inline-block font-serif italic font-light leading-[0.85] tracking-[-3px]" style={{ fontSize: "clamp(120px, 22vw, 320px)" }}>
            {number}
          </span>
        </div>
        <div className="overflow-hidden">
          <h2 data-line className="inline-block font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(36px, 5vw, 76px)" }}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <div className="overflow-hidden mt-5">
            <p data-line className="inline-block font-sans text-[12px] tracking-[2px] opacity-50 max-w-[420px]">{subtitle}</p>
          </div>
        )}
      </div>
    </section>
  );
}
