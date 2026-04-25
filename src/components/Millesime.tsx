"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photos } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

/**
 * Millesime spotlight — a featured wine year.
 * Massive year numerals draw across the screen, the bottle slides in from the
 * right with a parallax effect, tasting notes reveal as quoted lines.
 */
export default function Millesime() {
  const root = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const lines = r.querySelectorAll<HTMLElement>("[data-line]");

    gsap.set(lines, { yPercent: 110, opacity: 0 });
    gsap.set(yearRef.current, { xPercent: -8, opacity: 0 });
    gsap.set(bottleRef.current, { xPercent: 30, opacity: 0 });

    gsap.timeline({
      scrollTrigger: { trigger: r, start: "top 75%", once: true },
    })
      .to(yearRef.current, { xPercent: 0, opacity: 1, duration: 1.4, ease: "power3.out" })
      .to(bottleRef.current, { xPercent: 0, opacity: 1, duration: 1.4, ease: "power3.out" }, "-=1.0")
      .to(lines, { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: "power3.out" }, "-=0.8");

    // Parallax for the year on scroll
    gsap.to(yearRef.current, {
      xPercent: -10, ease: "none",
      scrollTrigger: { trigger: r, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section ref={root} className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#0E0E0C", color: "#F7F5F0" }}>
      {/* Massive year — sits behind everything */}
      <div
        ref={yearRef}
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center will-change-transform"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(220px, 38vw, 720px)",
          color: "rgba(158,130,90,0.18)",
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
        }}
      >
        1989
      </div>

      <div className="relative max-w-[1300px] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left — copy */}
        <div className="md:col-span-6">
          <div className="overflow-hidden mb-6"><span data-line className="inline-block font-mono text-[11px] tracking-[5px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>MILLÉSIME D'EXCEPTION</span></div>
          <h2 className="font-serif font-light leading-[1.05] tracking-[-1.5px] mb-6" style={{ fontSize: "clamp(38px, 5vw, 76px)" }}>
            <span className="block overflow-hidden"><span data-line className="inline-block">Château</span></span>
            <span className="block overflow-hidden"><span data-line className="inline-block italic" style={{ color: "var(--gold)" }}>Gilette</span></span>
            <span className="block overflow-hidden"><span data-line className="inline-block">Crème de Tête.</span></span>
          </h2>
          <div className="overflow-hidden mb-8 max-w-[480px]">
            <p data-line className="font-serif italic font-light leading-[1.6]" style={{ color: "rgba(247,245,240,0.75)", fontSize: "clamp(15px, 1.2vw, 18px)" }}>
              « L'antiquaire du Sauternes — vingt ans en cuves béton, une patience qui défie le temps. »
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-[440px] mb-10">
            <div className="overflow-hidden"><div data-line><div className="font-serif text-[34px] font-light leading-none" style={{ color: "#F7F5F0" }}>97</div><div className="font-mono text-[9px] tracking-[2px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>PARKER</div></div></div>
            <div className="overflow-hidden"><div data-line><div className="font-serif text-[34px] font-light leading-none" style={{ color: "#F7F5F0" }}>20</div><div className="font-mono text-[9px] tracking-[2px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>ANS EN CUVES</div></div></div>
            <div className="overflow-hidden"><div data-line><div className="font-serif text-[34px] font-light leading-none" style={{ color: "#F7F5F0" }}>4,5</div><div className="font-mono text-[9px] tracking-[2px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>HECTARES</div></div></div>
          </div>
          <div className="overflow-hidden">
            <div data-line><button className="btn-fill" data-hover style={{ borderColor: "var(--gold)", color: "#F7F5F0" }}><span>Découvrir le millésime</span></button></div>
          </div>
        </div>

        {/* Right — bottle */}
        <div className="md:col-span-6 flex justify-center md:justify-end">
          <div ref={bottleRef} className="relative will-change-transform" style={{ filter: "drop-shadow(0 60px 80px rgba(0,0,0,0.6))" }}>
            <Image src="/bottles/gilette.png" alt="Château Gilette 1989" width={260} height={680} className="object-contain" style={{ maxHeight: "70vh", width: "auto" }} />
            <div className="absolute -left-10 top-6 font-mono text-[10px] tracking-[3px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>SAUTERNES</div>
          </div>
        </div>
      </div>
    </section>
  );
}
