"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import SplitText from "@/components/SplitText";
import { wines } from "@/lib/wines";
import { photos } from "@/lib/images";

const BubbleField = dynamic(() => import("@/components/BubbleField"), { ssr: false });
const ClinkScene = dynamic(() => import("@/components/ClinkScene"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [ready, setReady] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  // Hero
  const heroSec = useRef<HTMLElement>(null);
  const heroImg = useRef<HTMLDivElement>(null);
  const heroOverlay = useRef<HTMLDivElement>(null);

  // Manifeste
  const manifesteSec = useRef<HTMLElement>(null);
  const manifesteImg = useRef<HTMLDivElement>(null);
  const manifesteText = useRef<HTMLDivElement>(null);

  // Cave
  const caveSec = useRef<HTMLElement>(null);
  const caveBg = useRef<HTMLDivElement>(null);
  const caveCard = useRef<HTMLDivElement>(null);
  const caveText = useRef<HTMLDivElement>(null);

  // Bottle showcase
  const bottleSec = useRef<HTMLDivElement>(null);
  const bottleWrap = useRef<HTMLDivElement>(null);
  const bottleImg = useRef<HTMLDivElement>(null);
  const bottleText = useRef<HTMLDivElement>(null);
  const bottleNum = useRef<HTMLDivElement>(null);

  // Quote
  const quoteSec = useRef<HTMLDivElement>(null);
  const quoteBg = useRef<HTMLDivElement>(null);

  // Gallery
  const gallerySec = useRef<HTMLDivElement>(null);
  const galleryTrack = useRef<HTMLDivElement>(null);

  // Wine fill
  const fillRef = useRef<HTMLDivElement>(null);
  const fillLevel = useRef<HTMLDivElement>(null);

  // Heritage
  const heritageSec = useRef<HTMLElement>(null);
  const heritageImg = useRef<HTMLDivElement>(null);

  const heritage = [
    { year: "1710", text: "La famille Despujols acquiert les terres de Preignac. Naissance de Gilette et Les Justices au cœur du Sauternais.", image: photos.chateau },
    { year: "1930", text: "René Médeville découvre le vieillissement long en cuves béton — la signature unique de Gilette.", image: photos.xavierFuts },
    { year: "2000", text: "Xavier Gonet et Julie Médeville unissent Bordeaux et Champagne. Naissance des Champagnes Gonet-Médeville.", image: photos.julieXavierCuves },
    { year: "2009", text: "Acquisition du Château des Eyrins — 3 hectares entourés par les vignes de Château Margaux.", image: photos.vineyard1 },
  ];

  useEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();

    // Bottle magnetic tilt — works on all sizes
    if (bottleWrap.current && bottleImg.current) {
      const wrap = bottleWrap.current;
      const img = bottleImg.current;
      const onMove = (e: MouseEvent) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(img, { rotateY: x * 18, rotateX: -y * 12, x: x * 30, y: y * 18, duration: 0.9, ease: "power3.out" });
      };
      const onLeave = () => gsap.to(img, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 1.4, ease: "power3.out" });
      wrap.addEventListener("mousemove", onMove);
      wrap.addEventListener("mouseleave", onLeave);
    }

    mm.add("(min-width: 768px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach(el => {
        gsap.to(el, {
          y: `${parseFloat(el.dataset.speed || "0") * 100}`,
          ease: "none",
          scrollTrigger: { trigger: el.closest("section, div") || el, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      // Hero parallax + Ken Burns
      if (heroSec.current && heroImg.current && heroOverlay.current) {
        gsap.to(heroImg.current, { scale: 1.22, y: "10%", ease: "none",
          scrollTrigger: { trigger: heroSec.current, start: "top top", end: "bottom top", scrub: 1 } });
        gsap.to(heroOverlay.current, { opacity: 1, ease: "none",
          scrollTrigger: { trigger: heroSec.current, start: "top top", end: "bottom top", scrub: 1 } });
      }

      // Manifeste pin — shorter, plays once on enter
      if (manifesteSec.current && manifesteImg.current && manifesteText.current) {
        gsap.set(manifesteImg.current, { clipPath: "inset(35% 25% 35% 25%)", scale: 1.25 });
        gsap.set(manifesteText.current.querySelectorAll("[data-line]"), { yPercent: 110, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: manifesteSec.current, start: "top top", end: "+=80%", pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        tl.to(manifesteImg.current,
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", duration: 1.2 }
        ).to(manifesteText.current.querySelectorAll("[data-line]"),
          { yPercent: 0, opacity: 1, stagger: 0.12, ease: "power3.out", duration: 0.9 }, "-=0.6"
        );
      }

      // Cave pin — shorter, scrub
      if (caveSec.current && caveBg.current && caveCard.current && caveText.current) {
        gsap.set(caveBg.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(caveCard.current, { opacity: 0, x: 60, clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(caveText.current.querySelectorAll("[data-line]"), { y: 30, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: caveSec.current, start: "top top", end: "+=110%", pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        tl.to(caveBg.current,
          { clipPath: "inset(8% 50% 8% 8%)", ease: "power2.inOut", duration: 1.4 }
        ).to(caveCard.current,
          { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.out" }, "-=1.0"
        ).to(caveText.current.querySelectorAll("[data-line]"),
          { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out" }, "-=0.8"
        );
      }

      // Bottle pin — slow & legible
      if (bottleSec.current) {
        gsap.set(bottleImg.current, { scale: 0.55, opacity: 0, y: 80, rotateY: -15 });
        gsap.set(bottleText.current, { opacity: 0, x: 50 });
        gsap.set(bottleNum.current, { opacity: 0, y: 20 });
        const btl = gsap.timeline({
          scrollTrigger: { trigger: bottleSec.current, start: "top top", end: "+=200%", pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        btl
          .to(bottleImg.current, { scale: 1, opacity: 1, y: 0, rotateY: 0, duration: 1.4, ease: "power2.out" })
          .to(bottleImg.current, { x: "-25vw", scale: 0.85, duration: 1.6 }, "+=0.3")
          .to(bottleText.current, { opacity: 1, x: 0, duration: 1.2 }, "<0.4")
          .to(bottleNum.current, { opacity: 0.22, y: 0, duration: 0.9 }, "<0.4")
          .to({}, { duration: 1.4 });
      }

      // Wine fill
      if (fillRef.current && fillLevel.current) {
        gsap.fromTo(fillLevel.current, { height: "0%" },
          { height: "70%", ease: "power1.inOut",
            scrollTrigger: { trigger: fillRef.current, start: "top 60%", end: "bottom 40%", scrub: 1 } });
      }

      // Quote
      gsap.fromTo(quoteBg.current, { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(85% at 50% 50%)",
          scrollTrigger: { trigger: quoteSec.current, start: "top 55%", end: "center center", scrub: 1 } });

      // Gallery — tight cards, snap, scale-focus on the active card
      if (galleryTrack.current && gallerySec.current) {
        const cards = galleryTrack.current.querySelectorAll<HTMLElement>("[data-card]");
        const tw = galleryTrack.current.scrollWidth - window.innerWidth;
        const updateFocus = () => {
          const cx = window.innerWidth / 2;
          cards.forEach((card) => {
            const r = card.getBoundingClientRect();
            const center = r.left + r.width / 2;
            const dist = Math.abs(center - cx) / window.innerWidth;
            const k = Math.max(0, 1 - dist * 1.6);
            const scale = 0.78 + k * 0.22;
            const opacity = 0.35 + k * 0.65;
            gsap.set(card, { scale, opacity });
          });
        };
        gsap.to(galleryTrack.current, {
          x: -tw, ease: "none",
          scrollTrigger: {
            trigger: gallerySec.current, start: "top top", end: () => `+=${tw}`,
            pin: true, scrub: 0.6, anticipatePin: 1,
            snap: { snapTo: 1 / (wines.length - 1), duration: 0.55, ease: "power2.inOut" },
            onUpdate: updateFocus,
            onRefresh: updateFocus,
          }
        });
        updateFocus();
      }

      // Heritage swap
      if (heritageSec.current && heritageImg.current) {
        const rows = heritageSec.current.querySelectorAll<HTMLElement>("[data-heritage-row]");
        const images = heritageImg.current.querySelectorAll<HTMLElement>("[data-heritage-img]");
        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row, start: "top 65%", end: "bottom 35%",
            onEnter: () => swap(i), onEnterBack: () => swap(i),
          });
        });
        function swap(idx: number) {
          images.forEach((img, j) => {
            gsap.to(img, { opacity: j === idx ? 1 : 0, scale: j === idx ? 1 : 1.05, duration: 0.9, ease: "power2.out" });
          });
        }
      }

      // Mood reveal
      gsap.utils.toArray<HTMLElement>("[data-mood]").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 60, scale: 0.93 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9,
            scrollTrigger: { trigger: el, start: "top 88%" },
            delay: (i % 4) * 0.06 });
      });

      gsap.utils.toArray<HTMLElement>("[data-heritage-row]").forEach(el => {
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

      {/* Persistent WebGL background — bubbles + cursor orb */}
      <BubbleField />

      <main className="relative z-[1]" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <Nav />

        {/* ═══════ HERO — massive type ═══════ */}
        <section ref={heroSec} className="h-screen relative overflow-hidden">
          <div ref={heroImg} className="absolute inset-0 will-change-transform photo-grade">
            <img src={photos.hero} alt="Vignoble Gonet-Médeville" className="w-full h-full object-cover" style={{ transform: "scale(1.1)", animation: "kenBurns 22s ease-in-out infinite alternate" }} />
          </div>

          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(14,14,12,0.18) 0%, transparent 28%, rgba(14,14,12,0.65) 100%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(120deg, rgba(247,245,240,0.45) 0%, rgba(247,245,240,0.1) 35%, transparent 60%)" }} />
          {/* Falling dust particles */}
          <div className="absolute inset-0 pointer-events-none dust-layer" />
          <div ref={heroOverlay} className="absolute inset-0 pointer-events-none opacity-0" style={{ background: "linear-gradient(180deg, rgba(14,14,12,0.0) 0%, rgba(14,14,12,0.55) 100%)" }} />

          {/* Eyebrow + scroll cue */}
          <div className="absolute top-[28vh] left-[6%] z-10" style={{ opacity: ready ? 1 : 0, transform: ready ? "translateY(0)" : "translateY(12px)", transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s" }}>
            <span className="font-mono text-[11px] tracking-[2px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
              Vignobles familiaux &mdash; Depuis MDCCX
            </span>
          </div>

          {/* MASSIVE wordmark */}
          <h1 className="absolute inset-0 flex flex-col justify-center font-serif font-light leading-[0.82] z-10 pointer-events-none px-[4%]">
            <span className="block tracking-[-0.04em]" style={{ fontSize: "clamp(110px, 26vw, 420px)" }}>
              {L1.map((c, i) => (
                <span key={i} className="inline-block" style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? "translateY(0)" : "translateY(120%)",
                  transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${0.5 + i * 0.06}s`,
                  color: "var(--ink)",
                  textShadow: "0 4px 30px rgba(247,245,240,0.55)",
                }}>{c}</span>
              ))}
            </span>
            <span className="block italic tracking-[-0.02em] -mt-[2vw]" style={{ fontSize: "clamp(80px, 19vw, 320px)", color: "var(--gold)" }}>
              {L2.map((c, i) => (
                <span key={i} className="inline-block" style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? "translateY(0)" : "translateY(120%)",
                  transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${0.85 + i * 0.05}s`,
                }}>{c}</span>
              ))}
            </span>
          </h1>

          <div className="absolute bottom-12 left-[6%] right-[6%] flex items-end justify-between z-10" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.6s" }}>
            <div className="max-w-[360px]">
              <p className="font-sans text-[13px] leading-[1.85]" style={{ color: "var(--ink2)" }}>
                Sept domaines d&apos;exception. De la craie champenoise aux graves bordelaises, trois siècles d&apos;un savoir-faire transmis.
              </p>
              <button className="btn-fill mt-6" data-hover data-cursor="enter"><span>Découvrir</span></button>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="font-mono text-[10px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>scroll</span>
              <div className="w-[1px] h-12 relative overflow-hidden" style={{ background: "rgba(158,130,90,0.3)" }}>
                <div className="w-full h-1/2 bg-[var(--gold)]" style={{ animation: "scrollLine 2.5s ease-in-out infinite" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ MARQUEE XXL ═══════ */}
        <MarqueeXXL />

        {/* ═══════ MANIFESTE 1710 (chap I — inline) ═══════ */}
        <section ref={manifesteSec} className="h-screen relative overflow-hidden" style={{ background: "var(--bg)" }}>
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-0">
            <div ref={manifesteImg} className="md:col-span-7 relative h-[55vh] md:h-screen overflow-hidden will-change-[clip-path,transform] photo-grade">
              <img src={photos.chateau} alt="Château de Preignac" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.45) 0%, transparent 40%)" }} />
              <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[2px] text-white/80" style={{ fontFamily: "'DM Mono', monospace" }}>EST. MDCCX · PREIGNAC</div>
            </div>
            <div ref={manifesteText} className="md:col-span-5 relative flex items-center px-8 md:px-12 lg:px-16 py-16">
              <div className="max-w-[420px]">
                <div className="overflow-hidden mb-6"><span data-line className="inline-block font-mono text-[11px] tracking-[2px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>1710 — Manifeste</span></div>
                <h2 className="font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.02] mb-8 tracking-[-1.5px]">
                  <span className="block overflow-hidden"><span data-line className="inline-block">Trois siècles</span></span>
                  <span className="block overflow-hidden"><span data-line className="inline-block italic" style={{ color: "var(--gold)" }}>de patience</span></span>
                  <span className="block overflow-hidden"><span data-line className="inline-block">incarnée.</span></span>
                </h2>
                <div className="overflow-hidden">
                  <p data-line className="font-sans text-[14px] leading-[1.95]" style={{ color: "var(--ink2)" }}>
                    De la pierre calcaire qui porte la vigne au verre qui révèle le millésime, chaque geste s&apos;inscrit dans le temps long. Nous ne précipitons rien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CAVE (chap II — inline) ═══════ */}
        <section ref={caveSec} className="h-screen relative overflow-hidden" style={{ background: "#0E0E0C" }}>
          <div ref={caveBg} className="absolute inset-0 will-change-[clip-path] photo-grade">
            <img src={photos.cellar} alt="Cave de Gilette" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(14,14,12,0.5) 0%, rgba(14,14,12,0.2) 50%, rgba(14,14,12,0.75) 100%)" }} />
          </div>

          <div ref={caveCard} className="absolute right-[6%] lg:right-[8%] top-1/2 -translate-y-1/2 w-[42%] lg:w-[36%] max-w-[480px] aspect-[3/4] overflow-hidden will-change-[clip-path,transform] photo-grade">
            <img src={photos.julieCave} alt="Julie Médeville en cave" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.5) 0%, transparent 45%)" }} />
            <div className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[2px] text-white/85" style={{ fontFamily: "'DM Mono', monospace" }}>JULIE MÉDEVILLE</div>
          </div>

          <div ref={caveText} className="absolute left-[6%] lg:left-[10%] top-1/2 -translate-y-1/2 max-w-[440px] z-10" style={{ color: "#F7F5F0" }}>
            <div className="overflow-hidden mb-5"><span data-line className="inline-block font-mono text-[11px] tracking-[2px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>002 — Le Geste</span></div>
            <h2 className="font-serif text-[clamp(34px,4.5vw,60px)] font-light leading-[1.05] mb-7 tracking-[-1px]">
              <span data-line className="block">Les bouteilles dorment.</span>
              <span data-line className="block italic" style={{ color: "var(--gold)" }}>Nous veillons.</span>
            </h2>
            <p data-line className="font-sans text-[14px] leading-[1.95] mb-8" style={{ color: "rgba(247,245,240,0.7)" }}>
              Dans le silence des chais, Julie et Xavier prolongent un héritage. Pas d&apos;artifice, pas de hâte — la lumière, la fraîcheur, et le temps font le reste.
            </p>
            <div data-line><button className="btn-fill" data-hover data-cursor="visit" style={{ borderColor: "var(--gold)", color: "#F7F5F0" }}><span>Visiter les chais</span></button></div>
          </div>
        </section>

        {/* ═══════ Photo break — high-quality only ═══════ */}
        <div className="relative h-[60vh] md:h-[80vh] overflow-hidden">
          <img src={photos.vineyard1} alt="" className="w-full h-full object-cover photo-grade" data-speed="-0.12" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, var(--bg) 0%, transparent 25%, transparent 75%, var(--bg) 100%)" }} />
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <SplitText as="h3" by="word" className="font-serif text-white text-[clamp(38px,7vw,110px)] font-light italic drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] text-center tracking-[-1.5px] leading-[0.95]">
              {"L'art\ndu temps."}
            </SplitText>
          </div>
        </div>

        {/* ═══════ Wine glass clink R3F (chap III — inline title in scene) ═══════ */}
        <ClinkScene />

        {/* ═══════ BOTTLE SHOWCASE — magnetic tilt ═══════ */}
        <section ref={bottleSec} className="h-screen flex items-center justify-center relative" style={{ background: "var(--bg)" }}>
          <div ref={bottleWrap} className="absolute inset-0 z-10 flex items-center justify-center">
            <div ref={bottleImg} className="opacity-0 will-change-transform" style={{ filter: "drop-shadow(0 60px 90px rgba(14,14,12,0.35))", perspective: "800px", transformStyle: "preserve-3d" }}>
              <Image src={wines[0].image} alt={wines[0].name} width={280} height={700} priority className="object-contain select-none pointer-events-none" style={{ maxHeight: "78vh" }} />
            </div>
          </div>
          <div ref={bottleText} className="absolute right-[8%] lg:right-[12%] top-1/2 -translate-y-1/2 max-w-[420px] opacity-0 z-20">
            <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>003 — Sauternes</span>
            <h2 className="font-serif text-[clamp(34px,4vw,56px)] font-light leading-[1.05] mb-3">Château Gilette</h2>
            <p className="font-serif text-[15px] italic mb-6" style={{ color: "var(--ink2)" }}>Crème de Tête — {wines[0].year}</p>
            <p className="font-sans text-[13px] leading-[2] mb-8" style={{ color: "var(--ink2)" }}>{wines[0].description}</p>
            <div className="flex gap-12 mb-10">
              <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cépages</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].blend}</span></div>
              <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wines[0].surface}</span></div>
            </div>
            <button className="btn-fill" data-hover data-cursor="open"><span>Fiche complète</span></button>
          </div>
          <div ref={bottleNum} className="absolute left-[6%] bottom-[12%] opacity-0 z-10">
            <div className="font-serif text-[clamp(80px,11vw,180px)] font-light leading-none" style={{ color: "rgba(158,130,90,0.18)" }}>01</div>
          </div>
        </section>

        {/* ═══════ Wine fill ═══════ */}
        <section ref={fillRef} className="py-28 md:py-36 px-8 md:px-16 relative overflow-hidden" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="flex-shrink-0 w-[120px] h-[300px] relative" data-reveal>
              <svg viewBox="0 0 120 300" className="w-full h-full">
                <defs>
                  <clipPath id="glassClip">
                    <path d="M30,10 Q30,0 40,0 L80,0 Q90,0 90,10 L95,130 Q95,160 75,170 L70,175 L70,250 L85,260 Q90,265 90,270 L90,280 Q90,290 80,290 L40,290 Q30,290 30,280 L30,270 Q30,265 35,260 L50,250 L50,175 L45,170 Q25,160 25,130 Z" />
                  </clipPath>
                </defs>
                <path d="M30,10 Q30,0 40,0 L80,0 Q90,0 90,10 L95,130 Q95,160 75,170 L70,175 L70,250 L85,260 Q90,265 90,270 L90,280 Q90,290 80,290 L40,290 Q30,290 30,280 L30,270 Q30,265 35,260 L50,250 L50,175 L45,170 Q25,160 25,130 Z" fill="none" stroke="var(--gold)" strokeWidth="1.5" opacity="0.45" />
                <g clipPath="url(#glassClip)">
                  <rect ref={fillLevel as unknown as React.RefObject<SVGRectElement>} x="0" y="300" width="120" height="300" fill="rgba(91,26,46,0.55)" style={{ transformOrigin: "bottom", transition: "none" }} />
                </g>
              </svg>
            </div>
            <div className="flex-1 max-w-[500px]" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>L&apos;expérience</span>
              <SplitText as="h2" by="word" className="font-serif text-[clamp(32px,4vw,52px)] font-light leading-[1.1] mb-6 tracking-[-0.5px]">
                Un art de la patience.
              </SplitText>
              <p className="font-sans text-[13px] leading-[2]" style={{ color: "var(--ink2)" }}>
                Chez Gonet-Médeville, le temps est un allié. Château Gilette repose vingt ans en cuves béton avant sa mise en bouteille. Les Champagnes vieillissent quatorze ans sur lattes.
              </p>
              <div className="mt-8 flex items-center gap-8">
                <Stat n="20" l="ans en cuves" />
                <Sep />
                <Stat n="14" l="ans sur lattes" />
                <Sep />
                <Stat n="5k" l="bouteilles" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ QUOTE ═══════ */}
        <section ref={quoteSec} className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
          <img src={photos.julieXavierCave} alt="" className="absolute inset-0 w-full h-full object-cover photo-grade" style={{ filter: "blur(2px) brightness(0.4)" }} />
          <div ref={quoteBg} className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--ink)", clipPath: "circle(0% at 50% 50%)" }}>
            <div className="max-w-[680px] px-8 text-center" style={{ color: "#F7F5F0" }}>
              <blockquote className="font-serif text-[clamp(22px,3.2vw,40px)] font-light italic leading-[1.55] tracking-[-0.5px]">
                Nous créons des vins vivants, reflets de notre savoir-faire et de notre culture — du choix du plant au dégorgement.
              </blockquote>
              <div className="mt-10 font-mono text-[10px] tracking-[2px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>JULIE &amp; XAVIER GONET-MÉDEVILLE</div>
            </div>
          </div>
        </section>


        {/* ═══════ MOOD BOARD — tiered by photo quality ═══════ */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3 auto-rows-[160px] md:auto-rows-[200px]">
            {/* HQ — large feature tiles */}
            <MoodTile mood src={photos.cellar} label="Les chais" caption="GILETTE 1989" className="col-span-2 row-span-2" big />
            <MoodTile mood src={photos.julieCave} label="Julie · cave" className="col-span-2 row-span-2" big />
            <MoodTile mood src={photos.barrels} label="Fûts · Xavier" className="row-span-2" />
            <MoodTile mood src={photos.cork} label="Bouchons" />
            <MoodTile mood src={photos.coffret} label="Coffret · Champagne" />

            {/* MQ — medium */}
            <MoodTile mood src={photos.rows} label="Les rangs" caption="LE TERROIR" className="col-span-2" />
            <MoodTile mood src={photos.julieXavierCuves} label="Cuves béton" />
            <MoodTile mood src={photos.etiquette} label="Étiquette" />
            <MoodTile mood src={photos.vieillesBouteilles} label="Vieux millésimes" />
            <MoodTile mood src={photos.grapes} label="Vendanges" />
          </div>
        </section>

        {/* ═══════ COLLECTION header ═══════ */}
        <div className="px-8 md:px-16 lg:px-24 py-16 md:py-24">
          <div className="flex items-end justify-between flex-wrap gap-6" data-reveal>
            <div>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)] block mb-4" style={{ fontFamily: "'DM Mono', monospace" }}>La collection</span>
              <SplitText as="h2" by="char" className="font-serif text-[clamp(40px,6vw,80px)] font-light leading-none tracking-[-2px]">Nos vins</SplitText>
            </div>
            <p className="font-sans text-[13px] max-w-[300px] leading-[1.8]" style={{ color: "var(--ink2)" }}>
              Quatre appellations, sept domaines — l&apos;empreinte d&apos;un terroir dans chaque bouteille.
            </p>
          </div>
          <div className="w-full h-[1px] mt-8" style={{ background: "rgba(158,130,90,0.12)" }} />
        </div>

        {/* ═══════ Horizontal gallery — tight, focus-scaled cards ═══════ */}
        <section ref={gallerySec} className="relative overflow-hidden h-screen" style={{ background: "var(--bg)" }}>
          <div ref={galleryTrack} className="flex h-screen items-center" style={{ width: `${20 + wines.length * 62}vw`, paddingLeft: "20vw", paddingRight: "20vw" }}>
            {wines.map((wine, idx) => (
              <div
                key={wine.id}
                data-card
                className="flex-shrink-0 h-[80vh] flex items-center justify-center mx-[1vw] rounded-[2px] relative"
                style={{
                  width: "60vw",
                  background: "linear-gradient(180deg, var(--bg) 0%, var(--warm) 100%)",
                  border: "1px solid rgba(158,130,90,0.12)",
                  boxShadow: "0 30px 80px rgba(14,14,12,0.08)",
                  transformOrigin: "center center",
                  willChange: "transform, opacity",
                }}
              >
                <div className="w-full h-full flex items-center px-[clamp(24px,4vw,72px)]">
                  <div className="flex-shrink-0 relative" style={{ width: "32%" }}>
                    <div style={{ filter: "drop-shadow(0 30px 60px rgba(14,14,12,0.25))" }}>
                      <Image src={wine.image} alt={wine.name} width={220} height={580} className="object-contain select-none mx-auto" style={{ maxHeight: "62vh" }} />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[2px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{String(idx + 1).padStart(2, "0")} / 0{wines.length}</div>
                  </div>
                  <div className="flex-1 pl-[clamp(24px,3vw,56px)]">
                    <span className="font-mono text-[10px] tracking-[2px] block mb-4" style={{ color: wine.accent, fontFamily: "'DM Mono', monospace" }}>{wine.appellation}</span>
                    <h3 className="font-serif text-[clamp(30px,3.2vw,52px)] font-light leading-[1.05] mb-1 tracking-[-1px]">
                      {wine.prefix !== "Champagne" && <span className="block text-[0.5em] font-normal opacity-70" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>}
                      {wine.name}
                    </h3>
                    <p className="font-serif text-[14px] italic mt-2 mb-6" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</p>
                    <p className="font-sans text-[13px] leading-[1.95] mb-8" style={{ color: "var(--ink2)", maxWidth: "32vw" }}>{wine.description}</p>
                    <div className="flex gap-8 mb-8">
                      <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Cépages</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.blend}</span></div>
                      <div><span className="font-mono text-[10px] block mb-1.5 text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Vignoble</span><span className="font-sans text-[12px]" style={{ color: "var(--ink2)" }}>{wine.surface}</span></div>
                    </div>
                    <button className="btn-fill" data-hover data-cursor="open"><span>Découvrir</span></button>
                  </div>
                </div>
                <div className="absolute bottom-[6%] right-[6%] font-serif text-[clamp(60px,9vw,140px)] font-light leading-none pointer-events-none select-none" style={{ color: "rgba(158,130,90,0.08)" }}>{wine.year}</div>
              </div>
            ))}
          </div>

          {/* Progress / index indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            {wines.map((_, i) => (
              <div key={i} className="w-8 h-[1px]" style={{ background: "rgba(158,130,90,0.3)" }} />
            ))}
          </div>
        </section>

        {/* ═══════ MARQUEE XXL bis ═══════ */}
        <MarqueeXXL reverse />


        {/* ═══════ HÉRITAGE ═══════ */}
        <section ref={heritageSec} className="py-28 md:py-36 px-8 md:px-16 lg:px-24" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1300px] mx-auto">
            <div className="flex items-end gap-6 mb-16" data-reveal>
              <span className="font-mono text-[11px] tracking-[1px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>Héritage</span>
              <div className="flex-1 h-[1px]" style={{ background: "rgba(158,130,90,0.15)" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-5 md:sticky md:top-24 self-start">
                <div ref={heritageImg} className="relative w-full aspect-[4/5] overflow-hidden photo-grade">
                  {heritage.map((h, i) => (
                    <div key={h.year} data-heritage-img className="absolute inset-0" style={{ opacity: i === 0 ? 1 : 0 }}>
                      <img src={h.image} alt={h.year} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.4) 0%, transparent 50%)" }} />
                      <div className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[2px] text-white/90" style={{ fontFamily: "'DM Mono', monospace" }}>{h.year}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-7 space-y-20 md:space-y-28">
                {heritage.map((item, i) => (
                  <div key={i} data-heritage-row className="flex items-start gap-6 md:gap-12">
                    <span className="font-serif text-[clamp(48px,7vw,110px)] font-light leading-none flex-shrink-0 tracking-[-2px]" style={{ color: "rgba(158,130,90,0.32)" }}>{item.year}</span>
                    <p className="font-sans text-[14px] leading-[1.95] max-w-[460px] pt-2 md:pt-4" style={{ color: "var(--ink2)" }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ Photo break sunset ═══════ */}
        <div className="relative h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={photos.sunset} alt="" className="w-full h-full object-cover photo-grade" data-speed="-0.1" />
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
              <SplitText as="h2" by="word" className="font-serif text-[clamp(32px,4vw,56px)] font-light leading-[1.1] mb-8 tracking-[-1px]">
                De la craie à la grave.
              </SplitText>
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
                <div className="font-serif text-[clamp(36px,5vw,64px)] font-light leading-none tracking-[-1px]">{s.n}</div>
                <div className="font-mono text-[10px] tracking-[1px] mt-2.5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-14 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between gap-10 mb-14">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Gonet-Médeville" className="w-14 h-14" />
              <div>
                <div className="font-serif text-[22px] font-light">Gonet-Médeville</div>
                <p className="font-sans text-[11px] leading-relaxed" style={{ color: "var(--ink2)" }}>Vignobles familiaux — Bordeaux &amp; Champagne</p>
              </div>
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

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-[40px] font-light tracking-[-1px]" style={{ color: "var(--ink)" }}>{n}</div>
      <div className="font-mono text-[9px] tracking-[1px] mt-1" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{l}</div>
    </div>
  );
}
function Sep() {
  return <div className="w-[1px] h-12" style={{ background: "rgba(158,130,90,0.2)" }} />;
}

function MoodTile({ src, label, caption, className = "", mood, big }: { src: string; label: string; caption?: string; className?: string; mood?: boolean; big?: boolean }) {
  return (
    <div {...(mood ? { "data-mood": "" } : {})} data-hover data-cursor="view" className={`relative overflow-hidden rounded photo-grade group ${className}`}>
      <img src={src} alt={label} className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.6) 0%, transparent 60%)" }} />
      <div className={`absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ${big ? "" : ""}`}>
        <span className={`font-serif italic text-white leading-tight ${big ? "text-[18px]" : "text-[14px]"}`}>{label}</span>
        {caption && <span className="font-mono text-[9px] tracking-[2px] text-white/70" style={{ fontFamily: "'DM Mono', monospace" }}>{caption}</span>}
      </div>
    </div>
  );
}

function MarqueeXXL({ reverse }: { reverse?: boolean }) {
  const items = ["Sauternes", "·", "Champagne", "·", "Margaux", "·", "Graves", "·", "Bordeaux Supérieur", "·"];
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: "rgba(158,130,90,0.15)", background: "var(--bg)" }}>
      <div className={`flex gap-16 whitespace-nowrap py-2 ${reverse ? "animate-marqueeR" : "animate-marquee"}`} style={{ width: "fit-content" }}>
        {[0, 1].map(j => (
          <div key={j} className="flex gap-16 items-center">
            {items.map((t, i) => (
              <span key={i} className={t === "·" ? "text-[18px] text-[var(--gold)] opacity-50" : "font-serif font-light italic tracking-[-1px]"} style={t === "·" ? {} : { fontSize: "clamp(60px, 11vw, 180px)", lineHeight: 1 }}>{t}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
