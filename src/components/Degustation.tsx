"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "01", title: "L'œil", body: "L'or pâle se trouble en éclats de soleil. La densité est lue avant même que le verre ne soit porté aux lèvres." },
  { num: "02", title: "Le nez", body: "Trois mouvements : l'arôme primaire du fruit, le secondaire du temps, le tertiaire qui ne se livre qu'à ceux qui savent attendre." },
  { num: "03", title: "La bouche", body: "Une attaque franche, un milieu qui se déploie en strates, une finale qui laisse l'écho d'un terroir." },
  { num: "04", title: "Le silence", body: "Ce qui demeure une fois le verre vide. Pour un grand vin, le silence dure des minutes." },
];

/**
 * L'art de la dégustation — four phases of tasting, presented as a numbered ritual.
 * Each step reveals on scroll with a subtle horizontal slide; the column dividers draw in.
 */
export default function Degustation() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const cols = r.querySelectorAll<HTMLElement>("[data-step]");
    const dividers = r.querySelectorAll<HTMLElement>("[data-divider]");

    cols.forEach((c, i) => {
      gsap.set(c, { y: 40, opacity: 0 });
      gsap.to(c, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: i * 0.12,
        scrollTrigger: { trigger: r, start: "top 75%", once: true },
      });
    });
    dividers.forEach((d, i) => {
      gsap.set(d, { scaleY: 0, transformOrigin: "top center" });
      gsap.to(d, {
        scaleY: 1, duration: 1.2, ease: "power3.out", delay: 0.4 + i * 0.12,
        scrollTrigger: { trigger: r, start: "top 75%", once: true },
      });
    });
  }, []);

  return (
    <section ref={root} className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <span className="font-mono text-[11px] tracking-[5px] block mb-4" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>RITUEL</span>
          <h2 className="font-serif font-light italic tracking-[-1px]" style={{ fontSize: "clamp(34px, 4.5vw, 64px)", color: "var(--ink)" }}>
            L&apos;art de la dégustation.
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0">
          {steps.map((s, i) => (
            <div key={s.num} data-step className="relative md:px-8 lg:px-10">
              {i > 0 && (
                <div data-divider className="hidden md:block absolute left-0 top-2 bottom-2 w-[1px]" style={{ background: "rgba(158,130,90,0.18)" }} />
              )}
              <div className="font-mono text-[10px] tracking-[3px] mb-4" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{s.num}</div>
              <h3 className="font-serif font-light leading-[1] tracking-[-0.5px] mb-5" style={{ fontSize: "clamp(28px, 2.4vw, 40px)", color: "var(--ink)" }}>
                {s.title}
              </h3>
              <p className="font-sans leading-[1.85]" style={{ fontSize: "clamp(13px, 0.95vw, 14.5px)", color: "var(--ink2)" }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
