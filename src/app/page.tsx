"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import { wines, champagnes, coteaux, bordeauxWines } from "@/lib/wines";
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

  useEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach(el => {
        gsap.to(el, { y: `${parseFloat(el.dataset.speed || "0") * 100}`, ease: "none",
          scrollTrigger: { trigger: el.closest("section, div") || el, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      // ── HERO bubbles float up ──
      gsap.utils.toArray<HTMLElement>("[data-bubble]").forEach((el, i) => {
        gsap.fromTo(el,
          { y: 0, opacity: 0 },
          { y: -window.innerHeight * 1.2, opacity: 0.6, duration: 8 + i * 2, repeat: -1, delay: i * 1.5, ease: "none" }
        );
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

      // ── GALLERY — tight deck, 2-3 visible ──
      if (galleryTrack.current && gallerySec.current) {
        const items = gsap.utils.toArray<HTMLElement>("[data-wine-slide]");
        const slideW = window.innerWidth * 0.42;
        const totalShift = (items.length - 1) * slideW;
        const wineColors = ["rgba(212,160,23,0.07)", "rgba(201,169,110,0.06)", "rgba(139,38,53,0.06)", "rgba(107,127,94,0.06)"];
        const tintEl = document.getElementById("gallery-tint");

        gsap.to(galleryTrack.current, { x: -totalShift, ease: "none",
          scrollTrigger: {
            trigger: gallerySec.current, start: "top top",
            end: () => `+=${totalShift * 1.8}`,
            pin: true, scrub: 1, anticipatePin: 1,
            snap: { snapTo: 1 / (items.length - 1), duration: 0.8, delay: 0.25, ease: "power3.inOut" },
            onUpdate: (self) => {
              const p = self.progress * (items.length - 1);
              const activeIdx = Math.round(p);
              if (tintEl) tintEl.style.background = `radial-gradient(ellipse at 50% 50%, ${wineColors[activeIdx] || wineColors[0]} 0%, transparent 60%)`;
              items.forEach((slide, i) => {
                const dist = Math.abs(p - i);
                const bottle = slide.querySelector("[data-slide-bottle]") as HTMLElement;
                const info = slide.querySelector("[data-slide-info]") as HTMLElement;
                if (bottle) {
                  gsap.to(bottle, {
                    scale: Math.max(0.65, 1.15 - dist * 0.22),
                    y: Math.max(-30, -30 + dist * 20),
                    rotate: dist < 0.5 ? -3 + dist * 6 : 0,
                    opacity: Math.max(0.12, 1 - dist * 0.4),
                    duration: 0.6, ease: "power2.out", overwrite: "auto",
                  });
                }
                if (info) {
                  gsap.to(info, {
                    opacity: Math.max(0.04, 1 - dist * 0.5),
                    scale: Math.max(0.88, 1 - dist * 0.06),
                    y: Math.max(0, dist * 12),
                    duration: 0.6, ease: "power2.out", overwrite: "auto",
                  });
                }
              });
            }
          }
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-mood]").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 50, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, scrollTrigger: { trigger: el, start: "top 92%" }, delay: (i % 4) * 0.06 });
      });

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

        {/* ═══════ HERO — Cinematic with champagne bubbles ═══════ */}
        <section className="h-screen relative overflow-hidden flex items-center">
          <div className="absolute inset-0">
            <img src={photos.vignoble} alt="" className="w-full h-full object-cover" style={{ transform: "scale(1.1)" }} data-speed="-0.06" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.9) 0%, rgba(14,14,12,0.3) 40%, rgba(14,14,12,0.4) 100%)" }} />
          </div>

          {/* Champagne bubbles — floating circles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div key={i} data-bubble className="absolute rounded-full" style={{
                width: 4 + Math.random() * 8,
                height: 4 + Math.random() * 8,
                left: `${10 + Math.random() * 80}%`,
                bottom: `-${20 + Math.random() * 40}px`,
                background: "rgba(201,169,110,0.15)",
                border: "1px solid rgba(201,169,110,0.1)",
              }} />
            ))}
          </div>

          <div className="relative z-10 w-full px-8 md:px-16 lg:px-24">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center">
              <div style={{ opacity: ready ? 1 : 0, transition: "all 1s ease 0.5s" }}>
                <span className="font-mono text-[10px] tracking-[3px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>VIGNOBLES FAMILIAUX &mdash; BORDEAUX &amp; CHAMPAGNE</span>
              </div>
              <h1 className="mt-6" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(30px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.7s" }}>
                <span className="block font-serif text-[clamp(44px,8vw,100px)] font-light text-white leading-[1] tracking-[-2px]">
                  Gonet-Medeville
                </span>
              </h1>
              <div className="w-16 h-[1px] bg-[var(--gold)] my-6" style={{ opacity: ready ? 1 : 0, transform: ready ? "scaleX(1)" : "scaleX(0)", transition: "all 1s ease 1.2s" }} />
              <p className="font-serif text-[clamp(15px,2vw,20px)] font-light italic text-white/50 max-w-[500px] leading-[1.7]" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.4s" }}>
                Sept domaines, trois siecles de passion, deux terroirs d&apos;exception
              </p>
              <div className="mt-10 flex gap-4" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.7s" }}>
                <button className="btn-fill-light" data-hover><span>Nos vins</span></button>
                <button className="px-8 py-3.5 font-sans text-[10px] tracking-[3px] uppercase text-white/50 hover:text-white transition-colors duration-300" data-hover>Notre histoire</button>
              </div>
            </div>
          </div>

          {/* Bottom info strip */}
          <div className="absolute bottom-0 left-0 right-0 grid grid-cols-4 border-t border-white/[0.06]">
            {[
              { n: "1710", l: "Fondation" },
              { n: "7", l: "Domaines" },
              { n: "43 ha", l: "Vignoble" },
              { n: "12", l: "Cuvees" },
            ].map((s, i) => (
              <div key={i} className="py-4 px-6 text-center border-r border-white/[0.06] last:border-r-0 hidden md:block" style={{ opacity: ready ? 1 : 0, transition: `opacity 0.8s ease ${1.8 + i * 0.15}s` }}>
                <div className="font-serif text-[18px] font-light text-white/80">{s.n}</div>
                <div className="font-mono text-[8px] tracking-[2px] text-white/25 mt-0.5" style={{ fontFamily: "'DM Mono', monospace" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ INTRO ═══════ */}
        <section className="py-20 md:py-28 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <div className="flex-1 img-zoom rounded overflow-hidden" data-reveal>
              <img src={photos.chateau} alt="" className="w-full h-[300px] md:h-[400px] object-cover" />
            </div>
            <div className="flex-1 max-w-[420px]" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>La maison</span>
              <h2 className="font-serif text-[clamp(24px,2.5vw,36px)] font-light leading-[1.25] mb-4">Un heritage familial ancre dans la terre</h2>
              <p className="font-sans text-[13px] leading-[2] mb-3" style={{ color: "var(--ink2)" }}>
                Depuis 1710, la famille Medeville cultive ses vignes a Preignac. Julie Medeville et Xavier Gonet perpetuent cet heritage — Bordeaux et Champagne reunis sous une meme exigence.
              </p>
              <p className="font-sans text-[13px] leading-[2]" style={{ color: "var(--ink2)" }}>
                Sans chaptalisation, sans collage, dosage minimal. Des vins vivants qui expriment la purete de leur terroir.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ BOTTLE SHOWCASE ═══════ */}
        <section ref={bottleSec} className="h-screen flex items-center justify-center relative" style={{ background: "var(--bg)" }}>
          <div ref={bottleImg} className="absolute z-10 opacity-0" style={{ filter: "drop-shadow(0 40px 80px rgba(14,14,12,0.25))" }}>
            <Image src={wines[0].image} alt={wines[0].name} width={260} height={660} priority className="object-contain select-none pointer-events-none" style={{ maxHeight: "75vh" }} />
          </div>
          <div ref={bottleText} className="absolute right-[8%] lg:right-[12%] top-1/2 -translate-y-1/2 max-w-[380px] opacity-0">
            <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Sauternes</span>
            <h2 className="font-serif text-[clamp(28px,3vw,42px)] font-light leading-[1.1] mb-2">Chateau Gilette</h2>
            <p className="font-serif text-[14px] italic mb-5" style={{ color: "var(--ink2)" }}>Creme de Tete — {wines[0].year}</p>
            <p className="font-sans text-[12.5px] leading-[2] mb-6" style={{ color: "var(--ink2)" }}>{wines[0].description}</p>
            <div className="flex gap-10">
              <div><span className="font-mono text-[9px] block mb-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cepages</span><span className="font-sans text-[11px]" style={{ color: "var(--ink2)" }}>{wines[0].blend}</span></div>
              <div><span className="font-mono text-[9px] block mb-1 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[11px]" style={{ color: "var(--ink2)" }}>{wines[0].surface}</span></div>
            </div>
          </div>
          <div ref={bottleNum} className="absolute left-[6%] bottom-[12%] opacity-0">
            <div className="font-serif text-[clamp(60px,8vw,120px)] font-light leading-none" style={{ color: "rgba(158,130,90,0.2)" }}>01</div>
          </div>
        </section>

        {/* ═══════ CHAMPAGNE RANGE ═══════ */}
        <section className="py-20 px-8 md:px-16 lg:px-24" style={{ background: "var(--ink)", color: "#F7F5F0" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-end gap-6 mb-12" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Champagnes</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.15)" }} />
              <span className="font-mono text-[10px] text-white/25" style={{ fontFamily: "'DM Mono', monospace" }}>6 cuvees</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
              {champagnes.map((c, i) => (
                <div key={c.name} data-reveal className="group py-4 border-b border-white/[0.06] hover:border-[var(--gold)]/30 transition-colors duration-500">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-[18px] font-light group-hover:text-[var(--gold)] transition-colors duration-500">{c.name}</h3>
                    <span className="font-mono text-[9px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>{c.score}/100</span>
                  </div>
                  <div className="font-mono text-[9px] tracking-[1px] text-white/30 mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>{c.type}</div>
                  <div className="font-sans text-[11px] text-white/40 mb-1">{c.blend}</div>
                  <div className="font-sans text-[10px] text-white/25 italic">{c.detail}</div>
                </div>
              ))}
            </div>

            {/* Athenais — vin tranquille rouge, pas un champagne */}
            <div className="mt-12 pt-10 border-t border-white/[0.06]" data-reveal>
              <div className="flex items-end gap-4 mb-6">
                <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vin tranquille</span>
                <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.1)" }} />
              </div>
              <div className="max-w-[500px]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-[22px] font-light">{coteaux.name}</h3>
                  <span className="font-mono text-[9px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>{coteaux.score}/100</span>
                </div>
                <div className="font-mono text-[9px] tracking-[1px] text-white/30 mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>{coteaux.type}</div>
                <p className="font-sans text-[12px] text-white/45 leading-[1.8] mb-2">{coteaux.description}</p>
                <div className="font-sans text-[10px] text-white/25 italic">{coteaux.detail}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CAVE ═══════ */}
        <section className="relative overflow-hidden" style={{ background: "var(--ink)" }}>
          <div className="flex flex-col md:flex-row min-h-[70vh]">
            <div className="flex-1 relative img-zoom">
              <img src={photos.julieCave} alt="" className="w-full h-full object-cover min-h-[300px]" />
            </div>
            <div className="flex-1 flex items-center px-8 md:px-14 py-12 md:py-0">
              <div className="max-w-[380px]" data-reveal>
                <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Les chais</span>
                <h2 className="font-serif text-[clamp(24px,2.5vw,34px)] font-light leading-[1.2] mb-4 text-white">Trois siecles dorment ici</h2>
                <p className="font-sans text-[12.5px] leading-[2] text-white/40 mb-6">
                  Chateau Gilette repose vingt ans en cuves beton. Les Champagnes vieillissent quatorze ans sur lattes. Cette patience rare forge des vins d&apos;une profondeur inegalee.
                </p>
                <div className="flex gap-6">
                  <div><div className="font-serif text-[28px] font-light text-white">20</div><div className="font-mono text-[8px] tracking-[1px] mt-0.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>ans en cuves</div></div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div><div className="font-serif text-[28px] font-light text-white">14</div><div className="font-mono text-[8px] tracking-[1px] mt-0.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>ans sur lattes</div></div>
                  <div className="w-[1px] h-10 bg-white/10" />
                  <div><div className="font-serif text-[28px] font-light text-white">90k</div><div className="font-mono text-[8px] tracking-[1px] mt-0.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>bouteilles/an</div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ QUOTE ═══════ */}
        <section ref={quoteSec} className="min-h-[70vh] flex items-center justify-center relative py-24">
          <div ref={quoteBg} className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--ink)", clipPath: "circle(0% at 50% 50%)" }}>
            <div className="max-w-[520px] px-8 text-center" style={{ color: "#F7F5F0" }}>
              <blockquote className="font-serif text-[clamp(18px,2.5vw,28px)] font-light italic leading-[1.7]">
                Etre artisan du Champagne, c&apos;est notre implication totale a chaque etape — du choix du plant au degorgement.
              </blockquote>
              <div className="mt-8 font-mono text-[10px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Julie &amp; Xavier</div>
            </div>
          </div>
        </section>

        {/* ═══════ MOOD BOARD ═══════ */}
        <section className="py-12 md:py-16 px-3 md:px-5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-2 auto-rows-[140px] md:auto-rows-[185px]">
            <div data-mood className="row-span-2 img-zoom rounded-sm overflow-hidden"><img src={photos.caveBouteilles} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.bouchons} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="col-span-2 rounded-sm overflow-hidden relative img-zoom">
              <img src={photos.vignobleEglise} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vieillesBouteilles} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.champagneCoffret} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="col-span-2 rounded-sm overflow-hidden relative img-zoom">
              <img src={photos.xavierFuts} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 font-mono text-white/60 text-[9px] tracking-[2px]" style={{ fontFamily: "'DM Mono', monospace" }}>XAVIER · AMBONNAY</div>
            </div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vendanges} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vignesRangs} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.etiquette} alt="" className="w-full h-full object-cover" /></div>
            <div data-mood className="img-zoom rounded-sm overflow-hidden"><img src={photos.vignobleChapelle} alt="" className="w-full h-full object-cover" /></div>
          </div>
        </section>

        {/* ═══════ COLLECTION HEADER ═══════ */}
        <div className="px-8 md:px-16 lg:px-24 py-14 md:py-18">
          <div className="flex items-end justify-between flex-wrap gap-4" data-reveal>
            <div>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-3" style={{ fontFamily: "'DM Mono', monospace" }}>La collection</span>
              <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-light leading-none">Nos vins</h2>
            </div>
            <p className="font-sans text-[12px] max-w-[280px] leading-[1.8]" style={{ color: "var(--ink2)" }}>Quatre appellations, sept domaines.</p>
          </div>
          <div className="w-full h-[1px] mt-5" style={{ background: "rgba(158,130,90,0.12)" }} />
        </div>

        {/* ═══════ GALLERY — Seamless deck ═══════ */}
        <section ref={gallerySec} className="relative overflow-hidden">
          <div id="gallery-tint" className="absolute inset-0 pointer-events-none z-0 transition-[background] duration-700" />
          <div ref={galleryTrack} className="flex h-screen items-center pl-[30vw] gap-[2vw] relative z-10">
            {wines.map((wine, idx) => (
              <div key={wine.id} data-wine-slide className="flex-shrink-0 w-[40vw] h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center text-center">
                  <div data-slide-bottle className="relative mb-4" style={{ transformOrigin: "bottom center", filter: "drop-shadow(0 20px 40px rgba(14,14,12,0.15))" }}>
                    <Image src={wine.image} alt={wine.name} width={140} height={360} className="object-contain select-none" style={{ maxHeight: "42vh" }} />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[3px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")}</div>
                  </div>
                  <div data-slide-info className="max-w-[300px]" style={{ transformOrigin: "center top" }}>
                    <span className="font-mono text-[9px] tracking-[1px] block mb-1.5" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{wine.appellation}</span>
                    <h3 className="font-serif text-[clamp(20px,2.2vw,32px)] font-light leading-[1.1]">
                      {wine.prefix !== "Champagne" && <span className="text-[0.6em] font-normal mr-1.5" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                      {wine.name}
                    </h3>
                    <p className="font-serif text-[11px] italic mt-1 mb-2" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</p>
                    <p className="font-sans text-[11px] leading-[1.7] mb-3" style={{ color: "var(--ink2)" }}>{wine.description}</p>
                    <button className="btn-fill text-[9px] px-7 py-2.5" data-hover><span>Decouvrir</span></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ BORDEAUX RANGE ═══════ */}
        <section className="py-20 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto">
            <div className="flex items-end gap-6 mb-12" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Bordeaux</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.2)" }} />
              <span className="font-mono text-[10px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>7 domaines</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6">
              {bordeauxWines.map((b) => (
                <div key={b.name} data-reveal className="group py-3 border-b border-black/[0.06] hover:border-[var(--gold)]/30 transition-colors duration-500">
                  <h3 className="font-serif text-[17px] font-light mb-1 group-hover:text-[var(--gold)] transition-colors duration-500">{b.name}</h3>
                  <div className="font-mono text-[9px] tracking-[1px] mb-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{b.appellation}</div>
                  <div className="font-sans text-[11px]" style={{ color: "var(--ink2)" }}>{b.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ MARQUEE ═══════ */}
        <div className="py-9 overflow-hidden" style={{ borderTop: "1px solid rgba(158,130,90,0.08)", borderBottom: "1px solid rgba(158,130,90,0.08)" }}>
          <div className="flex gap-16 whitespace-nowrap animate-marquee" style={{ width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-16 items-center">
              {["Sauternes","·","Champagne","·","Margaux","·","Graves","·","Bordeaux","·"].map((t,i) =>
                <span key={i} className={t==="·" ? "text-[7px] text-[var(--gold)] opacity-50" : "font-serif text-[clamp(18px,2.5vw,32px)] font-light italic"}>{t}</span>
              )}
            </div>)}
          </div>
        </div>

        {/* ═══════ VIGNERONS ═══════ */}
        <section className="py-18 md:py-24 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-10 md:gap-16 items-center">
            <div className="flex-1 max-w-[380px] order-2 md:order-1" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Les vignerons</span>
              <h2 className="font-serif text-[clamp(24px,2.5vw,34px)] font-light leading-[1.2] mb-4">Julie &amp; Xavier</h2>
              <p className="font-sans text-[12.5px] leading-[2]" style={{ color: "var(--ink2)" }}>
                Julie Medeville, avocate, et Xavier Gonet, oenologue. Ensemble, ils reunissent deux terroirs sous une meme vision — vins vivants, sans concession.
              </p>
            </div>
            <div className="flex-1 order-1 md:order-2 img-zoom rounded overflow-hidden" data-reveal>
              <img src={photos.julieXavierCuves} alt="" className="w-full h-[280px] md:h-[380px] object-cover" />
            </div>
          </div>
        </section>

        {/* ═══════ HERITAGE ═══════ */}
        <section className="py-20 md:py-28 px-8 md:px-16 lg:px-24">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex items-end gap-6 mb-12" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Heritage</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.15)" }} />
            </div>
            <div className="space-y-10 md:space-y-14">
              {[
                { year: "1710", text: "La famille Despujols acquiert Preignac. Naissance de Gilette et Les Justices." },
                { year: "1930", text: "Rene Medeville invente le vieillissement long en cuves beton." },
                { year: "2000", text: "Xavier et Julie unissent Bordeaux et Champagne." },
                { year: "2009", text: "Acquisition du Chateau des Eyrins au coeur de Margaux." },
              ].map((item, i) => (
                <div key={i} data-heritage className="flex items-start gap-5 md:gap-10">
                  <span className="font-serif text-[clamp(32px,5vw,64px)] font-light leading-none flex-shrink-0" style={{ color: "rgba(158,130,90,0.3)" }}>{item.year}</span>
                  <p className="font-sans text-[12.5px] leading-[1.9] max-w-[400px] pt-2" style={{ color: "var(--ink2)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ PHOTO BREAK ═══════ */}
        <div className="relative h-[35vh] md:h-[50vh] overflow-hidden">
          <img src={photos.vignobleAutomne} alt="" className="w-full h-full object-cover" data-speed="-0.08" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--ink) 0%, rgba(14,14,12,0.1) 50%, rgba(14,14,12,0.25) 100%)" }} />
          <div className="absolute bottom-5 left-8 md:left-14">
            <span className="font-mono text-[9px] tracking-[2px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>44.14N 0.18W</span>
            <div className="font-serif text-white text-[clamp(16px,2vw,24px)] font-light italic mt-1">Preignac, Gironde</div>
          </div>
        </div>

        {/* ═══════ TERROIRS ═══════ */}
        <section className="relative py-20 md:py-28 px-8 md:px-16 lg:px-24" style={{ background: "var(--ink)", color: "#F7F5F0" }}>
          <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
            <div className="flex-1" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>Nos terroirs</span>
              <h2 className="font-serif text-[clamp(26px,3vw,40px)] font-light leading-[1.15] mb-5">De la craie a la grave</h2>
              <p className="font-sans text-[12.5px] leading-[2] max-w-[340px]" style={{ color: "rgba(247,245,240,0.45)" }}>Chaque domaine est le fruit d&apos;un terroir singulier.</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-7">
              {[
                { name: "Champagne", detail: "Craie · Grands & 1ers Crus", ha: "12 ha" },
                { name: "Sauternes", detail: "Sable, calcaire, argile", ha: "13 ha" },
                { name: "Margaux", detail: "Graves profondes", ha: "2,9 ha" },
                { name: "Graves", detail: "Graves, argile, sable", ha: "15 ha" },
              ].map(t => (
                <div key={t.name} data-reveal className="group">
                  <div className="font-serif text-[18px] font-light mb-1 group-hover:text-[var(--gold)] transition-colors duration-500">{t.name}</div>
                  <div className="font-sans text-[10px]" style={{ color: "rgba(247,245,240,0.35)" }}>{t.detail}</div>
                  <div className="font-mono text-[10px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{t.ha}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-12 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div>
              <div className="font-serif text-[20px] font-light mb-1.5">Gonet-Medeville</div>
              <p className="font-sans text-[10px]" style={{ color: "var(--ink2)" }}>Vignobles familiaux — Bordeaux &amp; Champagne</p>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="font-mono text-[9px] block mb-2 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Adresse</span>
                <p className="font-sans text-[10px] leading-relaxed" style={{ color: "var(--ink2)" }}>4 Rue du Port, 33210 Preignac</p>
              </div>
              <div>
                <span className="font-mono text-[9px] block mb-2 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Contact</span>
                <p className="font-sans text-[10px] leading-relaxed" style={{ color: "var(--ink2)" }}>+33 5 56 76 28 44</p>
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
