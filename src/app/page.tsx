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
import { photos } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  const bottleSec = useRef<HTMLDivElement>(null);
  const bottleImg = useRef<HTMLDivElement>(null);
  const bottleText = useRef<HTMLDivElement>(null);
  const bottleNum = useRef<HTMLDivElement>(null);
  const quoteSec = useRef<HTMLDivElement>(null);
  const quoteBg = useRef<HTMLDivElement>(null);
  const gallerySec = useRef<HTMLDivElement>(null);
  const galleryTrack = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const fillLevel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Parallax
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach(el => {
        gsap.to(el, { y: `${parseFloat(el.dataset.speed || "0") * 100}`, ease: "none",
          scrollTrigger: { trigger: el.closest("section, div") || el, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      // ── BOTTLE PINNED ──
      const btl = gsap.timeline({
        scrollTrigger: { trigger: bottleSec.current, start: "top top", end: "+=280%", pin: true, scrub: 1 }
      });
      btl
        .fromTo(bottleImg.current, { scale: 0.55, opacity: 0, y: 80, rotateY: -15 }, { scale: 1, opacity: 1, y: 0, rotateY: 0, duration: 1.5, ease: "power2.out" })
        .to(bottleImg.current, { x: "-25vw", scale: 0.82, duration: 2 }, "+=0.3")
        .fromTo(bottleText.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.5 }, "<0.6")
        .fromTo(bottleNum.current, { opacity: 0, y: 20 }, { opacity: 0.2, y: 0, duration: 1 }, "<0.5")
        .to({}, { duration: 1.5 })
        .to(bottleImg.current, { scale: 2.5, y: "-22%", opacity: 0, rotateY: 15, duration: 2.5 })
        .to([bottleText.current, bottleNum.current], { opacity: 0, duration: 0.8 }, "<");

      // ── WINE FILL ANIMATION ──
      if (fillRef.current && fillLevel.current) {
        gsap.fromTo(fillLevel.current, { height: "0%" },
          { height: "70%", ease: "power1.inOut",
            scrollTrigger: { trigger: fillRef.current, start: "top 60%", end: "bottom 40%", scrub: 1 }
          });
      }

      // ── QUOTE ──
      gsap.fromTo(quoteBg.current, { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(85% at 50% 50%)", scrollTrigger: { trigger: quoteSec.current, start: "top 55%", end: "center center", scrub: 1 } });

      // ── GALLERY — SNAP to each wine ──
      if (galleryTrack.current && gallerySec.current) {
        const tw = galleryTrack.current.scrollWidth - window.innerWidth;
        gsap.to(galleryTrack.current, { x: -tw, ease: "none",
          scrollTrigger: {
            trigger: gallerySec.current, start: "top top", end: () => `+=${tw}`,
            pin: true, scrub: 0.8, anticipatePin: 1,
            snap: { snapTo: 1 / (wines.length - 1), duration: 0.6, ease: "power2.inOut" },
          }
        });
      }

      // ── MOOD BOARD ──
      gsap.utils.toArray<HTMLElement>("[data-mood]").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 60, scale: 0.93 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8,
            scrollTrigger: { trigger: el, start: "top 90%" },
            delay: (i % 4) * 0.08
          });
      });

      // ── HERITAGE ──
      gsap.utils.toArray<HTMLElement>("[data-heritage]").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: el, start: "top 82%" } });
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 86%" } });
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

        {/* ═══════ HERO — Full-bleed image ═══════ */}
        <section className="h-screen relative overflow-hidden flex items-end md:items-center pb-20 md:pb-0">
          {/* Full background image */}
          <div className="absolute inset-0">
            <img src={photos.hero} alt="" className="w-full h-full object-cover" style={{ transform: "scale(1.1)" }} data-speed="-0.08" />
          </div>
          {/* Overlays — multiple layers for smooth blend */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(247,245,240,0.92) 0%, rgba(247,245,240,0.7) 35%, rgba(247,245,240,0.3) 60%, transparent 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(247,245,240,0.95) 0%, rgba(247,245,240,0.4) 25%, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(247,245,240,0.95) 0%, transparent 60%)" }} />

          <div className="relative z-10 px-8 md:px-16 lg:px-24 w-full max-w-[1300px]">
            <div className="mb-5" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(12px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s" }}>
              <span className="font-mono text-[11px] tracking-[1px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>Vignobles familiaux &mdash; Depuis 1710</span>
            </div>
            <h1 className="font-serif font-light leading-[0.85] mb-8">
              <span className="block text-[clamp(58px,10vw,150px)] tracking-[-3px]">
                {L1.map((c, i) => <span key={i} className="inline-block" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(110%)", transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${0.5 + i * 0.05}s` }}>{c}</span>)}
              </span>
              <span className="block text-[clamp(42px,7.5vw,110px)] tracking-[-1px] italic" style={{ color: "var(--gold)" }}>
                {L2.map((c, i) => <span key={i} className="inline-block" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(110%)", transition: `all 0.85s cubic-bezier(0.16,1,0.3,1) ${0.75 + i * 0.04}s` }}>{c}</span>)}
              </span>
            </h1>
            <div className="max-w-[380px]" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.5s" }}>
              <p className="font-sans text-[13.5px] leading-[1.85]" style={{ color: "var(--ink2)" }}>
                Sept domaines d&apos;exception. De la craie champenoise aux graves bordelaises, trois siècles d&apos;un savoir-faire transmis de génération en génération.
              </p>
              <div className="mt-8 flex items-center gap-6">
                <button className="btn-fill" data-hover><span>Découvrir</span></button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-12 hidden md:flex items-center gap-3" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 2s" }}>
            <span className="font-mono text-[10px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>scroll</span>
            <div className="w-[1px] h-12 relative overflow-hidden" style={{ background: "rgba(158,130,90,0.25)" }}>
              <div className="w-full h-1/2 bg-[var(--gold)]" style={{ animation: "scrollLine 2.5s ease-in-out infinite" }} />
            </div>
          </div>
        </section>

        {/* ═══════ FULL-BLEED VINEYARD ═══════ */}
        <div className="relative h-[45vh] md:h-[65vh] overflow-hidden">
          <img src={photos.vineyard1} alt="" className="w-full h-full object-cover" data-speed="-0.12" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center" data-reveal>
              <span className="font-serif text-white text-[clamp(26px,4vw,46px)] font-light italic drop-shadow-xl">L&apos;art du temps</span>
              <div className="font-mono text-[10px] text-white/60 mt-3 tracking-[2px]" style={{ fontFamily: "'DM Mono', monospace" }}>Preignac, Sauternes</div>
            </div>
          </div>
        </div>

        {/* ═══════ BOTTLE SHOWCASE ═══════ */}
        <section ref={bottleSec} className="h-screen flex items-center justify-center relative" style={{ background: "var(--bg)" }}>
          <div ref={bottleImg} className="absolute z-10 opacity-0" style={{ filter: "drop-shadow(0 40px 80px rgba(14,14,12,0.25))", perspective: "800px" }}>
            <Image src={wines[0].image} alt={wines[0].name} width={280} height={700} priority className="object-contain select-none pointer-events-none" style={{ maxHeight: "78vh" }} />
          </div>
          <div ref={bottleText} className="absolute right-[8%] lg:right-[12%] top-1/2 -translate-y-1/2 max-w-[420px] opacity-0">
            <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>001 — Sauternes</span>
            <h2 className="font-serif text-[clamp(32px,3.5vw,48px)] font-light leading-[1.1] mb-3">Château Gilette</h2>
            <p className="font-serif text-[15px] italic mb-6" style={{ color: "var(--ink2)" }}>Crème de Tête — {wines[0].year}</p>
            <p className="font-sans text-[13px] leading-[2] mb-8" style={{ color: "var(--ink2)" }}>{wines[0].description}</p>
            <div className="flex gap-12 mb-10">
              <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cépages</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].blend}</span></div>
              <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].surface}</span></div>
            </div>
            <button className="btn-fill" data-hover><span>Fiche complète</span></button>
          </div>
          <div ref={bottleNum} className="absolute left-[6%] bottom-[12%] opacity-0">
            <div className="font-serif text-[clamp(70px,9vw,130px)] font-light leading-none" style={{ color: "rgba(158,130,90,0.18)" }}>01</div>
          </div>
        </section>

        {/* ═══════ WINE FILL ANIMATION ═══════ */}
        <section ref={fillRef} className="py-28 md:py-36 px-8 md:px-16 relative overflow-hidden" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* Wine glass SVG */}
            <div className="flex-shrink-0 w-[120px] h-[300px] relative" data-reveal>
              <svg viewBox="0 0 120 300" className="w-full h-full">
                <defs>
                  <clipPath id="glassClip">
                    <path d="M30,10 Q30,0 40,0 L80,0 Q90,0 90,10 L95,130 Q95,160 75,170 L70,175 L70,250 L85,260 Q90,265 90,270 L90,280 Q90,290 80,290 L40,290 Q30,290 30,280 L30,270 Q30,265 35,260 L50,250 L50,175 L45,170 Q25,160 25,130 Z" />
                  </clipPath>
                </defs>
                {/* Glass outline */}
                <path d="M30,10 Q30,0 40,0 L80,0 Q90,0 90,10 L95,130 Q95,160 75,170 L70,175 L70,250 L85,260 Q90,265 90,270 L90,280 Q90,290 80,290 L40,290 Q30,290 30,280 L30,270 Q30,265 35,260 L50,250 L50,175 L45,170 Q25,160 25,130 Z"
                  fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.4" />
                {/* Fill area */}
                <g clipPath="url(#glassClip)">
                  <rect ref={fillLevel as unknown as React.RefObject<SVGRectElement>} x="0" y="300" width="120" height="300"
                    fill="rgba(158,130,90,0.2)" style={{ transformOrigin: "bottom", transition: "none" }}>
                  </rect>
                </g>
              </svg>
            </div>
            <div className="flex-1 max-w-[500px]" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>L&apos;expérience</span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-light leading-[1.2] mb-6">
                Un art de la patience
              </h2>
              <p className="font-sans text-[13px] leading-[2]" style={{ color: "var(--ink2)" }}>
                Chez Gonet-Médeville, le temps est un allié. Château Gilette repose vingt ans en cuves béton avant sa mise en bouteille. Les Champagnes vieillissent quatorze ans sur lattes. Cette patience rare forge des vins d&apos;une profondeur inégalée.
              </p>
              <div className="mt-8 flex items-center gap-8">
                <div className="text-center"><div className="font-serif text-[36px] font-light" style={{ color: "var(--ink)" }}>20</div><div className="font-mono text-[9px] tracking-[1px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>ans en cuves</div></div>
                <div className="w-[1px] h-12" style={{ background: "rgba(158,130,90,0.2)" }} />
                <div className="text-center"><div className="font-serif text-[36px] font-light" style={{ color: "var(--ink)" }}>14</div><div className="font-mono text-[9px] tracking-[1px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>ans sur lattes</div></div>
                <div className="w-[1px] h-12" style={{ background: "rgba(158,130,90,0.2)" }} />
                <div className="text-center"><div className="font-serif text-[36px] font-light" style={{ color: "var(--ink)" }}>5k</div><div className="font-mono text-[9px] tracking-[1px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>bouteilles</div></div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ QUOTE ═══════ */}
        <section ref={quoteSec} className="min-h-[80vh] flex items-center justify-center relative py-32">
          <div ref={quoteBg} className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--ink)", clipPath: "circle(0% at 50% 50%)" }}>
            <div className="max-w-[580px] px-8 text-center" style={{ color: "#F7F5F0" }}>
              <blockquote className="font-serif text-[clamp(20px,2.8vw,32px)] font-light italic leading-[1.65]">
                Nous créons des vins vivants, reflets de notre savoir-faire et de notre culture — du choix du plant au dégorgement.
              </blockquote>
              <div className="mt-10 font-mono text-[10px] tracking-[1px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>Julie &amp; Xavier Gonet-Médeville</div>
            </div>
          </div>
        </section>

        {/* ═══════ MOOD BOARD ═══════ */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1300px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[160px] md:auto-rows-[200px]">
            <div data-mood className="row-span-2 rounded overflow-hidden relative group"><img src={photos.barrels} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="rounded overflow-hidden relative group"><img src={photos.grapes} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="col-span-2 rounded overflow-hidden relative group">
              <img src={photos.rows} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-5 font-serif text-white text-[16px] italic">Les rangs de vigne</div>
            </div>
            <div data-mood className="rounded overflow-hidden group"><img src={photos.glass} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="rounded overflow-hidden group"><img src={photos.cork} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="col-span-2 rounded overflow-hidden relative group">
              <img src={photos.cellar} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 right-5 font-mono text-white/80 text-[10px] tracking-[2px]" style={{ fontFamily: "'DM Mono', monospace" }}>LES CHAIS</div>
            </div>
            <div data-mood className="rounded overflow-hidden group"><img src={photos.hands} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="rounded overflow-hidden group"><img src={photos.pour} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="rounded overflow-hidden group"><img src={photos.tasting} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
            <div data-mood className="rounded overflow-hidden relative group">
              <img src={photos.grapes2} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </section>

        {/* ═══════ COLLECTION HEADER ═══════ */}
        <div className="px-8 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="flex items-end justify-between flex-wrap gap-6" data-reveal>
            <div>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>La collection</span>
              <h2 className="font-serif text-[clamp(36px,5vw,60px)] font-light leading-none">Nos vins</h2>
            </div>
            <p className="font-sans text-[13px] max-w-[300px] leading-[1.8]" style={{ color: "var(--ink2)" }}>
              Quatre appellations, sept domaines — l&apos;empreinte d&apos;un terroir dans chaque bouteille.
            </p>
          </div>
          <div className="w-full h-[1px] mt-8" style={{ background: "rgba(158,130,90,0.12)" }} />
        </div>

        {/* ═══════ HORIZONTAL GALLERY (snap) ═══════ */}
        <section ref={gallerySec} className="relative overflow-hidden">
          <div ref={galleryTrack} className="flex h-screen items-center" style={{ width: `${wines.length * 100}vw` }}>
            {wines.map((wine, idx) => (
              <div key={wine.id} className="w-screen h-screen flex items-center flex-shrink-0 relative px-8 md:px-16">
                <div className="w-full max-w-[1100px] mx-auto flex items-center gap-[clamp(32px,5vw,80px)]">
                  {/* Bottle — always on left */}
                  <div className="flex-shrink-0 relative">
                    <div style={{ filter: "drop-shadow(0 30px 60px rgba(14,14,12,0.2))" }}>
                      <Image src={wine.image} alt={wine.name} width={200} height={520} className="object-contain select-none" style={{ maxHeight: "62vh" }} />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[2px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")}</div>
                  </div>
                  {/* Info — always on right */}
                  <div className="flex-1 max-w-[460px]">
                    <span className="font-mono text-[10px] tracking-[1px] block mb-4" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{wine.appellation}</span>
                    <h3 className="font-serif text-[clamp(28px,3vw,46px)] font-light leading-[1.1] mb-1">
                      {wine.prefix !== "Champagne" && <span className="block text-[0.55em] font-normal" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                      {wine.name}
                    </h3>
                    <p className="font-serif text-[14px] italic mt-2 mb-7" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</p>
                    <p className="font-sans text-[13px] leading-[2] mb-9" style={{ color: "var(--ink2)" }}>{wine.description}</p>
                    <div className="flex gap-10 mb-10">
                      <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cépages</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.blend}</span></div>
                      <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.surface}</span></div>
                    </div>
                    <button className="btn-fill" data-hover><span>Découvrir</span></button>
                  </div>
                </div>
                {/* Year bg */}
                <div className="absolute bottom-[8%] right-[5%] font-serif text-[clamp(60px,12vw,160px)] font-light leading-none pointer-events-none select-none" style={{ color: "rgba(158,130,90,0.06)" }}>{wine.year}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ MARQUEE ═══════ */}
        <div className="py-11 overflow-hidden" style={{ borderTop: "1px solid rgba(158,130,90,0.08)", borderBottom: "1px solid rgba(158,130,90,0.08)" }}>
          <div className="flex gap-20 whitespace-nowrap animate-marquee" style={{ width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-20 items-center">
              {["Sauternes","·","Champagne","·","Margaux","·","Graves","·","Bordeaux Supérieur","·"].map((t,i) =>
                <span key={i} className={t==="·" ? "text-[8px] text-[var(--gold)] opacity-50" : "font-serif text-[clamp(22px,3vw,40px)] font-light italic"}>{t}</span>
              )}
            </div>)}
          </div>
        </div>

        {/* ═══════ HÉRITAGE ═══════ */}
        <section className="py-28 md:py-36 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-end gap-6 mb-16" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Héritage</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.15)" }} />
            </div>
            <div className="space-y-14 md:space-y-20">
              {[
                { year: "1710", text: "La famille Despujols acquiert les terres de Preignac. Naissance de Gilette et Les Justices au cœur du Sauternais." },
                { year: "1930", text: "René Médeville découvre le vieillissement long en cuves béton — la signature unique de Gilette." },
                { year: "2000", text: "Xavier Gonet et Julie Médeville unissent Bordeaux et Champagne. Naissance des Champagnes Gonet-Médeville." },
                { year: "2009", text: "Acquisition du Château des Eyrins — 3 hectares entourés par les vignes de Château Margaux." },
              ].map((item, i) => (
                <div key={i} data-heritage className="flex items-start gap-6 md:gap-12">
                  <span className="font-serif text-[clamp(40px,6vw,80px)] font-light leading-none flex-shrink-0" style={{ color: "rgba(158,130,90,0.22)" }}>{item.year}</span>
                  <p className="font-sans text-[13.5px] leading-[1.9] max-w-[450px] pt-2 md:pt-4" style={{ color: "var(--ink2)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ PHOTO BREAK ═══════ */}
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={photos.sunset} alt="" className="w-full h-full object-cover" data-speed="-0.1" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--ink) 0%, rgba(14,14,12,0.2) 50%, rgba(14,14,12,0.4) 100%)" }} />
          <div className="absolute bottom-8 left-8 md:left-16">
            <span className="font-mono text-[10px] tracking-[2px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>44°14′N 0°18′W</span>
            <div className="font-serif text-white text-[clamp(20px,3vw,32px)] font-light italic mt-2">Preignac, Gironde</div>
          </div>
        </div>

        {/* ═══════ TERROIRS ═══════ */}
        <section className="relative py-28 md:py-36 px-8 md:px-16 lg:px-24" style={{ background: "var(--ink)", color: "#F7F5F0" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-14 md:gap-24">
            <div className="flex-1" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>Nos terroirs</span>
              <h2 className="font-serif text-[clamp(30px,3.5vw,48px)] font-light leading-[1.15] mb-8">De la craie à la grave</h2>
              <p className="font-sans text-[13px] leading-[2] max-w-[380px]" style={{ color: "rgba(247,245,240,0.5)" }}>Chaque domaine est le fruit d&apos;un terroir singulier, façonné par la géologie et le savoir-faire humain.</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-10">
              {[
                { name: "Champagne", detail: "Craie · Grands & 1ers Crus", ha: "12 ha" },
                { name: "Sauternes", detail: "Sable, calcaire, argile", ha: "13 ha" },
                { name: "Margaux", detail: "Graves profondes", ha: "2,9 ha" },
                { name: "Graves", detail: "Graves, argile, sable", ha: "15 ha" },
              ].map(t => (
                <div key={t.name} data-reveal className="group">
                  <div className="font-serif text-[20px] font-light mb-1.5 group-hover:text-[var(--gold)] transition-colors duration-500">{t.name}</div>
                  <div className="font-sans text-[11px]" style={{ color: "rgba(247,245,240,0.4)" }}>{t.detail}</div>
                  <div className="font-mono text-[11px] mt-1.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{t.ha}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ CHIFFRES ═══════ */}
        <section className="py-24 px-8 md:px-16">
          <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ n: "1710", l: "Fondation" }, { n: "7", l: "Domaines" }, { n: "43", l: "Hectares" }, { n: "~17k", l: "Caisses / an" }].map((s, i) => (
              <div key={i} className="text-center" data-reveal>
                <div className="font-serif text-[clamp(32px,4.5vw,50px)] font-light leading-none">{s.n}</div>
                <div className="font-mono text-[10px] tracking-[1px] mt-2.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-14 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between gap-10 mb-14">
            <div>
              <div className="font-serif text-[22px] font-light mb-2">Gonet-Médeville</div>
              <p className="font-sans text-[11px] leading-relaxed" style={{ color: "var(--ink2)" }}>Vignobles familiaux — Bordeaux &amp; Champagne</p>
            </div>
            <div className="flex gap-14">
              <div>
                <span className="font-mono text-[10px] block mb-2.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Adresse</span>
                <p className="font-sans text-[11px] leading-loose" style={{ color: "var(--ink2)" }}>4 Rue du Port, 33210 Preignac</p>
              </div>
              <div>
                <span className="font-mono text-[10px] block mb-2.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Contact</span>
                <p className="font-sans text-[11px] leading-loose" style={{ color: "var(--ink2)" }}>+33 5 56 76 28 44</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid rgba(158,130,90,0.1)" }}>
            <span className="font-mono text-[9px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>L&apos;abus d&apos;alcool est dangereux pour la santé</span>
            <span className="font-mono text-[9px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>© 2024 Gonet-Médeville</span>
          </div>
        </footer>
      </main>
    </>
  );
}
