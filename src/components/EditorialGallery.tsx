"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Wine } from "@/lib/wines";

gsap.registerPlugin(ScrollTrigger);

interface Props { wines: Wine[]; }

/**
 * Editorial wine gallery — horizontal "deck" with continuous focus.
 *
 * - 60vw per frame; 2-3 visible at once (centre + neighbours peeking)
 * - Centre frame: scale 1.08, bottle tilt -3deg, full opacity, prose visible
 * - Neighbours: scale ~0.75, opacity ~0.4, slight blur, prose hidden
 * - Focus is a CONTINUOUS function of distance to viewport centre
 *   (smoothed via gsap.to with duration 0.6 + power2.out — never gsap.set)
 * - Snap is "sticky" (duration 0.8, delay 0.1) so the eye lingers on each wine
 * - Section background tints subtly toward the active wine's accent colour
 * - Year ghost uses the active wine's accent at opacity 0.14
 * - Progress dots: active dot adopts the active wine's accent colour
 */
export default function EditorialGallery({ wines }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const items = track.querySelectorAll<HTMLElement>("[data-frame]");
    const dots = sec.querySelectorAll<HTMLElement>("[data-dot]");
    const SLIDE_VW = 60;
    const slideW = (window.innerWidth * SLIDE_VW) / 100;
    const totalShift = (items.length - 1) * slideW;

    const updateFocus = () => {
      const cx = window.innerWidth / 2;
      let activeIdx = 0;
      let bestDist = Infinity;

      items.forEach((el, idx) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const dist = Math.abs(c - cx) / slideW;
        if (dist < bestDist) { bestDist = dist; activeIdx = idx; }

        // continuous focus 0..1
        const focus = Math.max(0, 1 - dist * 0.95);

        const bottle = el.querySelector<HTMLElement>("[data-bottle]");
        const txt = el.querySelector<HTMLElement>("[data-text]");
        const prose = el.querySelectorAll<HTMLElement>("[data-prose]");
        const ghost = el.querySelector<HTMLElement>("[data-ghost]");

        // bottle: scale 0.78 -> 1.08, tilt -3deg at full focus, slight blur on neighbours
        if (bottle) {
          gsap.to(bottle, {
            scale: 0.78 + focus * 0.30,
            rotate: -3 * focus,
            y: (1 - focus) * 22,
            opacity: 0.45 + focus * 0.55,
            filter: `blur(${(1 - focus) * 1.5}px)`,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        // text block: smoother focus, less brutal opacity gap
        if (txt) {
          gsap.to(txt, {
            scale: 0.95 + focus * 0.05,
            opacity: 0.35 + focus * 0.65,
            y: (1 - focus) * 14,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        prose.forEach((p) => {
          gsap.to(p, { opacity: focus * focus, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        });
        if (ghost) {
          gsap.to(ghost, { opacity: 0.08 + focus * 0.10, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        }
      });

      // Active accent — section tint + dots
      const accent = wines[activeIdx]?.accent || "#9E825A";
      if (tintRef.current) {
        gsap.to(tintRef.current, {
          background: `radial-gradient(ellipse at 50% 50%, ${hexToRgba(accent, 0.06)} 0%, transparent 60%)`,
          duration: 0.8,
          ease: "power2.out",
        });
      }
      dots.forEach((d, i) => {
        gsap.to(d, {
          background: i === activeIdx ? accent : "rgba(158,130,90,0.25)",
          width: i === activeIdx ? "44px" : "22px",
          duration: 0.5,
          ease: "power2.out",
        });
      });
    };

    const tween = gsap.to(track, {
      x: -totalShift,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: () => `+=${totalShift * 1.6}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (items.length - 1),
          duration: 0.8,
          delay: 0.1,
          ease: "power2.inOut",
        },
        onUpdate: updateFocus,
        onRefresh: updateFocus,
      },
    });

    updateFocus();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [wines, isMobile]);

  if (isMobile) {
    return (
      <section className="py-12 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-md mx-auto flex flex-col gap-12">
          {wines.map((wine, idx) => (
            <article key={wine.id} data-reveal className="flex flex-col items-center text-center" style={{ borderTop: idx === 0 ? "none" : "1px solid rgba(158,130,90,0.12)", paddingTop: idx === 0 ? 0 : "3rem" }}>
              <Image src={wine.image} alt={wine.name} width={150} height={400} className="object-contain mb-6" style={{ maxHeight: "44vh", width: "auto", filter: "drop-shadow(0 18px 30px rgba(14,14,12,0.18))" }} />
              <span className="font-mono text-[10px] tracking-[3px] mb-3" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")} — {wine.appellation}</span>
              <h3 className="font-serif font-light leading-[1] tracking-[-0.5px] mb-1" style={{ fontSize: "clamp(28px, 8vw, 38px)" }}>
                {wine.prefix !== "Champagne" && <span className="block text-[0.5em] font-normal opacity-60 mb-1" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                {wine.name}
              </h3>
              <p className="font-serif italic mt-3 mb-4 text-[14px]" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</p>
              <p className="font-sans text-[13px] leading-[1.85] mb-5" style={{ color: "var(--ink2)" }}>{wine.description}</p>
              <button className="btn-fill" data-hover><span>Découvrir</span></button>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Accent-coloured tint that fades between wines */}
      <div ref={tintRef} aria-hidden className="absolute inset-0 pointer-events-none transition-[background] duration-700" />

      {/* Fixed chapter heading — visible during the entire horizontal scroll */}
      <div className="absolute top-10 md:top-14 left-8 md:left-14 z-20 pointer-events-none">
        <span className="font-mono text-[10px] tracking-[4px] block mb-2" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
          CHAPITRE III — LA COLLECTION
        </span>
        <h2 className="font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "var(--ink)" }}>
          Nos cuvées
        </h2>
      </div>

      <div
        ref={trackRef}
        className="flex h-screen items-center"
        style={{
          width: `${20 + wines.length * 60}vw`,
          paddingLeft: "20vw",
          paddingRight: "20vw",
          willChange: "transform",
        }}
      >
        {wines.map((wine, idx) => (
          <div
            key={wine.id}
            data-frame
            className="flex-shrink-0 h-full flex items-center justify-center relative"
            style={{ width: "60vw" }}
          >
            <div className="w-full max-w-[1100px] mx-auto flex items-center gap-[clamp(28px,3vw,72px)] px-[clamp(20px,2vw,40px)]">
              {/* Bottle — always on the left */}
              <div data-bottle className="flex-shrink-0 will-change-transform" style={{ transformOrigin: "center center" }}>
                <Image
                  src={wine.image}
                  alt={wine.name}
                  width={240}
                  height={620}
                  className="object-contain select-none pointer-events-none"
                  style={{
                    maxHeight: "62vh",
                    width: "auto",
                    filter: "drop-shadow(0 30px 60px rgba(14,14,12,0.25))",
                  }}
                />
              </div>

              {/* Text — always on the right, no card chrome */}
              <div data-text className="flex-1 max-w-[440px] will-change-[opacity,transform]">
                <span className="font-mono text-[10px] tracking-[3px] block mb-4" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>
                  {String(idx + 1).padStart(2, "0")} — {wine.appellation}
                </span>
                <h3 className="font-serif font-light leading-[0.98] tracking-[-1.5px]" style={{ fontSize: "clamp(36px, 4.2vw, 72px)" }}>
                  {wine.prefix !== "Champagne" && (
                    <span data-prose className="block text-[0.42em] font-normal opacity-60 mb-2" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>
                  )}
                  <span>{wine.name}</span>
                </h3>
                <p data-prose className="font-serif italic mt-4 mb-7" style={{ color: "var(--ink2)", fontSize: "clamp(14px, 1.1vw, 17px)" }}>
                  {wine.subtitle} — {wine.year}
                </p>
                <p data-prose className="font-sans leading-[2] mb-8" style={{ color: "var(--ink2)", fontSize: "clamp(13px, 0.95vw, 14.5px)", maxWidth: "30vw" }}>
                  {wine.description}
                </p>
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
                <div data-prose>
                  <button className="btn-fill" data-hover data-cursor="open"><span>Découvrir</span></button>
                </div>
              </div>
            </div>

            {/* Year ghost — uses wine's accent colour */}
            <div data-ghost className="absolute bottom-[8%] right-[6%] font-serif font-light leading-none pointer-events-none select-none" style={{ fontSize: "clamp(80px, 12vw, 200px)", color: wine.accent, opacity: 0.05 }}>
              {wine.year}
            </div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-none">
        {wines.map((_, i) => (
          <div key={i} data-dot className="h-[2px] rounded-full" style={{ width: 24, background: "rgba(158,130,90,0.25)" }} />
        ))}
      </div>
    </section>
  );
}

function hexToRgba(hex: string, a: number): string {
  const m = hex.replace("#", "");
  const v = m.length === 3 ? m.split("").map(c => c + c).join("") : m;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
