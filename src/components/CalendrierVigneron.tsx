"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { photos } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const months = [
  { n: "JAN", title: "Taille", body: "Sous le froid, on choisit les futurs sarments." },
  { n: "MAR", title: "Réveil", body: "Les bourgeons s'ouvrent, la sève remonte." },
  { n: "MAI", title: "Floraison", body: "Quelques jours décident de la saison." },
  { n: "JUL", title: "Véraison", body: "Les grains rougissent, les arômes se forment." },
  { n: "SEP", title: "Vendanges", body: "L'année se cueille à la main, grain par grain." },
  { n: "NOV", title: "Repos", body: "La vigne dort. Le vin, lui, vit en cave." },
];

const monthImages = [
  photos.sunset,       // JAN — winter chapelle / cold landscape
  photos.rows,         // MAR — bare vines awakening
  photos.vineyard2,    // MAI — flowering panorama
  photos.grapes2,      // JUL — véraison, grain colour shift
  photos.grapes,       // SEP — harvest hands
  photos.cellar,       // NOV — rest, cellar
];

/**
 * Le calendrier du vigneron — six key moments of the year, each with a thumbnail
 * photo + label. Cards slide in stagger from below; on hover, the photo expands.
 */
export default function CalendrierVigneron() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const cards = r.querySelectorAll<HTMLElement>("[data-month]");
    cards.forEach((c, i) => {
      gsap.set(c, { y: 60, opacity: 0 });
      gsap.to(c, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: i * 0.08,
        scrollTrigger: { trigger: r, start: "top 80%", once: true },
      });
    });
  }, []);

  return (
    <section ref={root} className="relative py-20 md:py-24 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="font-mono text-[11px] tracking-[5px] block mb-3" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>UN AN À LA VIGNE</span>
            <h2 className="font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(34px, 4.5vw, 60px)", color: "var(--ink)" }}>
              Le calendrier <span className="italic" style={{ color: "var(--gold)" }}>du vigneron</span>.
            </h2>
          </div>
          <p className="font-serif italic font-light max-w-[360px]" style={{ color: "var(--ink2)", fontSize: "clamp(14px, 1.1vw, 17px)" }}>
            Six gestes, un cycle. Chaque saison écrit une ligne du millésime.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
          {months.map((m, i) => (
            <article
              key={m.n}
              data-month
              data-hover
              data-cursor="view"
              className="relative aspect-[3/4] overflow-hidden group"
            >
              <img src={monthImages[i]} alt={m.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08] photo-grade" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,14,12,0.18) 0%, rgba(14,14,12,0.7) 100%)" }} />
              <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
                <div className="font-mono text-[10px] tracking-[3px]" style={{ fontFamily: "'DM Mono', monospace" }}>{m.n}</div>
                <div>
                  <div className="font-serif text-[clamp(20px,1.6vw,28px)] font-light leading-none mb-2 tracking-[-0.5px]">{m.title}</div>
                  <p className="font-sans text-[11px] leading-[1.55] opacity-80">{m.body}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {/* Smooth fade into the next section's cream bg */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />
    </section>
  );
}
