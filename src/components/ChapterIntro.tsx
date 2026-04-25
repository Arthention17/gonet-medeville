"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Variant = "wipe" | "reveal" | "split" | "curtain";

interface Props {
  number: string;
  title: string;
  hint: string;
  variant: Variant;
}

/**
 * ChapterIntro — 60vh creative chapter break.
 *
 * Four signature animations (one per chapter, never repeats):
 *  - wipe    : a gold horizontal rule scrubs across as you scroll; massive
 *              roman numeral fades up behind, title + hint stagger up.
 *  - reveal  : the cream bg fades to ink at scroll-centre, gold numeral lights
 *              up, title reveals word by word, then ink recedes.
 *  - split   : a vertical clip-path "tear" opens at the centre; the numeral is
 *              cut in half and slides apart, title appears in the gap.
 *  - curtain : a sombre curtain drops from the top covering the previous
 *              section, then lifts to unveil the chapter card.
 */
export default function ChapterIntro({ number, title, hint, variant }: Props) {
  const root = useRef<HTMLDivElement>(null);

  // Refs per-variant
  const ruleRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const inkBg = useRef<HTMLDivElement>(null);
  const splitL = useRef<HTMLDivElement>(null);
  const splitR = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;

    // Common: prepare title words for stagger
    let words: HTMLElement[] = [];
    if (titleRef.current) {
      const text = titleRef.current.textContent || "";
      titleRef.current.innerHTML = text
        .split(" ")
        .map(
          (w) =>
            `<span class="inline-block overflow-hidden align-bottom" style="padding-bottom:0.04em"><span data-w class="inline-block">${w}&nbsp;</span></span>`
        )
        .join("");
      words = Array.from(titleRef.current.querySelectorAll("[data-w]")) as HTMLElement[];
      gsap.set(words, { yPercent: 110, opacity: 0 });
    }
    if (labelRef.current) gsap.set(labelRef.current, { yPercent: 110, opacity: 0 });
    if (hintRef.current) gsap.set(hintRef.current, { y: 18, opacity: 0 });

    const triggers: ScrollTrigger[] = [];

    if (variant === "wipe") {
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left center" });
      if (numRef.current) gsap.set(numRef.current, { y: 40, opacity: 0 });

      // Rule scrubs across the entire scroll of the section
      const ruleAnim = gsap.to(ruleRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: r, start: "top 80%", end: "bottom 20%", scrub: true },
      });
      triggers.push(ruleAnim.scrollTrigger!);

      // Reveal once when entering view
      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 75%", once: true },
      });
      tl.to(labelRef.current, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
        .to(numRef.current, { y: 0, opacity: 0.15, duration: 1.2, ease: "power3.out" }, "-=0.4")
        .to(words, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: "power3.out" }, "-=0.8")
        .to(hintRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5");
      triggers.push(tl.scrollTrigger!);
    }

    if (variant === "reveal") {
      // Background fades cream -> ink at section centre, then back toward ink
      // (the next section is the cave which is also ink, so we LEAVE it dark)
      if (inkBg.current) gsap.set(inkBg.current, { opacity: 0 });
      if (numRef.current) gsap.set(numRef.current, { scale: 1.15, opacity: 0 });

      const bgAnim = gsap.to(inkBg.current, {
        opacity: 1, ease: "none",
        scrollTrigger: { trigger: r, start: "top 70%", end: "center 50%", scrub: true },
      });
      triggers.push(bgAnim.scrollTrigger!);

      const tl = gsap.timeline({
        scrollTrigger: { trigger: r, start: "top 70%", once: true },
      });
      tl.to(labelRef.current, { yPercent: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
        .to(numRef.current, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.5")
        .to(words, { yPercent: 0, opacity: 1, stagger: 0.07, duration: 0.9, ease: "power3.out" }, "-=0.7")
        .to(hintRef.current, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5");
      triggers.push(tl.scrollTrigger!);
    }

    if (variant === "split") {
      if (splitL.current && splitR.current) {
        gsap.set(splitL.current, { xPercent: 0 });
        gsap.set(splitR.current, { xPercent: 0 });
      }
      if (numRef.current) gsap.set(numRef.current, { opacity: 0 });
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 0 });

      // Pin while the split tears open — shorter, faster
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: r,
          start: "top top",
          end: "+=60%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(numRef.current, { opacity: 0.15, duration: 0.2 }, 0)
        .to(splitL.current, { xPercent: -55, duration: 0.5, ease: "power2.inOut" }, 0)
        .to(splitR.current, { xPercent: 55, duration: 0.5, ease: "power2.inOut" }, 0)
        .to(labelRef.current, { yPercent: 0, opacity: 1, duration: 0.4 }, 0.25)
        .to(titleRef.current, { opacity: 1, duration: 0.3 }, 0.35)
        .to(words, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power3.out" }, 0.4)
        .to(hintRef.current, { y: 0, opacity: 1, duration: 0.4 }, 0.6);
      triggers.push(tl.scrollTrigger!);
    }

    if (variant === "curtain") {
      if (curtain.current) gsap.set(curtain.current, { yPercent: -100 });
      if (numRef.current) gsap.set(numRef.current, { y: 30, opacity: 0 });

      // Curtain drops, holds, lifts — shorter pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: r,
          start: "top top",
          end: "+=70%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(curtain.current, { yPercent: 0, duration: 0.3, ease: "power3.in" }, 0)
        .to(labelRef.current, { yPercent: 0, opacity: 1, duration: 0.25 }, 0.3)
        .to(numRef.current, { y: 0, opacity: 0.18, duration: 0.4, ease: "power3.out" }, 0.35)
        .to(words, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power3.out" }, 0.45)
        .to(hintRef.current, { y: 0, opacity: 1, duration: 0.4 }, 0.6)
        .to(curtain.current, { yPercent: 100, duration: 0.25, ease: "power3.out" }, 0.85);
      triggers.push(tl.scrollTrigger!);
    }

    return () => triggers.forEach(t => t.kill());
  }, [variant]);

  // Background tone — ink only for "reveal" (which sits before the dark cave)
  const sectionBg = variant === "reveal" ? "var(--bg)" : "var(--bg)";
  const numberColor = variant === "reveal" ? "var(--gold)" : "var(--gold)";
  const fg = "var(--ink)";

  return (
    <section
      ref={root}
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: "60vh", background: sectionBg, color: fg, minHeight: "440px" }}
    >
      {/* Ink fade overlay for "reveal" */}
      {variant === "reveal" && (
        <div ref={inkBg} aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: "#0E0E0C" }} />
      )}

      {/* Curtain panel — solid ink, smoother bridge between dark Press and cream Heritage */}
      {variant === "curtain" && (
        <div
          ref={curtain}
          aria-hidden
          className="absolute inset-0 pointer-events-none z-[2] will-change-transform"
          style={{ background: "var(--ink)" }}
        />
      )}

      {/* Wipe rule */}
      {variant === "wipe" && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-[1] px-8 md:px-16 pointer-events-none">
          <div ref={ruleRef} className="h-[1px] w-full will-change-transform" style={{ background: "linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)" }} />
        </div>
      )}

      {/* Split halves */}
      {variant === "split" && (
        <>
          <div
            ref={splitL}
            aria-hidden
            className="absolute inset-y-0 left-0 right-1/2 z-[1] will-change-transform"
            style={{ background: "var(--bg)" }}
          />
          <div
            ref={splitR}
            aria-hidden
            className="absolute inset-y-0 left-1/2 right-0 z-[1] will-change-transform"
            style={{ background: "var(--bg)" }}
          />
        </>
      )}

      {/* Massive roman numeral — sits in the back */}
      <div
        ref={numRef}
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[0]"
      >
        <span
          className="font-serif italic font-light leading-[0.85]"
          style={{
            fontSize: "clamp(120px, 22vw, 350px)",
            color: numberColor,
            opacity: 0,
            letterSpacing: "-0.04em",
          }}
        >
          {number}
        </span>
      </div>

      {/* Card content (above the bg/curtain/split layers, but the numeral is z-0 behind) */}
      <div className="relative z-[3] flex flex-col items-center justify-center text-center px-8 max-w-[600px]">
        <div className="overflow-hidden mb-5">
          <span
            ref={labelRef}
            className="inline-block font-mono"
            style={{
              fontSize: "11px",
              letterSpacing: "5px",
              color: "var(--gold)",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            CHAPITRE {number}
          </span>
        </div>

        <h2
          ref={titleRef}
          className="font-serif font-light tracking-[-1px] mb-5"
          style={{
            fontSize: "clamp(34px, 4.5vw, 64px)",
            color: variant === "reveal" ? "#F7F5F0" : "var(--ink)",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h2>

        <p
          ref={hintRef}
          className="font-serif italic"
          style={{
            fontSize: "15px",
            color: variant === "reveal" ? "rgba(247,245,240,0.7)" : "var(--ink2)",
            lineHeight: 1.6,
            maxWidth: "440px",
          }}
        >
          {hint}
        </p>
      </div>
    </section>
  );
}
