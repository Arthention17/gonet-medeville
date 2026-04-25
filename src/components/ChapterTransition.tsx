"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Variant = "flood" | "photo" | "scramble";

interface Props {
  number: string;
  title: string;
  subtitle?: string;
  /** flood = diagonal colour sweep ; photo = image curtain ; scramble = number scramble */
  variant?: Variant;
  /** colour family for the flood variant */
  color?: "gold" | "ink" | "wine";
  /** photo path for the photo variant */
  image?: string;
}

/**
 * Cinematic chapter transition. 100vh, pinned, scrub-driven.
 *
 *   flood    — A coloured diagonal panel sweeps across the screen revealing the
 *              chapter card on top, then sweeps off-screen.
 *   photo    — A full-bleed photo curtain drops from above, holds, then exits.
 *              The chapter title/subtitle sits over the image during the hold.
 *   scramble — The chapter number scrambles random Latin chars before settling.
 *              Background slowly tilts a duotone overlay.
 */
export default function ChapterTransition({
  number,
  title,
  subtitle,
  variant = "flood",
  color = "gold",
  image,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const photoEl = useRef<HTMLDivElement>(null);
  const numEl = useRef<HTMLSpanElement>(null);
  const lines = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current, st = sticky.current;
    if (!r || !st) return;

    const lineEls = lines.current?.querySelectorAll<HTMLElement>("[data-line]");
    if (lineEls) gsap.set(lineEls, { yPercent: 110, opacity: 0 });

    if (sweep.current) {
      gsap.set(sweep.current, { xPercent: -110, yPercent: -110, rotation: -8 });
    }
    if (photoEl.current) {
      gsap.set(photoEl.current, { yPercent: -100 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: r,
        start: "top top",
        end: "+=140%",
        pin: st,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    if (variant === "flood" && sweep.current) {
      // Phase 1: sweep arrives
      tl.to(sweep.current, { xPercent: 0, yPercent: 0, ease: "power3.out", duration: 0.5 }, 0);
      // Phase 2: card lines reveal
      if (lineEls) tl.to(lineEls, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: "power3.out" }, 0.4);
      // Phase 3: hold
      tl.to({}, { duration: 0.4 }, 0.6);
      // Phase 4: sweep exits opposite direction
      tl.to(sweep.current, { xPercent: 110, yPercent: 110, ease: "power3.in", duration: 0.5 }, 1.0);
      if (lineEls) tl.to(lineEls, { yPercent: -110, opacity: 0, stagger: 0.04, duration: 0.3 }, 1.0);
    }

    if (variant === "photo" && photoEl.current) {
      tl.to(photoEl.current, { yPercent: 0, ease: "power3.out", duration: 0.5 }, 0);
      if (lineEls) tl.to(lineEls, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.4, ease: "power3.out" }, 0.4);
      tl.to({}, { duration: 0.4 }, 0.6);
      tl.to(photoEl.current, { yPercent: 100, ease: "power3.in", duration: 0.5 }, 1.0);
      if (lineEls) tl.to(lineEls, { yPercent: -110, opacity: 0, stagger: 0.04, duration: 0.3 }, 1.0);
    }

    if (variant === "scramble" && numEl.current) {
      // Drive a scrambling effect through scroll progress
      const target = number;
      const charset = "IVXLCDM◊✦☼※❖✧✺▲";
      const targetEl = numEl.current;
      ScrollTrigger.create({
        trigger: r,
        start: "top top",
        end: "+=140%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.6) {
            // scramble — random chars but length grows toward target length
            const len = Math.max(1, Math.floor(target.length * (p / 0.6)));
            let s = "";
            for (let i = 0; i < len; i++) s += charset[Math.floor(Math.random() * charset.length)];
            targetEl.textContent = s;
          } else {
            // settle to target
            targetEl.textContent = target;
          }
        },
      });
      if (lineEls) tl.to(lineEls, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power3.out" }, 0.5);
      tl.to({}, { duration: 0.4 }, 0.9);
      if (lineEls) tl.to(lineEls, { yPercent: -110, opacity: 0, stagger: 0.04, duration: 0.3 }, 1.2);
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll().filter(s => s.trigger === r).forEach(s => s.kill());
    };
  }, [variant, number]);

  const sweepBg = color === "ink" ? "#0E0E0C" : color === "wine" ? "#5b1a2e" : "var(--gold)";
  const fg = color === "gold" ? "var(--ink)" : "#F7F5F0";

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden">
      <div ref={sticky} className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: variant === "flood" || variant === "scramble" ? "var(--bg)" : "#0E0E0C" }}>

        {/* SCRAMBLE — duotone backdrop */}
        {variant === "scramble" && (
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(158,130,90,0.10) 0%, transparent 65%)" }} />
        )}

        {/* FLOOD — diagonal coloured sweep */}
        {variant === "flood" && (
          <div
            ref={sweep}
            aria-hidden
            className="absolute -inset-[20%] z-[1] origin-center will-change-transform"
            style={{ background: sweepBg }}
          />
        )}

        {/* PHOTO — full-bleed image curtain */}
        {variant === "photo" && image && (
          <div ref={photoEl} className="absolute inset-0 z-[1] will-change-transform photo-grade">
            <img src={image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,14,12,0.25) 0%, rgba(14,14,12,0.45) 65%, rgba(14,14,12,0.7) 100%)" }} />
          </div>
        )}

        {/* Card content sits on top during the hold */}
        <div ref={lines} className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-8 text-center" style={{ color: variant === "flood" ? fg : "#F7F5F0" }}>
          <div className="overflow-hidden mb-6">
            <span data-line className="inline-block font-mono text-[11px] tracking-[6px]" style={{ fontFamily: "'DM Mono', monospace" }}>
              CHAPITRE
            </span>
          </div>
          <div className="overflow-hidden mb-3">
            <span
              ref={numEl}
              data-line
              className="inline-block font-serif italic font-light leading-[0.85] tracking-[-3px]"
              style={{ fontSize: "clamp(140px, 24vw, 360px)" }}
            >
              {number}
            </span>
          </div>
          <div className="overflow-hidden">
            <h2 data-line className="inline-block font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(36px, 5vw, 76px)" }}>
              {title}
            </h2>
          </div>
          {subtitle && (
            <div className="overflow-hidden mt-5 max-w-[480px]">
              <p data-line className="inline-block font-sans text-[12px] tracking-[2px] opacity-70">{subtitle}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
