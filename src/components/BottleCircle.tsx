"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Wine } from "@/lib/wines";

gsap.registerPlugin(ScrollTrigger);

interface Props { wines: Wine[]; }

/**
 * Bottle circle — pinned scene where the gallery's bottles regroup at centre,
 * arrange themselves in a circle (caps pointing inward), and slowly rotate
 * as the user scrolls. The centre text changes between scroll phases.
 *
 * Each bottle is positioned via CSS transform composition:
 *   rotate(angle) translateX(radius) rotate(-angle)
 * The first rotate places the bottle on the circle, the second cancels the
 * tilt so each bottle still reads upright (then we add a 180deg flip so the
 * cap points to the centre).
 */
export default function BottleCircle({ wines }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);

  const labels = [
    { big: "Sept", small: "DOMAINES" },
    { big: "Trois", small: "SIÈCLES" },
    { big: "Quatorze", small: "CUVÉES" },
    { big: "43", small: "HECTARES" },
  ];

  useEffect(() => {
    const sec = sectionRef.current;
    const sticky = stickyRef.current;
    const group = groupRef.current;
    if (!sec || !sticky || !group) return;

    // Bottles begin "scattered" off-screen — we'll animate them into the circle
    const bottles = group.querySelectorAll<HTMLElement>("[data-circle-bottle]");
    bottles.forEach((b, i) => {
      const r = i % 2 === 0 ? -1 : 1;
      gsap.set(b, { x: r * (window.innerWidth * 0.6), y: (i < 2 ? -1 : 1) * 60, opacity: 0, scale: 0.7 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "+=300%",
        pin: sticky,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1 (0–0.25): bottles fly in to their circle slots
    bottles.forEach((b) => {
      tl.to(b, { x: 0, y: 0, opacity: 1, scale: 1, ease: "power3.out", duration: 0.3 }, 0);
    });

    // Phase 2 (0.25–0.95): the whole group rotates one full turn slowly
    tl.to(group, { rotate: 360, ease: "none", duration: 1 }, 0.25);

    // Phase 3 — cycle the centre labels via timeline labels
    const labelEls = labelsRef.current?.querySelectorAll<HTMLElement>("[data-label]");
    if (labelEls && labelEls.length === labels.length) {
      labelEls.forEach((el, i) => {
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 });
      });
      const segLen = 0.7 / labels.length;
      labelEls.forEach((el, i) => {
        if (i === 0) return;
        const at = 0.25 + segLen * i;
        tl.to(labelEls[i - 1], { opacity: 0, y: -24, duration: 0.2, ease: "power2.in" }, at - 0.1);
        tl.to(el, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, at);
      });
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Pre-compute bottle positions on a circle of radius 220px
  const radius = 220;
  const angles = wines.map((_, i) => (360 / wines.length) * i);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "300vh", background: "var(--bg)" }}>
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: "var(--bg)" }}>
        {/* Faint radial spotlight to lift the centre */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(232,199,121,0.06) 0%, transparent 55%)" }} />

        {/* Section label */}
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="font-mono text-[11px] tracking-[5px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>UNE MAISON · UNE GAMME</span>
        </div>

        {/* Centre text stack — always at viewport centre, NOT rotated */}
        <div ref={labelsRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative h-32 flex items-center justify-center">
            {labels.map((l, i) => (
              <div key={i} data-label className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif font-light leading-none tracking-[-2px]" style={{ fontSize: "clamp(70px, 9vw, 140px)", color: "var(--ink)" }}>{l.big}</span>
                <span className="font-mono text-[10px] tracking-[5px] mt-3" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{l.small}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rotating bottle group */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={groupRef} className="relative will-change-transform" style={{ width: 0, height: 0 }}>
            {wines.map((wine, i) => (
              <div
                key={wine.id}
                data-circle-bottle
                className="absolute will-change-transform"
                style={{
                  top: 0,
                  left: 0,
                  // place at ring position, then flip so cap points centre
                  transform: `rotate(${angles[i]}deg) translate(0, -${radius}px) rotate(180deg)`,
                  transformOrigin: "0 0",
                  filter: "drop-shadow(0 25px 40px rgba(14,14,12,0.25))",
                }}
              >
                <div style={{ transform: "translate(-50%, -50%)", marginLeft: 0, marginTop: 0 }}>
                  <Image
                    src={wine.image}
                    alt={wine.name}
                    width={90}
                    height={240}
                    className="object-contain select-none pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faint legend */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 text-center">
          <p className="font-serif italic font-light text-[clamp(13px,1.1vw,15px)]" style={{ color: "var(--ink2)" }}>
            La famille tournée vers son terroir.
          </p>
        </div>
      </div>
    </section>
  );
}
