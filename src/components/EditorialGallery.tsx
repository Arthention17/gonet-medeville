"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Wine } from "@/lib/wines";

gsap.registerPlugin(ScrollTrigger);

interface Props { wines: Wine[]; }

/**
 * Gallery v5 — sticky + scrub.
 *
 * Section structure:
 *   <div height="INTRO + 100vh + totalShift">
 *     <div padding-top="INTRO">                    ← heading scrolls normally in this space
 *       <div position="sticky" top="0" h-screen>   ← locks when heading reaches top
 *         <track translateX>                        ← moves horizontally via GSAP scrub
 *       </div>
 *     </div>
 *   </div>
 *
 * The heading is INSIDE the sticky div, absolute-positioned at the top.
 * When sticky kicks in, the heading stays put at the top of the viewport.
 * No GSAP pin, no spacer, no duplicate.
 */
export default function EditorialGallery({ wines }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const u = () => setIsMobile(mq.matches);
    u(); mq.addEventListener("change", u);
    return () => mq.removeEventListener("change", u);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const outer = outerRef.current;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!outer || !track || !sticky) return;

    const totalFrames = wines.length + 1;
    const slideW = window.innerWidth * 0.6;
    const totalShift = (totalFrames - 1) * slideW;
    const vh = window.innerHeight;

    // Section height: enough room for the horizontal scroll
    // The sticky kicks in when the sticky div top reaches viewport top.
    // We need totalShift px of scroll AFTER that for the horizontal movement.
    outer.style.height = `${vh + totalShift}px`;

    const updateFocus = () => {
      const cx = window.innerWidth / 2;
      const items = track.querySelectorAll<HTMLElement>("[data-frame]");
      const dots = outer.querySelectorAll<HTMLElement>("[data-dot]");
      let activeIdx = 0, bestDist = Infinity;

      items.forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const dist = Math.abs(c - cx) / slideW;
        if (dist < bestDist) { bestDist = dist; activeIdx = idx; }
        const focus = Math.max(0, 1 - dist * 0.95);

        const bottle = el.querySelector<HTMLElement>("[data-bottle]");
        const txt = el.querySelector<HTMLElement>("[data-text]");
        const prose = el.querySelectorAll<HTMLElement>("[data-prose]");
        const ghost = el.querySelector<HTMLElement>("[data-ghost]");

        if (bottle) gsap.to(bottle, { scale: 0.78 + focus * 0.30, rotate: -3 * focus, y: (1 - focus) * 22, opacity: 0.45 + focus * 0.55, filter: `blur(${(1 - focus) * 1.5}px)`, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        if (txt) gsap.to(txt, { scale: 0.95 + focus * 0.05, opacity: 0.35 + focus * 0.65, y: (1 - focus) * 14, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        prose.forEach(p => gsap.to(p, { opacity: focus * focus, duration: 0.4, ease: "power2.out", overwrite: "auto" }));
        if (ghost) gsap.to(ghost, { opacity: 0.10 + focus * 0.12, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      });

      const accent = wines[Math.min(activeIdx, wines.length - 1)]?.accent || "#9E825A";
      if (tintRef.current) tintRef.current.style.background = `radial-gradient(ellipse at 50% 50%, ${hexToRgba(accent, 0.06)} 0%, transparent 60%)`;
      dots.forEach((d, i) => {
        d.style.background = i === activeIdx ? (i < wines.length ? wines[i].accent : "#9E825A") : "rgba(158,130,90,0.25)";
        d.style.width = (i === activeIdx ? 44 : 22) + "px";
      });
    };

    const tween = gsap.to(track, {
      x: -totalShift,
      ease: "none",
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: updateFocus,
        onRefresh: () => {
          const newSlideW = window.innerWidth * 0.6;
          const newShift = (totalFrames - 1) * newSlideW;
          outer.style.height = `${window.innerHeight + newShift}px`;
          updateFocus();
        },
      },
    });

    updateFocus();
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [wines, isMobile]);

  if (isMobile) {
    return (
      <section id="collection" className="py-12 px-6" style={{ background: "var(--bg)" }}>
        <div className="mb-10 text-center">
          <span className="font-mono text-[10px] tracking-[4px] block mb-2" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>LA COLLECTION</span>
          <h2 className="font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(28px, 7vw, 44px)", color: "var(--ink)" }}>Nos cuvées</h2>
        </div>
        <div className="max-w-md mx-auto flex flex-col gap-12">
          {wines.map((wine, idx) => (
            <article key={wine.id} data-reveal className="flex flex-col items-center text-center" style={{ borderTop: idx === 0 ? "none" : "1px solid rgba(158,130,90,0.12)", paddingTop: idx === 0 ? 0 : "3rem" }}>
              <Image src={wine.image} alt={wine.name} width={150} height={400} className="object-contain mb-6" style={{ maxHeight: "44vh", width: "auto", filter: "drop-shadow(0 18px 30px rgba(14,14,12,0.18))" }} />
              <span className="font-mono text-[10px] tracking-[3px] mb-3" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")} — {wine.appellation}</span>
              <h3 className="font-serif font-light leading-[1] tracking-[-0.5px] mb-1" style={{ fontSize: "clamp(28px, 8vw, 38px)" }}>{wine.name}</h3>
              <p className="font-serif italic mt-3 mb-4 text-[14px]" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</p>
              <p className="font-sans text-[13px] leading-[1.85] mb-5" style={{ color: "var(--ink2)" }}>{wine.description}</p>
            </article>
          ))}
          <div className="text-center pt-8" style={{ borderTop: "1px solid rgba(158,130,90,0.12)" }}>
            <p className="font-serif italic text-[18px] mb-4" style={{ color: "var(--ink2)" }}>…et plus encore.</p>
            <a href="https://www.gonet-medeville.com" target="_blank" rel="noopener noreferrer" className="btn-fill inline-block" data-hover><span>Découvrir toutes nos cuvées</span></a>
          </div>
        </div>
      </section>
    );
  }

  const totalFrames = wines.length + 1;

  return (
    <div id="collection" ref={outerRef} className="relative" style={{ background: "var(--bg)" }}>
      {/* Sticky viewport */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        <div ref={tintRef} aria-hidden className="absolute inset-0 pointer-events-none" />

        {/* Heading */}
        <div className="absolute top-10 md:top-14 left-8 md:left-14 z-20 pointer-events-none">
          <span className="font-mono text-[10px] tracking-[4px] block mb-2" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>LA COLLECTION</span>
          <h2 className="font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--ink)" }}>Nos cuvées</h2>
        </div>

        {/* Track */}
        <div ref={trackRef} className="flex h-screen items-center" style={{ width: `${20 + totalFrames * 60}vw`, paddingLeft: "20vw", paddingRight: "20vw", willChange: "transform" }}>
          {wines.map((wine, idx) => (
            <div key={wine.id} data-frame className="flex-shrink-0 h-full flex items-center justify-center relative" style={{ width: "60vw" }}>
              <div className="w-full max-w-[1100px] mx-auto flex items-center gap-[clamp(28px,3vw,72px)] px-[clamp(20px,2vw,40px)]">
                <div data-bottle className="flex-shrink-0 will-change-transform" style={{ transformOrigin: "center center" }}>
                  <Image src={wine.image} alt={wine.name} width={240} height={620} className="object-contain select-none pointer-events-none" style={{ maxHeight: "62vh", width: "auto", filter: "drop-shadow(0 30px 60px rgba(14,14,12,0.25))" }} />
                </div>
                <div data-text className="flex-1 max-w-[440px] will-change-[opacity,transform]">
                  <span className="font-mono text-[10px] tracking-[3px] block mb-4" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")} — {wine.appellation}</span>
                  <h3 className="font-serif font-light leading-[0.98] tracking-[-1.5px]" style={{ fontSize: "clamp(36px, 4.2vw, 72px)" }}>
                    {wine.prefix !== "Champagne" && <span data-prose className="block text-[0.42em] font-normal opacity-60 mb-2" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                    <span>{wine.name}</span>
                  </h3>
                  <p data-prose className="font-serif italic mt-4 mb-7" style={{ color: "var(--ink2)", fontSize: "clamp(14px, 1.1vw, 17px)" }}>{wine.subtitle} — {wine.year}</p>
                  <p data-prose className="font-sans leading-[2] mb-8" style={{ color: "var(--ink2)", fontSize: "clamp(13px, 0.95vw, 14.5px)", maxWidth: "30vw" }}>{wine.description}</p>
                  <div data-prose className="flex gap-10 mb-8">
                    <div>
                      <span className="font-mono text-[10px] block mb-1.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>Cépages</span>
                      <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.blend}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] block mb-1.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>Vignoble</span>
                      <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.surface}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div data-ghost className="absolute bottom-[8%] right-[6%] font-serif font-light leading-none pointer-events-none select-none" style={{ fontSize: "clamp(80px, 12vw, 200px)", color: wine.accent, opacity: 0.14 }}>{wine.year}</div>
            </div>
          ))}
          {/* CTA */}
          <div data-frame className="flex-shrink-0 h-full flex items-center justify-center" style={{ width: "60vw" }}>
            <div data-text className="text-center max-w-[520px] px-8 will-change-[opacity,transform]">
              <div className="font-serif italic font-light mb-3" style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--gold)" }}>…et plus encore.</div>
              <h3 className="font-serif font-light leading-[1.05] tracking-[-1px] mb-6" style={{ fontSize: "clamp(32px, 3.5vw, 56px)", color: "var(--ink)" }}>14 cuvées, 4 appellations.</h3>
              <p data-prose className="font-sans text-[14px] leading-[1.9] mb-10" style={{ color: "var(--ink2)" }}>De la craie champenoise aux graves bordelaises.</p>
              <a href="https://www.gonet-medeville.com" target="_blank" rel="noopener noreferrer" className="btn-fill inline-block" data-hover data-cursor="open"><span>Découvrir toutes nos cuvées</span></a>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-none">
          {Array.from({ length: totalFrames }).map((_, i) => (
            <div key={i} data-dot className="h-[2px] rounded-full transition-all duration-500" style={{ width: 24, background: "rgba(158,130,90,0.25)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function hexToRgba(hex: string, a: number): string {
  const m = hex.replace("#", ""); const v = m.length === 3 ? m.split("").map(c => c + c).join("") : m;
  return `rgba(${parseInt(v.slice(0,2),16)}, ${parseInt(v.slice(2,4),16)}, ${parseInt(v.slice(4,6),16)}, ${a})`;
}
