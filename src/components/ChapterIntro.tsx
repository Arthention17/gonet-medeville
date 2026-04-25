"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  number: string;        // "I", "II", "III"...
  title: string;
  hint?: string;
  align?: "left" | "center" | "right";
  variant?: "rule" | "year"; // 'rule' draws a gold line, 'year' shows giant numerals
}

/**
 * Elegant, creative chapter intro — 60vh, NOT pinned, NOT scroll-jacking.
 *
 * `rule` variant: chapter number + title in serif; a gold horizontal rule
 * draws across the screen as you scroll. Subtle, editorial.
 *
 * `year` variant: a quiet roman-numeral year drifts in big behind the title.
 */
export default function ChapterIntro({ number, title, hint, align = "center", variant = "rule" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;

    const lines = card.current?.querySelectorAll("[data-line]");
    if (lines) gsap.set(lines, { yPercent: 110, opacity: 0 });

    if (rule.current) gsap.set(rule.current, { scaleX: 0, transformOrigin: "left center" });
    if (year.current) gsap.set(year.current, { scale: 1.25, opacity: 0, y: 40 });

    const reveal = gsap.timeline({
      scrollTrigger: { trigger: r, start: "top 75%", once: true },
    });
    if (lines) reveal.to(lines, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: "power3.out" });
    if (year.current) reveal.to(year.current, { scale: 1, opacity: 0.08, y: 0, duration: 1.2, ease: "power3.out" }, "<");

    const ruleAnim = rule.current
      ? gsap.to(rule.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: r, start: "top 80%", end: "bottom 30%", scrub: true },
        })
      : null;

    return () => {
      reveal.scrollTrigger?.kill();
      reveal.kill();
      ruleAnim?.scrollTrigger?.kill();
      ruleAnim?.kill();
    };
  }, []);

  const alignCls = align === "left" ? "items-start text-left" : align === "right" ? "items-end text-right" : "items-center text-center";

  return (
    <section ref={root} className="relative w-full py-[18vh] md:py-[22vh] overflow-hidden" style={{ background: "var(--bg)" }}>
      {variant === "year" && (
        <div
          ref={year}
          aria-hidden
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center font-serif font-light italic pointer-events-none select-none"
          style={{
            fontSize: "clamp(160px, 28vw, 460px)",
            color: "var(--ink)",
            opacity: 0,
            lineHeight: 1,
            letterSpacing: "-0.06em",
          }}
        >
          {number}
        </div>
      )}

      <div ref={card} className={`relative z-[1] flex flex-col gap-5 px-8 md:px-16 ${alignCls}`}>
        <div className="overflow-hidden">
          <span data-line className="inline-block font-mono text-[11px] tracking-[5px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
            CHAPITRE {number}
          </span>
        </div>
        <div className="overflow-hidden">
          <h2 data-line className="inline-block font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(34px, 4.5vw, 64px)", color: "var(--ink)" }}>
            {title}
          </h2>
        </div>
        {hint && (
          <div className="overflow-hidden max-w-[420px]">
            <p data-line className="inline-block font-serif italic text-[15px]" style={{ color: "var(--ink2)" }}>
              {hint}
            </p>
          </div>
        )}
      </div>

      {variant === "rule" && (
        <div className="relative z-[1] mt-12 px-8 md:px-16">
          <div ref={rule} className="h-[1px] w-full" style={{ background: "linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)" }} />
        </div>
      )}
    </section>
  );
}
