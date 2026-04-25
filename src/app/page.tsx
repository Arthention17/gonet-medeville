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
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const onDone = useCallback(() => setReady(true), []);

  const bottleSec = useRef<HTMLDivElement>(null);
  const bottleImg = useRef<HTMLDivElement>(null);
  const bottleText = useRef<HTMLDivElement>(null);
  const bottleNum = useRef<HTMLDivElement>(null);
  const quoteSec = useRef<HTMLDivElement>(null);
  const quoteBg = useRef<HTMLDivElement>(null);
  const gallerySec = useRef<HTMLDivElement>(null);
  const galleryTrack = useRef<HTMLDivElement>(null);
  const heroBottle = useRef<HTMLDivElement>(null);

  // Mouse tracking for hero bottle tilt
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Hero bottle tilt based on mouse
  useEffect(() => {
    if (!heroBottle.current || !ready) return;
    const rx = (mousePos.y - 0.5) * -8;
    const ry = (mousePos.x - 0.5) * 12;
    gsap.to(heroBottle.current, { rotateX: rx, rotateY: ry, duration: 0.8, ease: "power2.out" });
  }, [mousePos, ready]);

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
        scrollTrigger: { trigger: bottleSec.current, start: "top top", end: "+=300%", pin: true, scrub: 1.2, anticipatePin: 1 }
      });
      btl
        .fromTo(bottleImg.current, { scale: 0.5, opacity: 0, y: 100 }, { scale: 1, opacity: 1, y: 0, duration: 1.5 })
        .to(bottleImg.current, { x: "-25vw", scale: 0.8, duration: 2 }, "+=0.5")
        .fromTo(bottleText.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.5 }, "<0.6")
        .fromTo(bottleNum.current, { opacity: 0 }, { opacity: 1, duration: 1 }, "<0.5")
        .to({}, { duration: 2 })
        .to(bottleImg.current, { scale: 2.2, y: "-20%", opacity: 0, duration: 2 })
        .to([bottleText.current, bottleNum.current], { opacity: 0, duration: 0.8 }, "<");

      // ── QUOTE ──
      gsap.fromTo(quoteBg.current, { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(85% at 50% 50%)", scrollTrigger: { trigger: quoteSec.current, start: "top 55%", end: "center center", scrub: 1 } });

      // ── CARD DECK GALLERY ──
      if (galleryTrack.current && gallerySec.current) {
        const cards = gsap.utils.toArray<HTMLElement>("[data-wine-card]");
        const cardWidth = window.innerWidth * 0.55;
        const gap = 24;
        const totalShift = (cards.length - 1) * (cardWidth + gap);

        gsap.to(galleryTrack.current, { x: -totalShift, ease: "none",
          scrollTrigger: {
            trigger: gallerySec.current, start: "top top",
            end: () => `+=${totalShift * 1.4}`,
            pin: true, scrub: 1, anticipatePin: 1,
            snap: { snapTo: 1 / (cards.length - 1), duration: 0.7, delay: 0.15, ease: "power3.inOut" },
            onUpdate: (self) => {
              const progress = self.progress;
              cards.forEach((card, i) => {
                const cardProgress = progress * (cards.length - 1);
                const dist = Math.abs(cardProgress - i);
                const isActive = dist < 0.5;

                const bottle = card.querySelector("[data-deck-bottle]") as HTMLElement;
                const info = card.querySelector("[data-deck-info]") as HTMLElement;

                if (bottle) {
                  gsap.set(bottle, {
                    scale: isActive ? 1.1 : 0.82,
                    y: isActive ? -20 : 0,
                    rotate: isActive ? -2 : 0,
                    opacity: isActive ? 1 : 0.4,
                    filter: isActive ? "drop-shadow(0 40px 80px rgba(14,14,12,0.3))" : "drop-shadow(0 10px 20px rgba(14,14,12,0.1))",
                  });
                }
                if (info) {
                  gsap.set(info, {
                    opacity: isActive ? 1 : 0.15,
                    y: isActive ? 0 : 15,
                    scale: isActive ? 1 : 0.95,
                  });
                }
              });
            }
          }
        });
      }

      // ── MOOD ──
      gsap.utils.toArray<HTMLElement>("[data-mood]").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 50, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, scrollTrigger: { trigger: el, start: "top 92%" }, delay: (i % 4) * 0.06 });
      });

      // ── HERITAGE ──
      gsap.utils.toArray<HTMLElement>("[data-heritage]").forEach(el => {
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

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {!ready && <Preloader onComplete={onDone} />}

      <main style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <Nav />

        {/* ═══════ HERO — Cinematic with interactive bottle ═══════ */}
        <section className="h-screen relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img src={photos.vignoble} alt="" className="w-full h-full object-cover" style={{ transform: "scale(1.1)" }} data-speed="-0.06" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.85) 0%, transparent 50%)" }} />
          </div>

          <div className="relative z-10 h-full flex items-center px-8 md:px-16 lg:px-24">
            <div className="w-full max-w-[1400px] flex items-center justify-between gap-8">
              {/* Left — text */}
              <div className="max-w-[500px]">
                <div style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(15px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.5s" }}>
                  <span className="font-mono text-[11px] tracking-[2px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignobles familiaux &mdash; Depuis 1710</span>
                </div>
                <h1 className="mt-5 mb-6" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(25px)", transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.7s" }}>
                  <span className="block font-serif text-[clamp(38px,6vw,80px)] font-light text-white leading-[1.05] tracking-[-1px]">
                    Gonet-Medeville
                  </span>
                  <span className="block font-serif text-[clamp(16px,2vw,24px)] font-light italic text-[var(--gold-light)] mt-1">
                    Bordeaux &amp; Champagne
                  </span>
                </h1>
                <p className="font-sans text-[13px] leading-[1.9] text-white/55 max-w-[380px] mb-8" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.3s" }}>
                  Sept domaines d&apos;exception, de la craie champenoise aux graves bordelaises. Trois siècles d&apos;un savoir-faire transmis de generation en generation.
                </p>
                <div style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.6s" }}>
                  <button className="btn-fill-light" data-hover><span>Decouvrir la maison</span></button>
                </div>
              </div>

              {/* Right — interactive bottle with mouse-tracking tilt */}
              <div className="hidden lg:block" style={{
                perspective: "1000px",
                opacity: ready ? 1 : 0,
                transform: ready ? "translateY(0)" : "translateY(40px)",
                transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.9s",
              }}>
                <div ref={heroBottle} style={{
                  transformStyle: "preserve-3d",
                  filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.4))",
                }}>
                  <Image src={wines[0].image} alt="Chateau Gilette" width={220} height={560} priority
                    className="object-contain select-none pointer-events-none" style={{ maxHeight: "65vh" }} />
                </div>
                <div className="text-center mt-4">
                  <span className="font-mono text-[9px] tracking-[3px] text-white/30" style={{ fontFamily: "'DM Mono', monospace" }}>CHATEAU GILETTE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-5 border-t border-white/[0.06]">
            <div className="flex gap-8">
              {["Sauternes", "Champagne", "Margaux", "Graves"].map((a, i) => (
                <span key={a} className="font-mono text-[9px] tracking-[1px] text-white/25 hidden md:block" style={{ fontFamily: "'DM Mono', monospace" }}>{a}</span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-white/30" style={{ fontFamily: "'DM Mono', monospace" }}>scroll</span>
              <div className="w-[1px] h-8 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="w-full h-1/2 bg-white/50" style={{ animation: "scrollLine 2.5s ease-in-out infinite" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ INTRO — Chateau + texte ═══════ */}
        <section className="py-20 md:py-28 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <div className="flex-1 img-zoom rounded overflow-hidden" data-reveal>
              <img src={photos.chateau} alt="Chateau Preignac" className="w-full h-[320px] md:h-[420px] object-cover" />
            </div>
            <div className="flex-1 max-w-[430px]" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>La maison</span>
              <h2 className="font-serif text-[clamp(26px,2.8vw,38px)] font-light leading-[1.25] mb-5">Un heritage familial ancre dans la terre</h2>
              <p className="font-sans text-[13px] leading-[2]" style={{ color: "var(--ink2)" }}>
                Depuis 1710, la famille Medeville cultive ses vignes a Preignac. Aujourd&apos;hui, Julie Medeville et Xavier Gonet perpetuent cet heritage en unissant Bordeaux et la Champagne.
              </p>
              <button className="btn-fill mt-6" data-hover><span>Notre histoire</span></button>
            </div>
          </div>
        </section>

        {/* ═══════ BOTTLE SHOWCASE (pinned) ═══════ */}
        <section ref={bottleSec} className="h-screen flex items-center justify-center relative" style={{ background: "var(--bg)" }}>
          <div ref={bottleImg} className="absolute z-10 opacity-0" style={{ filter: "drop-shadow(0 40px 80px rgba(14,14,12,0.25))" }}>
            <Image src={wines[0].image} alt={wines[0].name} width={280} height={700} priority className="object-contain select-none pointer-events-none" style={{ maxHeight: "78vh" }} />
          </div>
          <div ref={bottleText} className="absolute right-[8%] lg:right-[12%] top-1/2 -translate-y-1/2 max-w-[400px] opacity-0">
            <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>001 — Sauternes</span>
            <h2 className="font-serif text-[clamp(30px,3vw,44px)] font-light leading-[1.1] mb-2">Chateau Gilette</h2>
            <p className="font-serif text-[14px] italic mb-5" style={{ color: "var(--ink2)" }}>Creme de Tete — {wines[0].year}</p>
            <p className="font-sans text-[13px] leading-[2] mb-6" style={{ color: "var(--ink2)" }}>{wines[0].description}</p>
            <div className="flex gap-10 mb-8">
              <div><span className="font-mono text-[10px] block mb-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cepages</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].blend}</span></div>
              <div><span className="font-mono text-[10px] block mb-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].surface}</span></div>
            </div>
            <button className="btn-fill" data-hover><span>Fiche complete</span></button>
          </div>
          <div ref={bottleNum} className="absolute left-[6%] bottom-[12%] opacity-0">
            <div className="font-serif text-[clamp(70px,9vw,130px)] font-light leading-none" style={{ color: "rgba(158,130,90,0.2)" }}>01</div>
          </div>
        </section>

        {/* ═══════ CAVE — Split ═══════ */}
        <section className="relative overflow-hidden" style={{ background: "var(--ink)" }}>
          <div className="flex flex-col md:flex-row min-h-[75vh]">
            <div className="flex-1 relative img-zoom">
              <img src={photos.julieCave} alt="Julie dans la cave" className="w-full h-full object-cover min-h-[350px]" />
            </div>
            <div className="flex-1 flex items-center px-8 md:px-14 py-14 md:py-0">
              <div className="max-w-[400px]" data-reveal>
                <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Les chais</span>
                <h2 className="font-serif text-[clamp(26px,2.8vw,38px)] font-light leading-[1.2] mb-5 text-white">Trois siecles dorment ici</h2>
                <p className="font-sans text-[13px] leading-[2] text-white/45 mb-6">
                  Dans les caves de Preignac, les millesimes de Chateau Gilette vieillissent patiemment en cuves beton pendant vingt ans.
                </p>
                <div className="flex gap-8">
                  <div><div className="font-serif text-[30px] font-light text-white">20</div><div className="font-mono text-[9px] tracking-[1px] mt-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>ans en cuves</div></div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div><div className="font-serif text-[30px] font-light text-white">14</div><div className="font-mono text-[9px] tracking-[1px] mt-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>ans sur lattes</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ QUOTE ═══════ */}
        <section ref={quoteSec} className="min-h-[75vh] flex items-center justify-center relative py-28">
          <div ref={quoteBg} className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--ink)", clipPath: "circle(0% at 50% 50%)" }}>
            <div className="max-w-[550px] px-8 text-center" style={{ color: "#F7F5F0" }}>
              <blockquote className="font-serif text-[clamp(19px,2.5vw,30px)] font-light italic leading-[1.65]">
                Nous creons des vins vivants, reflets de notre savoir-faire — du choix du plant au degorgement.
              </blockquote>
              <div className="mt-8 font-mono text-[10px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Julie &amp; Xavier Gonet-Medeville</div>
            </div>
          </div>
        </section>

        {/* ═══════ MOOD BOARD ═══════ */}
        <section className="py-14 md:py-18 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 auto-rows-[150px] md:auto-rows-[195px]">
            <div data-mood className="row-span-2 img-zoom rounded-sm overflow-hidden"><img src={photos.caveBouteilles} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.bouchons} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="col-span-2 rounded-sm overflow-hidden relative img-zoom">
              <img src={photos.vignobleEglise} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 font-serif text-white text-[15px] italic">Saint-Emilion</div>
            </div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vieillesBouteilles} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.champagneCoffret} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="col-span-2 rounded-sm overflow-hidden relative img-zoom">
              <img src={photos.xavierFuts} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <div className="font-serif text-white text-[15px] italic">Xavier Gonet</div>
                <div className="font-mono text-white/50 text-[9px] tracking-[2px] mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>AMBONNAY</div>
              </div>
            </div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vendanges} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vignesRangs} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.etiquette} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vignobleChapelle} alt="" className="w-full h-full object-cover" /></div>
          </div>
        </section>

        {/* ═══════ COLLECTION HEADER ═══════ */}
        <div className="px-8 md:px-16 lg:px-24 py-14 md:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4" data-reveal>
            <div>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>La collection</span>
              <h2 className="font-serif text-[clamp(34px,4.5vw,56px)] font-light leading-none">Nos vins</h2>
            </div>
            <p className="font-sans text-[12px] max-w-[280px] leading-[1.8]" style={{ color: "var(--ink2)" }}>
              Quatre appellations, sept domaines.
            </p>
          </div>
          <div className="w-full h-[1px] mt-6" style={{ background: "rgba(158,130,90,0.12)" }} />
        </div>

        {/* ═══════ CARD DECK GALLERY ═══════ */}
        <section ref={gallerySec} className="relative overflow-hidden">
          <div ref={galleryTrack} className="flex h-screen items-center gap-6 pl-[22vw]">
            {wines.map((wine, idx) => (
              <div key={wine.id} data-wine-card className="flex-shrink-0 w-[55vw] h-[80vh] flex items-center relative rounded-lg overflow-hidden" style={{
                background: `linear-gradient(135deg, ${wine.accent}08 0%, var(--bg) 100%)`,
                border: "1px solid rgba(158,130,90,0.06)",
              }}>
                <div className="w-full h-full flex items-center px-8 md:px-12 gap-8">
                  {/* Bottle */}
                  <div data-deck-bottle className="flex-shrink-0 relative" style={{
                    transformOrigin: "bottom center",
                    transition: "filter 0.3s",
                  }}>
                    <Image src={wine.image} alt={wine.name} width={160} height={420} className="object-contain select-none" style={{ maxHeight: "55vh" }} />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[3px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")}</div>
                  </div>

                  {/* Info */}
                  <div data-deck-info className="flex-1 max-w-[360px]" style={{ transformOrigin: "left center" }}>
                    <span className="font-mono text-[10px] tracking-[1px] block mb-3" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{wine.appellation}</span>
                    <h3 className="font-serif text-[clamp(24px,2.5vw,36px)] font-light leading-[1.1] mb-0.5">
                      {wine.prefix !== "Champagne" && <span className="block text-[0.55em] font-normal" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                      {wine.name}
                    </h3>
                    <p className="font-serif text-[13px] italic mt-1 mb-5" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</p>
                    <p className="font-sans text-[12px] leading-[1.9] mb-6" style={{ color: "var(--ink2)" }}>{wine.description}</p>
                    <div className="flex gap-8 mb-6">
                      <div><span className="font-mono text-[9px] block mb-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cepages</span><span className="font-sans text-[11px]" style={{ color: "var(--ink2)" }}>{wine.blend}</span></div>
                      <div><span className="font-mono text-[9px] block mb-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[11px]" style={{ color: "var(--ink2)" }}>{wine.surface}</span></div>
                    </div>
                    <button className="btn-fill" data-hover><span>Decouvrir</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ MARQUEE ═══════ */}
        <div className="py-10 overflow-hidden" style={{ borderTop: "1px solid rgba(158,130,90,0.08)", borderBottom: "1px solid rgba(158,130,90,0.08)" }}>
          <div className="flex gap-20 whitespace-nowrap animate-marquee" style={{ width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-20 items-center">
              {["Sauternes","·","Champagne","·","Margaux","·","Graves","·","Bordeaux Superieur","·"].map((t,i) =>
                <span key={i} className={t==="·" ? "text-[8px] text-[var(--gold)] opacity-50" : "font-serif text-[clamp(20px,2.8vw,36px)] font-light italic"}>{t}</span>
              )}
            </div>)}
          </div>
        </div>

        {/* ═══════ VIGNERONS ═══════ */}
        <section className="py-20 md:py-28 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <div className="flex-1 max-w-[400px] order-2 md:order-1" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Les vignerons</span>
              <h2 className="font-serif text-[clamp(26px,2.8vw,38px)] font-light leading-[1.2] mb-5">Julie &amp; Xavier</h2>
              <p className="font-sans text-[13px] leading-[2]" style={{ color: "var(--ink2)" }}>
                Julie Medeville et Xavier Gonet. Ensemble, ils reunissent Bordeaux et la Champagne sous une meme vision artisanale. Pas de chaptalisation, pas de fermentation malolactique, dosage minimal.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 img-zoom rounded overflow-hidden" data-reveal>
              <img src={photos.julieXavierCuves} alt="Julie et Xavier" className="w-full h-[320px] md:h-[420px] object-cover" />
            </div>
          </div>
        </section>

        {/* ═══════ HERITAGE ═══════ */}
        <section className="py-24 md:py-32 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-end gap-6 mb-14" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Heritage</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.2)" }} />
            </div>
            <div className="space-y-12 md:space-y-16">
              {[
                { year: "1710", text: "La famille Despujols acquiert les terres de Preignac. Naissance de Gilette et Les Justices." },
                { year: "1930", text: "Rene Medeville decouvre le vieillissement long en cuves beton — la signature unique de Gilette." },
                { year: "2000", text: "Xavier Gonet et Julie Medeville unissent Bordeaux et Champagne. Les Champagnes Gonet-Medeville naissent a Bisseuil." },
                { year: "2009", text: "Acquisition du Chateau des Eyrins — 3 hectares entoures par les vignes de Chateau Margaux." },
              ].map((item, i) => (
                <div key={i} data-heritage className="flex items-start gap-5 md:gap-10">
                  <span className="font-serif text-[clamp(36px,5vw,70px)] font-light leading-none flex-shrink-0" style={{ color: "rgba(158,130,90,0.28)" }}>{item.year}</span>
                  <p className="font-sans text-[13px] leading-[1.9] max-w-[420px] pt-2 md:pt-3" style={{ color: "var(--ink2)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ PHOTO BREAK ═══════ */}
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={photos.vignobleAutomne} alt="" className="w-full h-full object-cover" data-speed="-0.1" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--ink) 0%, rgba(14,14,12,0.15) 50%, rgba(14,14,12,0.3) 100%)" }} />
          <div className="absolute bottom-6 left-8 md:left-16">
            <span className="font-mono text-[10px] tracking-[2px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>44.14N 0.18W</span>
            <div className="font-serif text-white text-[clamp(18px,2.5vw,28px)] font-light italic mt-1.5">Preignac, Gironde</div>
          </div>
        </div>

        {/* ═══════ TERROIRS ═══════ */}
        <section className="relative py-24 md:py-32 px-8 md:px-16 lg:px-24" style={{ background: "var(--ink)", color: "#F7F5F0" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="flex-1" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>Nos terroirs</span>
              <h2 className="font-serif text-[clamp(28px,3.2vw,44px)] font-light leading-[1.15] mb-6">De la craie a la grave</h2>
              <p className="font-sans text-[13px] leading-[2] max-w-[360px]" style={{ color: "rgba(247,245,240,0.45)" }}>Chaque domaine est le fruit d&apos;un terroir singulier.</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-8">
              {[
                { name: "Champagne", detail: "Craie · Grands & 1ers Crus", ha: "12 ha" },
                { name: "Sauternes", detail: "Sable, calcaire, argile", ha: "13 ha" },
                { name: "Margaux", detail: "Graves profondes", ha: "2,9 ha" },
                { name: "Graves", detail: "Graves, argile, sable", ha: "15 ha" },
              ].map(t => (
                <div key={t.name} data-reveal className="group">
                  <div className="font-serif text-[19px] font-light mb-1 group-hover:text-[var(--gold)] transition-colors duration-500">{t.name}</div>
                  <div className="font-sans text-[11px]" style={{ color: "rgba(247,245,240,0.35)" }}>{t.detail}</div>
                  <div className="font-mono text-[10px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{t.ha}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ CHIFFRES ═══════ */}
        <section className="py-20 px-8 md:px-16">
          <div className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[{ n: "1710", l: "Fondation" }, { n: "7", l: "Domaines" }, { n: "43", l: "Hectares" }, { n: "~17k", l: "Caisses / an" }].map((s, i) => (
              <div key={i} className="text-center" data-reveal>
                <div className="font-serif text-[clamp(30px,4vw,46px)] font-light leading-none">{s.n}</div>
                <div className="font-mono text-[10px] tracking-[1px] mt-2" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-12 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between gap-8 mb-12">
            <div>
              <div className="font-serif text-[20px] font-light mb-2">Gonet-Medeville</div>
              <p className="font-sans text-[11px]" style={{ color: "var(--ink2)" }}>Vignobles familiaux — Bordeaux &amp; Champagne</p>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="font-mono text-[10px] block mb-2 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Adresse</span>
                <p className="font-sans text-[11px] leading-relaxed" style={{ color: "var(--ink2)" }}>4 Rue du Port, 33210 Preignac</p>
              </div>
              <div>
                <span className="font-mono text-[10px] block mb-2 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Contact</span>
                <p className="font-sans text-[11px] leading-relaxed" style={{ color: "var(--ink2)" }}>+33 5 56 76 28 44</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px solid rgba(158,130,90,0.1)" }}>
            <span className="font-mono text-[8px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>L&apos;abus d&apos;alcool est dangereux pour la sante</span>
            <span className="font-mono text-[8px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>© 2024 Gonet-Medeville</span>
          </div>
        </footer>
      </main>
    </>
  );
}
