"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import { wines } from "@/lib/wines";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  // Refs
  const bottleSec = useRef<HTMLDivElement>(null);
  const bottleImg = useRef<HTMLDivElement>(null);
  const bottleText = useRef<HTMLDivElement>(null);
  const bottleNum = useRef<HTMLDivElement>(null);
  const quoteSec = useRef<HTMLDivElement>(null);
  const quoteBg = useRef<HTMLDivElement>(null);
  const gallerySec = useRef<HTMLDivElement>(null);
  const galleryTrack = useRef<HTMLDivElement>(null);
  const heritageSec = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // ── BOTTLE SHOWCASE (pinned) ──
      const btl = gsap.timeline({
        scrollTrigger: {
          trigger: bottleSec.current, start: "top top", end: "+=300%",
          pin: true, scrub: 1.2, anticipatePin: 1,
        }
      });
      btl
        .fromTo(bottleImg.current, { scale: 0.65, opacity: 0, y: 80 }, { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: "power2.out" })
        .to(bottleImg.current, { x: "-28vw", scale: 0.85, duration: 2, ease: "power1.inOut" }, "+=0.3")
        .fromTo(bottleText.current, { opacity: 0, x: 80, y: 20 }, { opacity: 1, x: 0, y: 0, duration: 1.5 }, "<0.5")
        .fromTo(bottleNum.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "<0.8")
        .to({}, { duration: 1 }) // pause
        .to(bottleImg.current, { scale: 2.2, y: "-20%", opacity: 0.3, duration: 2 }, "+=0.2")
        .to(bottleText.current, { opacity: 0, y: -40, duration: 1 }, "<0.3")
        .to(bottleNum.current, { opacity: 0, duration: 0.8 }, "<");

      // ── QUOTE (clip-path) ──
      gsap.fromTo(quoteBg.current,
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(85% at 50% 50%)",
          scrollTrigger: { trigger: quoteSec.current, start: "top 60%", end: "center center", scrub: 1 }
        }
      );

      // ── HORIZONTAL GALLERY (pinned) ──
      if (galleryTrack.current && gallerySec.current) {
        const tw = galleryTrack.current.scrollWidth - window.innerWidth;
        gsap.to(galleryTrack.current, {
          x: -tw, ease: "none",
          scrollTrigger: {
            trigger: gallerySec.current, start: "top top", end: () => `+=${tw}`,
            pin: true, scrub: 1.5, anticipatePin: 1,
          }
        });
      }

      // ── HERITAGE ITEMS ──
      gsap.utils.toArray<HTMLElement>("[data-heritage]").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50, x: i % 2 === 0 ? -30 : 30 },
          { opacity: 1, y: 0, x: 0, duration: 1,
            scrollTrigger: { trigger: el, start: "top 80%" }
          }
        );
      });
    });

    // ── GENERIC REVEALS ──
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" }
        }
      );
    });

    return () => mm.revert();
  }, [ready]);

  const L1 = "Gonet".split("");
  const L2 = "Médeville".split("");

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {!ready && <Preloader onComplete={onDone} />}

      <main style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <Nav />

        {/* ════════════════════════════════════════
            HERO — Asymmetric, editorial
        ════════════════════════════════════════ */}
        <section className="h-screen flex items-end md:items-center relative overflow-hidden pb-24 md:pb-0">
          {/* Warm gradient bg */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, #EDE8DF 0%, var(--bg) 45%, #E6DFD3 100%)" }} />
          
          {/* Decorative large text */}
          <div className="absolute right-[-5%] top-[15%] font-serif text-[clamp(200px,25vw,400px)] font-light leading-none select-none pointer-events-none" style={{ color: "rgba(158,130,90,0.04)" }}>
            1710
          </div>

          <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-[1400px]">
            {/* Eyebrow — left aligned, understated */}
            <div className="mb-6 md:mb-8" style={{
              opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(15px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s",
            }}>
              <span className="font-mono text-[11px] tracking-[1px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
                Bordeaux &mdash; Champagne
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif font-light leading-[0.85] mb-8">
              <span className="block text-[clamp(60px,11vw,160px)] tracking-[-3px]">
                {L1.map((c, i) => (
                  <span key={i} className="inline-block" style={{
                    color: "var(--ink)", opacity: ready ? 1 : 0,
                    transform: ready ? "translateY(0)" : "translateY(110%)",
                    transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${0.5 + i * 0.05}s`,
                  }}>{c}</span>
                ))}
              </span>
              <span className="block text-[clamp(44px,8vw,120px)] tracking-[-1px] italic" style={{ color: "var(--gold)" }}>
                {L2.map((c, i) => (
                  <span key={i} className="inline-block" style={{
                    opacity: ready ? 1 : 0,
                    transform: ready ? "translateY(0)" : "translateY(110%)",
                    transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${0.75 + i * 0.04}s`,
                  }}>{c}</span>
                ))}
              </span>
            </h1>

            {/* Subtitle — not centered, editorial */}
            <div className="max-w-[420px]" style={{
              opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.6s",
            }}>
              <p className="font-sans text-[14px] leading-[1.8] font-normal" style={{ color: "var(--ink2)" }}>
                Vignobles familiaux depuis trois siècles. Sept domaines d&apos;exception, 
                de la craie champenoise aux graves bordelaises.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <button className="btn-fill" data-hover><span>Explorer</span></button>
                <span className="font-mono text-[11px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>
                  Est. 1710
                </span>
              </div>
            </div>
          </div>

          {/* Scroll indicator — bottom right */}
          <div className="absolute bottom-8 right-12 flex items-center gap-3" style={{
            opacity: ready ? 1 : 0, transition: "opacity 1s ease 2s",
          }}>
            <span className="font-mono text-[10px] tracking-[1px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>scroll</span>
            <div className="w-[1px] h-12 relative overflow-hidden" style={{ background: "rgba(158,130,90,0.2)" }}>
              <div className="w-full h-1/2 bg-[var(--gold)]" style={{ animation: "scrollLine 2.5s ease-in-out infinite" }} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            BOTTLE SHOWCASE — Pinned, cinematic
        ════════════════════════════════════════ */}
        <section ref={bottleSec} className="h-screen flex items-center justify-center relative" style={{ background: "var(--bg)" }}>
          <div ref={bottleImg} className="absolute z-10 opacity-0" style={{
            filter: "drop-shadow(0 40px 80px rgba(14,14,12,0.2))"
          }}>
            <Image src={wines[0].image} alt={wines[0].name} width={280} height={700} priority
              className="object-contain select-none pointer-events-none" style={{ maxHeight: "78vh" }} />
          </div>

          <div ref={bottleText} className="absolute right-[8%] lg:right-[12%] top-1/2 -translate-y-1/2 max-w-[420px] opacity-0">
            <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>
              001 / Sauternes
            </span>
            <h2 className="font-serif text-[clamp(34px,3.5vw,50px)] font-light leading-[1.1] mb-3">
              Château Gilette
            </h2>
            <p className="font-serif text-[15px] italic mb-8" style={{ color: "var(--ink2)" }}>
              Crème de Tête — {wines[0].year}
            </p>
            <p className="font-sans text-[13px] leading-[2] font-normal mb-8" style={{ color: "var(--ink2)" }}>
              {wines[0].description}
            </p>
            <div className="flex gap-12 mb-10">
              <div>
                <span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cépages</span>
                <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].blend}</span>
              </div>
              <div>
                <span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span>
                <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].surface}</span>
              </div>
            </div>
            <button className="btn-fill" data-hover><span>Fiche complète</span></button>
          </div>

          <div ref={bottleNum} className="absolute left-[6%] bottom-[10%] opacity-0">
            <div className="font-serif text-[clamp(80px,10vw,140px)] font-light leading-none" style={{ color: "rgba(158,130,90,0.06)" }}>
              01
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            QUOTE — Circular reveal
        ════════════════════════════════════════ */}
        <section ref={quoteSec} className="min-h-[80vh] flex items-center justify-center relative py-32">
          <div ref={quoteBg} className="absolute inset-0 flex items-center justify-center" style={{
            background: "var(--ink)", clipPath: "circle(0% at 50% 50%)"
          }}>
            <div className="max-w-[600px] px-8 text-center" style={{ color: "#F7F5F0" }}>
              <blockquote className="font-serif text-[clamp(20px,2.8vw,34px)] font-light italic leading-[1.6]">
                Nous créons des vins vivants, reflets de notre savoir-faire et de notre culture.
              </blockquote>
              <div className="mt-10 font-mono text-[10px] tracking-[1px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
                Julie &amp; Xavier &mdash; Preignac, France
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            COLLECTION — Header
        ════════════════════════════════════════ */}
        <div className="px-8 md:px-16 lg:px-24 py-24 md:py-32">
          <div className="flex items-end justify-between flex-wrap gap-6" data-reveal>
            <div>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>
                La collection
              </span>
              <h2 className="font-serif text-[clamp(38px,5vw,64px)] font-light leading-none">
                Nos vins
              </h2>
            </div>
            <p className="font-sans text-[13px] max-w-[350px] leading-[1.8]" style={{ color: "var(--ink2)" }}>
              Quatre appellations, sept domaines — chaque bouteille porte l&apos;empreinte 
              de son terroir et le style de ses vignerons.
            </p>
          </div>
          <div className="w-full h-[1px] mt-10" style={{ background: "rgba(158,130,90,0.12)" }} />
        </div>

        {/* ════════════════════════════════════════
            HORIZONTAL GALLERY — Pinned
        ════════════════════════════════════════ */}
        <section ref={gallerySec} className="relative overflow-hidden">
          <div ref={galleryTrack} className="flex h-screen items-center" style={{ width: `${wines.length * 100}vw` }}>
            {wines.map((wine, idx) => (
              <div key={wine.id} className="w-screen h-screen flex items-center flex-shrink-0 relative">
                <div className="w-full max-w-[1200px] mx-auto px-8 md:px-16 flex items-center gap-[clamp(32px,5vw,80px)]" style={{
                  flexDirection: idx % 2 === 0 ? "row" : "row-reverse"
                }}>
                  {/* Bottle photo */}
                  <div className="flex-shrink-0 relative">
                    <div style={{ filter: "drop-shadow(0 30px 60px rgba(14,14,12,0.18))" }}>
                      <Image src={wine.image} alt={wine.name} width={200} height={520} className="object-contain select-none" style={{ maxHeight: "62vh" }} />
                    </div>
                    {/* Number below bottle */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[2px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 max-w-[460px]">
                    <span className="font-mono text-[10px] tracking-[1px] block mb-4" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>
                      {wine.appellation}
                    </span>
                    <h3 className="font-serif text-[clamp(30px,3.5vw,50px)] font-light leading-[1.1] mb-1">
                      {wine.prefix !== "Champagne" && <span className="block text-[0.55em] font-normal" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                      {wine.name}
                    </h3>
                    <p className="font-serif text-[14px] italic mt-2 mb-8" style={{ color: "var(--ink2)" }}>
                      {wine.subtitle} — {wine.year}
                    </p>
                    <p className="font-sans text-[13px] leading-[2] font-normal mb-10" style={{ color: "var(--ink2)" }}>
                      {wine.description}
                    </p>
                    <div className="flex gap-10 mb-10">
                      <div>
                        <span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cépages</span>
                        <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.blend}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span>
                        <span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.surface}</span>
                      </div>
                    </div>
                    <button className="btn-fill" data-hover><span>Découvrir</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            MARQUEE — Appellations
        ════════════════════════════════════════ */}
        <div className="py-12 overflow-hidden" style={{ borderTop: "1px solid rgba(158,130,90,0.08)", borderBottom: "1px solid rgba(158,130,90,0.08)" }}>
          <div className="flex gap-20 whitespace-nowrap animate-marquee" style={{ width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-20 items-center">
              {["Sauternes","·","Champagne Grand Cru","·","Margaux","·","Graves","·","Bordeaux Supérieur","·"].map((t,i) =>
                <span key={i} className={t==="·" ? "text-[8px] text-[var(--gold)] opacity-40" : "font-serif text-[clamp(24px,3.5vw,44px)] font-light italic text-[var(--ink)]"}>{t}</span>
              )}
            </div>)}
          </div>
        </div>

        {/* ════════════════════════════════════════
            HÉRITAGE — Editorial magazine layout
        ════════════════════════════════════════ */}
        <section ref={heritageSec} className="py-32 md:py-40 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-end gap-6 mb-20" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Héritage</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.12)" }} />
            </div>

            <div className="space-y-16 md:space-y-24">
              {[
                { year: "1710", text: "La famille Despujols acquiert les terres de Preignac. Naissance de Gilette et Les Justices au cœur du Sauternais.", side: "left" },
                { year: "1930", text: "René Médeville découvre par accident le vieillissement long en cuves béton. Une technique unique qui deviendra la signature de Gilette.", side: "right" },
                { year: "2000", text: "Xavier Gonet et Julie Médeville unissent deux lignées viticoles. Les Champagnes Gonet-Médeville naissent sur les coteaux de Bisseuil.", side: "left" },
                { year: "2009", text: "Acquisition du Château des Eyrins — 3 hectares de graves profondes entourés par les vignes de Château Margaux.", side: "right" },
              ].map((item, i) => (
                <div key={i} data-heritage className={`flex items-start gap-8 md:gap-16 ${item.side === "right" ? "md:flex-row-reverse md:text-right" : ""}`}>
                  <div className="flex-shrink-0">
                    <span className="font-serif text-[clamp(48px,7vw,96px)] font-light leading-none" style={{ color: "rgba(158,130,90,0.15)" }}>
                      {item.year}
                    </span>
                  </div>
                  <div className="max-w-[400px] pt-3 md:pt-6">
                    <p className="font-sans text-[14px] leading-[1.9]" style={{ color: "var(--ink2)" }}>
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            TERROIRS — Dark, atmospheric
        ════════════════════════════════════════ */}
        <section className="relative py-32 md:py-40 px-8 md:px-16 lg:px-24" style={{ background: "var(--ink)", color: "#F7F5F0" }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row gap-16 md:gap-24">
              <div className="flex-1" data-reveal>
                <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>
                  Nos terroirs
                </span>
                <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-light leading-[1.15] mb-8">
                  De la craie à la grave
                </h2>
                <p className="font-sans text-[13px] leading-[2] max-w-[400px]" style={{ color: "rgba(247,245,240,0.45)" }}>
                  Chaque domaine est le fruit d&apos;un terroir singulier, 
                  façonné par des siècles de géologie et de savoir-faire humain.
                </p>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-12">
                {[
                  { name: "Champagne", detail: "Craie · 3 Grands Crus", ha: "12 ha" },
                  { name: "Sauternes", detail: "Sable et calcaire", ha: "13 ha" },
                  { name: "Margaux", detail: "Graves profondes", ha: "2,9 ha" },
                  { name: "Graves", detail: "Graves et argile", ha: "15 ha" },
                ].map((t, i) => (
                  <div key={t.name} data-reveal className="group">
                    <div className="font-serif text-[22px] font-light mb-2 group-hover:text-[var(--gold)] transition-colors duration-500">{t.name}</div>
                    <div className="font-sans text-[11px] leading-relaxed" style={{ color: "rgba(247,245,240,0.35)" }}>{t.detail}</div>
                    <div className="font-mono text-[11px] mt-2" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{t.ha}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CHIFFRES — Minimal, impactful
        ════════════════════════════════════════ */}
        <section className="py-28 px-8 md:px-16">
          <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { n: "1710", l: "Fondation" },
              { n: "7", l: "Domaines" },
              { n: "43", l: "Hectares" },
              { n: "~17k", l: "Caisses / an" },
            ].map((s, i) => (
              <div key={i} className="text-center" data-reveal>
                <div className="font-serif text-[clamp(36px,5vw,56px)] font-light leading-none">{s.n}</div>
                <div className="font-mono text-[10px] tracking-[1px] mt-3" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════
            FOOTER — Clean, editorial
        ════════════════════════════════════════ */}
        <footer className="py-16 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1200px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
              <div>
                <div className="font-serif text-[24px] font-light mb-3">Gonet-Médeville</div>
                <p className="font-sans text-[12px] leading-relaxed" style={{ color: "var(--ink2)" }}>
                  Vignobles familiaux<br />Bordeaux &amp; Champagne
                </p>
              </div>
              <div className="flex gap-16">
                <div>
                  <span className="font-mono text-[10px] block mb-3 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Adresse</span>
                  <p className="font-sans text-[12px] leading-loose" style={{ color: "var(--ink2)" }}>4 Rue du Port<br />33210 Preignac</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] block mb-3 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Contact</span>
                  <p className="font-sans text-[12px] leading-loose" style={{ color: "var(--ink2)" }}>+33 5 56 76 28 44<br />contact@gonet-medeville.com</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-8" style={{ borderTop: "1px solid rgba(158,130,90,0.1)" }}>
              <span className="font-mono text-[9px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>
                L&apos;abus d&apos;alcool est dangereux pour la santé
              </span>
              <span className="font-mono text-[9px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>
                © 2024 Gonet-Médeville
              </span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
