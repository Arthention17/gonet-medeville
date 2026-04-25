"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const facts = [
  "MDCCX · ORIGINE", "PREIGNAC · SAUTERNAIS", "MESNIL-SUR-OGER · CHAMPAGNE", "MARGAUX · GRAVES", "20 ANS EN CUVES", "14 ANS SUR LATTES", "7 DOMAINES", "43 HECTARES", "VINIFICATION MAISON",
];

const quotes = [
  { stars: "1710", body: "Plus de trois siècles de viticulture familiale à Preignac, sans interruption.", who: "PATRIMOINE FAMILIAL" },
  { stars: "20 ans", body: "Château Gilette vieillit vingt ans en cuves béton avant mise en bouteille — une patience unique au monde.", who: "SIGNATURE GILETTE" },
  { stars: "7 ⁄ 4", body: "Sept domaines, quatre appellations — de la craie champenoise aux graves bordelaises, sous une seule signature familiale.", who: "GONET-MEDEVILLE" },
];

/**
 * La presse en parle — a marquee of critic names + a rotating featured quote.
 * The marquee is CSS-only; the quote auto-cycles every 5s with crossfade.
 */
export default function Press() {
  const root = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;

    // Quote rotation
    const items = quotesRef.current?.querySelectorAll<HTMLElement>("[data-quote]");
    if (!items || !items.length) return;
    items.forEach((q, i) => gsap.set(q, { opacity: i === 0 ? 1 : 0 }));
    let i = 0;
    const id = window.setInterval(() => {
      const cur = items[i];
      i = (i + 1) % items.length;
      const next = items[i];
      gsap.to(cur, { opacity: 0, duration: 0.6, ease: "power2.inOut" });
      gsap.fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.2, ease: "power2.inOut" });
    }, 5200);

    // Reveal lines
    const lines = r.querySelectorAll<HTMLElement>("[data-line]");
    gsap.set(lines, { yPercent: 110, opacity: 0 });
    gsap.to(lines, {
      yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: r, start: "top 75%", once: true },
    });

    return () => window.clearInterval(id);
  }, []);

  return (
    <section ref={root} className="relative py-24 md:py-32 overflow-hidden" style={{ background: "#0E0E0C", color: "#F7F5F0" }}>
      {/* Facts marquee */}
      <div className="overflow-hidden border-y mb-16 md:mb-20" style={{ borderColor: "rgba(247,245,240,0.08)" }}>
        <div className="flex gap-12 whitespace-nowrap py-5 animate-marquee" style={{ width: "fit-content" }}>
          {[0, 1].map(j => (
            <div key={j} className="flex gap-12 items-center">
              {facts.map((c, idx) => (
                <span key={idx} className="font-mono text-[11px] tracking-[4px] flex items-center gap-12" style={{ color: "rgba(247,245,240,0.5)", fontFamily: "'DM Mono', monospace" }}>
                  {c}
                  <span className="text-[var(--gold)] opacity-80">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-8 md:px-16 text-center">
        <div className="overflow-hidden mb-6"><span data-line className="inline-block font-mono text-[11px] tracking-[5px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>CE QUI NOUS DÉFINIT</span></div>

        <div ref={quotesRef} className="relative h-[260px] md:h-[200px]">
          {quotes.map((q, i) => (
            <div key={i} data-quote className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <div className="font-serif italic text-[var(--gold)] text-[18px] mb-4">{q.stars}</div>
              <blockquote className="font-serif font-light italic leading-[1.5] tracking-[-0.5px] max-w-[700px]" style={{ fontSize: "clamp(20px, 2.4vw, 32px)" }}>
                « {q.body} »
              </blockquote>
              <div className="font-mono text-[10px] tracking-[3px] mt-6" style={{ color: "rgba(247,245,240,0.55)", fontFamily: "'DM Mono', monospace" }}>{q.who}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
