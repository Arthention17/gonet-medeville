"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Wine } from "@/lib/wines";

gsap.registerPlugin(ScrollTrigger);

interface Props { wines: Wine[]; }

/**
 * Editorial wine gallery — horizontal scroll without card chrome.
 *
 * Each wine is just a bottle next to its text, free-floating on the page bg.
 * Scrolling translates a horizontal track. A per-frame loop reads each item's
 * distance to the viewport centre and applies opacity + scale + blur:
 *  - The centre item is sharp, full-size, full-opacity, full text.
 *  - Neighbours scale to ~0.7, fade to ~0.25, slightly blur, and the prose drops out.
 *
 * The result is a single sentence of meaning at any scroll position — the
 * eye is naturally led to the focused bottle.
 */
export default function EditorialGallery({ wines }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;

    const items = track.querySelectorAll<HTMLElement>("[data-frame]");
    const SLIDE_VW = 70;
    const slideW = (window.innerWidth * SLIDE_VW) / 100;
    const totalShift = (items.length - 1) * slideW;

    const updateFocus = () => {
      const cx = window.innerWidth / 2;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const dist = Math.abs(c - cx) / slideW;
        const focus = Math.max(0, 1 - dist * 1.05);
        const scale = 0.72 + focus * 0.28;
        const opacity = 0.22 + focus * 0.78;
        const blur = (1 - focus) * 4;

        const bottle = el.querySelector<HTMLElement>("[data-bottle]");
        const txt = el.querySelector<HTMLElement>("[data-text]");
        const prose = el.querySelectorAll<HTMLElement>("[data-prose]");

        if (bottle) {
          bottle.style.transform = `scale(${scale})`;
          bottle.style.filter = `drop-shadow(0 ${20 + focus * 40}px ${30 + focus * 50}px rgba(14,14,12,${0.15 + focus * 0.25})) blur(${blur * 0.4}px)`;
          bottle.style.opacity = String(opacity);
        }
        if (txt) {
          txt.style.opacity = String(opacity);
          txt.style.transform = `translateY(${(1 - focus) * 18}px)`;
        }
        prose.forEach((p) => {
          p.style.opacity = String(focus * focus);
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
        snap: { snapTo: 1 / (items.length - 1), duration: 0.6, ease: "power2.inOut" },
        onUpdate: updateFocus,
        onRefresh: updateFocus,
      },
    });

    updateFocus();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [wines.length]);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Track — horizontal flex, items are tall slim columns */}
      <div
        ref={trackRef}
        className="flex h-screen items-center"
        style={{
          width: `${15 + wines.length * 70}vw`,
          paddingLeft: "15vw",
          paddingRight: "15vw",
          willChange: "transform",
        }}
      >
        {wines.map((wine, idx) => (
          <div
            key={wine.id}
            data-frame
            className="flex-shrink-0 h-full flex items-center justify-center relative"
            style={{ width: "70vw" }}
          >
            <div className="w-full max-w-[1100px] mx-auto flex items-center gap-[clamp(28px,3vw,72px)] px-[clamp(20px,2vw,40px)]">
              {/* Bottle */}
              <div data-bottle className="flex-shrink-0 will-change-transform" style={{ transformOrigin: "center center", transition: "filter 0.3s ease" }}>
                <Image
                  src={wine.image}
                  alt={wine.name}
                  width={240}
                  height={620}
                  className="object-contain select-none pointer-events-none"
                  style={{ maxHeight: "62vh", width: "auto" }}
                />
              </div>

              {/* Text — no card, just floating */}
              <div data-text className="flex-1 max-w-[440px] will-change-[opacity,transform]" style={{ transition: "opacity 0.3s ease" }}>
                <span className="font-mono text-[10px] tracking-[3px] block mb-4" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>
                  {String(idx + 1).padStart(2, "0")} — {wine.appellation}
                </span>
                <h3 className="font-serif font-light leading-[0.98] tracking-[-1.5px]" style={{ fontSize: "clamp(36px, 4.2vw, 72px)" }}>
                  {wine.prefix !== "Champagne" && (
                    <span data-prose className="block text-[0.42em] font-normal opacity-60 mb-2" style={{ color: "var(--ink2)", transition: "opacity 0.4s" }}>{wine.prefix}</span>
                  )}
                  <span>{wine.name}</span>
                </h3>
                <p data-prose className="font-serif italic mt-4 mb-7" style={{ color: "var(--ink2)", fontSize: "clamp(14px, 1.1vw, 17px)", transition: "opacity 0.4s" }}>
                  {wine.subtitle} — {wine.year}
                </p>
                <p data-prose className="font-sans leading-[2] mb-8" style={{ color: "var(--ink2)", fontSize: "clamp(13px, 0.95vw, 14.5px)", maxWidth: "30vw", transition: "opacity 0.4s" }}>
                  {wine.description}
                </p>
                <div data-prose className="flex gap-10 mb-8" style={{ transition: "opacity 0.4s" }}>
                  <div>
                    <span className="font-mono text-[10px] block mb-1.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>Cépages</span>
                    <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.blend}</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] block mb-1.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>Vignoble</span>
                    <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.surface}</span>
                  </div>
                </div>
                <div data-prose style={{ transition: "opacity 0.4s" }}>
                  <button className="btn-fill" data-hover data-cursor="open"><span>Découvrir</span></button>
                </div>
              </div>
            </div>

            {/* Year ghost */}
            <div className="absolute bottom-[8%] right-[6%] font-serif font-light leading-none pointer-events-none select-none" style={{ fontSize: "clamp(80px, 12vw, 200px)", color: "rgba(158,130,90,0.05)" }}>{wine.year}</div>
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10 pointer-events-none">
        {wines.map((_, i) => (
          <div key={i} data-dot className="w-10 h-[1px]" style={{ background: "rgba(158,130,90,0.25)" }} />
        ))}
      </div>
    </section>
  );
}
