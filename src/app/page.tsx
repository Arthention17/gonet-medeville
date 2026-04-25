"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import SplitText from "@/components/SplitText";
import EditorialGallery from "@/components/EditorialGallery";
import Hero from "@/components/Hero";
import ChapterIntro from "@/components/ChapterIntro";
import Degustation from "@/components/Degustation";
import CalendrierVigneron from "@/components/CalendrierVigneron";
import Press from "@/components/Press";
import { wines } from "@/lib/wines";

const FEATURED_IDS = ["gilette", "champ-alouette", "eyrins", "respide", "athenais", "rose", "grande-ruelle", "theophile"];
const featuredWines = FEATURED_IDS
  .map(id => wines.find(w => w.id === id))
  .filter((w): w is (typeof wines)[number] => Boolean(w));
import { photos } from "@/lib/images";

const BubbleField = dynamic(() => import("@/components/BubbleField"), { ssr: false });

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

  // Quote
  const quoteSec = useRef<HTMLDivElement>(null);
  const quoteBg = useRef<HTMLDivElement>(null);

  // Wine fill
  const fillRef = useRef<HTMLDivElement>(null);
  const fillLevel = useRef<HTMLDivElement>(null);

  // Heritage
  const heritageSec = useRef<HTMLElement>(null);
  const heritageImg = useRef<HTMLDivElement>(null);

  const heritage = [
    { year: "1710", text: "La famille Despujols acquiert les terres de Preignac. Naissance des domaines de Gilette et des Justices au cœur du Sauternais — une histoire qui ne s'est jamais interrompue.", image: photos.chapelle },
    { year: "1930", text: "René Medeville découvre le vieillissement long en cuves béton — vingt années de patience pour révéler la quintessence d'un Sauternes. Cette signature unique forge la légende de Gilette.", image: photos.xavierFuts },
    { year: "2000", text: "Xavier Gonet et Julie Medeville unissent Bordeaux et Champagne. Naissance des Champagnes Gonet-Medeville — pour la première fois, deux terroirs d'exception conjugués sous un même nom.", image: photos.julieXavierVignes },
    { year: "2009", text: "Acquisition du Château des Eyrins — trois hectares cernés par les vignes du Premier Grand Cru Classé Château Margaux. Le micro-domaine entre dans la maison.", image: photos.chateauEyrins },
  ];

  useEffect(() => {
    if (!ready) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach(el => {
        gsap.to(el, {
          y: `${parseFloat(el.dataset.speed || "0") * 100}`,
          ease: "none",
          scrollTrigger: { trigger: el.closest("section, div") || el, start: "top bottom", end: "bottom top", scrub: true }
        });
      });

      // Hero parallax
      if (heroSec.current && heroImg.current && heroOverlay.current) {
        gsap.to(heroImg.current, { scale: 1.18, y: "8%", ease: "none",
          scrollTrigger: { trigger: heroSec.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to(heroOverlay.current, { opacity: 1, ease: "none",
          scrollTrigger: { trigger: heroSec.current, start: "top top", end: "bottom top", scrub: true } });
      }

      // Manifeste pin — tighter
      if (manifesteSec.current && manifesteImg.current && manifesteText.current) {
        gsap.set(manifesteImg.current, { clipPath: "inset(35% 25% 35% 25%)", scale: 1.2 });
        gsap.set(manifesteText.current.querySelectorAll("[data-line]"), { yPercent: 110, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: manifesteSec.current, start: "top top", end: "+=70%", pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        tl.to(manifesteImg.current, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "power2.out", duration: 1.2 })
          .to(manifesteText.current.querySelectorAll("[data-line]"), { yPercent: 0, opacity: 1, stagger: 0.1, ease: "power3.out", duration: 0.9 }, "-=0.6");
      }

      // Cave pin — tighter
      if (caveSec.current && caveBg.current && caveCard.current && caveText.current) {
        gsap.set(caveBg.current, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(caveCard.current, { opacity: 0, x: 60, clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(caveText.current.querySelectorAll("[data-line]"), { y: 30, opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: caveSec.current, start: "top top", end: "+=80%", pin: true, scrub: true, invalidateOnRefresh: true, anticipatePin: 1 }
        });
        tl.to(caveBg.current, { clipPath: "inset(8% 50% 8% 8%)", ease: "power2.inOut", duration: 1.4 })
          .to(caveCard.current, { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.out" }, "-=1.0")
          .to(caveText.current.querySelectorAll("[data-line]"), { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out" }, "-=0.8");
      }

      // Wine fill
      if (fillRef.current && fillLevel.current) {
        gsap.fromTo(fillLevel.current, { height: "0%" },
          { height: "70%", ease: "power1.inOut",
            scrollTrigger: { trigger: fillRef.current, start: "top 60%", end: "bottom 40%", scrub: true } });
      }

      // Quote
      gsap.fromTo(quoteBg.current, { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(85% at 50% 50%)",
          scrollTrigger: { trigger: quoteSec.current, start: "top 55%", end: "center center", scrub: true } });

      // Heritage — directional reveals + clip-path image swap
      if (heritageSec.current && heritageImg.current) {
        const rows = heritageSec.current.querySelectorAll<HTMLElement>("[data-heritage-row]");
        const images = heritageImg.current.querySelectorAll<HTMLElement>("[data-heritage-img]");
        rows.forEach((row, i) => {
          const yearEl = row.querySelector<HTMLElement>("[data-h-year]");
          const textEl = row.querySelector<HTMLElement>("[data-h-text]");
          if (yearEl) gsap.set(yearEl, { x: -120, opacity: 0 });
          if (textEl) gsap.set(textEl, { x: 80, opacity: 0 });
          gsap.to(yearEl, {
            x: 0, opacity: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          });
          gsap.to(textEl, {
            x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.18,
            scrollTrigger: { trigger: row, start: "top 80%", once: true },
          });
          ScrollTrigger.create({
            trigger: row, start: "top 65%", end: "bottom 35%",
            onEnter: () => swap(i), onEnterBack: () => swap(i),
          });
        });
        gsap.set(images, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
        gsap.set(images[0], { clipPath: "inset(0 0% 0 0)", opacity: 1 });
        function swap(idx: number) {
          images.forEach((img, j) => {
            if (j === idx) {
              gsap.fromTo(img,
                { clipPath: "inset(0 100% 0 0)", opacity: 1 },
                { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1, ease: "power3.out" }
              );
            } else {
              gsap.to(img, { opacity: 0, duration: 0.6, ease: "power2.out" });
            }
          });
        }
      }

      gsap.utils.toArray<HTMLElement>("[data-mood]").forEach((el, i) => {
        gsap.fromTo(el, { opacity: 0, y: 60, scale: 0.93 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9,
            scrollTrigger: { trigger: el, start: "top 88%" },
            delay: (i % 4) * 0.06 });
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el => {
      gsap.fromTo(el, { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 86%" } });
    });

    // Animated counters
    gsap.utils.toArray<HTMLElement>("[data-counter]").forEach(el => {
      const raw = el.getAttribute("data-counter") || "0";
      const num = parseFloat(raw.replace(/[^\d.]/g, ""));
      const prefix = raw.startsWith("~") ? "~" : "";
      const suffix = raw.endsWith("k") ? "k" : "";
      const obj = { v: 0 };
      gsap.to(obj, {
        v: num,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = prefix + Math.round(obj.v) + suffix;
        },
      });
    });

    return () => mm.revert();
  }, [ready]);

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {!ready && <Preloader onComplete={onDone} />}

      <BubbleField />

      <main className="relative z-[1]" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}>
        <Nav />

        <Hero ref={heroSec} heroImg={heroImg} heroOverlay={heroOverlay} ready={ready} />
        <div id="after-hero" />

        <ChapterIntro
          number="I"
          title="L'Origine"
          hint="Une famille, sept terroirs, trois siècles. De Preignac au Mesnil-sur-Oger."
          variant="wipe"
        />

        {/* ═══════ CHAPITRE I · L'ORIGINE — Manifeste 1710 ═══════ */}
        <section id="manifeste" ref={manifesteSec} className="h-screen relative overflow-hidden" style={{ background: "var(--bg)" }}>
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-0">
            <div ref={manifesteImg} className="md:col-span-7 relative h-[55vh] md:h-screen overflow-hidden will-change-[clip-path,transform] photo-grade">
              <img src={photos.chateau} alt="Château de Preignac" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.45) 0%, transparent 40%)" }} />
              <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-[2px] text-white/80" style={{ fontFamily: "'DM Mono', monospace" }}>EST. MDCCX · PREIGNAC</div>
            </div>
            <div ref={manifesteText} className="md:col-span-5 relative flex items-center px-8 md:px-12 lg:px-16 py-16">
              <div className="max-w-[440px]">
                <div className="overflow-hidden mb-6">
                  <span data-line className="inline-block font-mono text-[11px] tracking-[3px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>
                    CHAPITRE I — L&apos;ORIGINE
                  </span>
                </div>
                <h2 className="font-serif text-[clamp(38px,5vw,68px)] font-light leading-[1.02] mb-7 tracking-[-1.5px]">
                  <span className="block overflow-hidden"><span data-line className="inline-block">Trois siècles</span></span>
                  <span className="block overflow-hidden"><span data-line className="inline-block italic" style={{ color: "var(--gold)" }}>de patience</span></span>
                  <span className="block overflow-hidden"><span data-line className="inline-block">incarnée.</span></span>
                </h2>
                <div className="overflow-hidden">
                  <p data-line className="font-sans text-[14px] leading-[1.95] mb-4" style={{ color: "var(--ink2)" }}>
                    Depuis 1710, la famille Medeville cultive l&apos;art du vin à Preignac, au cœur du Sauternais. En 2000, l&apos;union de Julie Medeville et Xavier Gonet rassemble deux savoir-faire d&apos;exception — le Bordelais et la Champagne — pour créer une maison unique en France.
                  </p>
                </div>
                <div className="overflow-hidden">
                  <p data-line className="font-sans text-[14px] leading-[1.95]" style={{ color: "var(--ink2)" }}>
                    De la pierre calcaire qui porte la vigne au verre qui révèle le millésime, chaque geste s&apos;inscrit dans le temps long. Nous ne précipitons rien.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ChapterIntro
          number="II"
          title="Le Geste"
          hint="Dans le silence des chais, la matière prend forme. Cuves béton, fûts de chêne, et le temps."
          variant="reveal"
        />

        {/* ═══════ CHAPITRE II · LE GESTE — Cave ═══════ */}
        <section ref={caveSec} className="h-screen relative overflow-hidden" style={{ background: "#0E0E0C" }}>
          <div ref={caveBg} className="absolute inset-0 will-change-[clip-path] photo-grade">
            <img src={photos.cellar} alt="Cave de Gilette" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(14,14,12,0.5) 0%, rgba(14,14,12,0.2) 50%, rgba(14,14,12,0.75) 100%)" }} />
          </div>

          <div ref={caveCard} className="absolute right-[6%] lg:right-[8%] top-1/2 -translate-y-1/2 w-[42%] lg:w-[36%] max-w-[480px] aspect-[3/4] overflow-hidden will-change-[clip-path,transform] photo-grade">
            <img src={photos.julieCave} alt="Julie Medeville en cave" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(14,14,12,0.5) 0%, transparent 45%)" }} />
            <div className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[2px] text-white/85" style={{ fontFamily: "'DM Mono', monospace" }}>JULIE MEDEVILLE</div>
          </div>

          <div ref={caveText} className="absolute left-[6%] lg:left-[10%] top-1/2 -translate-y-1/2 max-w-[460px] z-10" style={{ color: "#F7F5F0" }}>
            <div className="overflow-hidden mb-5">
              <span data-line className="inline-block font-mono text-[11px] tracking-[3px] text-[var(--gold)]" style={{ fontFamily: "'DM Mono', monospace" }}>
                CHAPITRE II — LE GESTE
              </span>
            </div>
            <h2 className="font-serif text-[clamp(34px,4.5vw,60px)] font-light leading-[1.05] mb-7 tracking-[-1px]">
              <span data-line className="block">Les bouteilles dorment.</span>
              <span data-line className="block italic" style={{ color: "var(--gold)" }}>Nous veillons.</span>
            </h2>
            <p data-line className="font-sans text-[14px] leading-[1.9] mb-6" style={{ color: "rgba(247,245,240,0.72)" }}>
              Dans le silence des chais, Julie et Xavier prolongent un héritage. Pas d&apos;artifice, pas de hâte — la lumière, la fraîcheur, et le temps font le reste.
            </p>
            <div data-line className="flex flex-wrap gap-x-8 gap-y-3 mb-7" style={{ color: "rgba(247,245,240,0.6)" }}>
              <span className="font-mono text-[10px] tracking-[2px]" style={{ fontFamily: "'DM Mono', monospace" }}>3 CHAIS HISTORIQUES</span>
              <span className="font-mono text-[10px] tracking-[2px]" style={{ fontFamily: "'DM Mono', monospace" }}>500 FÛTS DE CHÊNE</span>
              <span className="font-mono text-[10px] tracking-[2px]" style={{ fontFamily: "'DM Mono', monospace" }}>14°C CONSTANT</span>
            </div>
            <div data-line><button onClick={goToContact} className="btn-fill" data-hover data-cursor="visit" style={{ borderColor: "var(--gold)", color: "#F7F5F0" }}><span>Visiter les chais</span></button></div>
          </div>
        </section>

        {/* ═══════ Au fil des saisons (calendrier) ═══════ */}
        <CalendrierVigneron />

        <ChapterIntro
          number="III"
          title="La Collection"
          hint="Quatre appellations, sept domaines. Chaque cuvée raconte son terroir."
          variant="split"
        />

        {/* ═══════ CHAPITRE III · LA COLLECTION — Editorial gallery (8 vins vedettes) ═══════ */}
        <EditorialGallery wines={featuredWines} />

        {/* ═══════ Wine fill + GLOBAL stats fused ═══════ */}
        <section ref={fillRef} className="py-20 md:py-24 px-8 md:px-16 relative overflow-hidden" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
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
            <div className="flex-1 max-w-[600px]" data-reveal>
              <span className="font-mono text-[11px] tracking-[3px] text-[var(--gold)] block mb-5" style={{ fontFamily: "'DM Mono', monospace" }}>L&apos;EXPÉRIENCE</span>
              <SplitText as="h2" by="word" className="font-serif text-[clamp(32px,4vw,52px)] font-light leading-[1.1] mb-6 tracking-[-0.5px]">
                Un art de la patience.
              </SplitText>
              <p className="font-sans text-[14px] leading-[1.95] mb-8" style={{ color: "var(--ink2)" }}>
                Chez Gonet-Medeville, le temps est un allié. Château Gilette repose vingt ans en cuves béton avant sa mise en bouteille. Les Champagnes vieillissent quatorze ans sur lattes. Chaque cuvée s&apos;élève à son rythme.
              </p>
              <div className="flex items-center gap-7 mb-10 flex-wrap">
                <Stat n="20" l="ans en cuves" />
                <Sep />
                <Stat n="14" l="ans sur lattes" />
                <Sep />
                <Stat n="5k" l="bouteilles / an" />
              </div>
              <div className="h-[1px] w-24 mb-10" style={{ background: "var(--gold)" }} />
              <span className="font-mono text-[10px] tracking-[3px] block mb-5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>LA MAISON EN CHIFFRES</span>
              <div className="flex items-center gap-7 flex-wrap">
                <Stat n="1710" l="fondation" />
                <Sep />
                <Stat n="7" l="domaines" />
                <Sep />
                <Stat n="43" l="hectares" />
                <Sep />
                <Stat n="~17k" l="caisses / an" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }} />
        </section>

        {/* ═══════ Dégustation ritual ═══════ */}
        <Degustation />

        {/* ═══════ QUOTE ═══════ */}
        <section ref={quoteSec} className="min-h-[60vh] flex items-center justify-center relative overflow-hidden">
          <img src={photos.julieXavierCave} alt="" className="absolute inset-0 w-full h-full object-cover photo-grade" style={{ filter: "blur(2px) brightness(0.4)" }} />
          <div ref={quoteBg} className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--ink)", clipPath: "circle(0% at 50% 50%)" }}>
            <div className="max-w-[680px] px-8 text-center" style={{ color: "#F7F5F0" }}>
              <blockquote className="font-serif text-[clamp(22px,3.2vw,40px)] font-light italic leading-[1.55] tracking-[-0.5px]">
                Nous créons des vins vivants, reflets de notre savoir-faire et de notre culture — du choix du plant au dégorgement.
              </blockquote>
              <div className="mt-10 font-mono text-[10px] tracking-[2px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>JULIE &amp; XAVIER GONET-MEDEVILLE</div>
            </div>
          </div>
        </section>

        {/* ═══════ MOOD BOARD ═══════ */}
        <section className="py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3 auto-rows-[160px] md:auto-rows-[200px]">
            <MoodTile mood src={photos.terrasses} label="Terrasses · Champagne" caption="LE TERROIR" className="col-span-2 row-span-2" big />
            <MoodTile mood src={photos.julieXavierCuves} label="Julie & Xavier · cuves" className="col-span-2 row-span-2" big />
            <MoodTile mood src={photos.xavierFuts} label="Fûts · Xavier" className="row-span-2" />
            <MoodTile mood src={photos.cork} label="Bouchons" />
            <MoodTile mood src={photos.coffret} label="Coffret · Champagne" />
            <MoodTile mood src={photos.champagneMoulin} label="Moulin · Champagne" caption="MESNIL-SUR-OGER" className="col-span-2" />
            <MoodTile mood src={photos.monplaisirCaisse} label="Caisse · Monplaisir" />
            <MoodTile mood src={photos.etiquette} label="Étiquette" />
            <MoodTile mood src={photos.vieillesBouteilles} label="Vieux millésimes" />
            <MoodTile mood src={photos.grapes} label="Vendanges" />
          </div>
        </section>

        {/* ═══════ Press / awards ═══════ */}
        <Press />

        <ChapterIntro
          number="IV"
          title="L'Héritage"
          hint="Une lignée. Une promesse. Un futur. Depuis 1710, la patience comme philosophie."
          variant="curtain"
        />

        {/* ═══════ CHAPITRE IV · L'HÉRITAGE — Heritage timeline ═══════ */}
        <section ref={heritageSec} className="py-20 md:py-24 px-8 md:px-16 lg:px-24" style={{ background: "var(--bg)" }}>
          <div className="max-w-[1300px] mx-auto">
            <div className="mb-14" data-reveal>
              <span className="font-mono text-[11px] tracking-[3px] block mb-3" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
                CHAPITRE IV — L&apos;HÉRITAGE
              </span>
              <h2 className="font-serif font-light tracking-[-1px]" style={{ fontSize: "clamp(34px, 4.5vw, 60px)" }}>
                Une lignée, <span className="italic" style={{ color: "var(--gold)" }}>une promesse</span>.
              </h2>
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

              <div className="md:col-span-7 space-y-16 md:space-y-20">
                {heritage.map((item, i) => (
                  <div key={i} data-heritage-row className="flex items-start gap-6 md:gap-12">
                    <span data-h-year className="font-serif text-[clamp(48px,7vw,110px)] font-light leading-none flex-shrink-0 tracking-[-2px] will-change-transform" style={{ color: "rgba(158,130,90,0.32)" }}>{item.year}</span>
                    <p data-h-text className="font-sans text-[14px] leading-[1.95] max-w-[480px] pt-2 md:pt-4 will-change-transform" style={{ color: "var(--ink2)" }}>{item.text}</p>
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
        <section id="terroirs" className="relative py-20 md:py-24 px-8 md:px-16 lg:px-24" style={{ background: "var(--ink)", color: "#F7F5F0" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row gap-14 md:gap-24">
            <div className="flex-1" data-reveal>
              <span className="font-mono text-[11px] tracking-[3px] text-[var(--gold)] block mb-6" style={{ fontFamily: "'DM Mono', monospace" }}>NOS TERROIRS</span>
              <SplitText as="h2" by="word" className="font-serif text-[clamp(32px,4vw,56px)] font-light leading-[1.1] mb-8 tracking-[-1px]">
                Quatre appellations, un même geste.
              </SplitText>
              <p className="font-sans text-[14px] leading-[1.95] max-w-[400px]" style={{ color: "rgba(247,245,240,0.55)" }}>
                Chaque domaine est le fruit d&apos;un terroir singulier, façonné par la géologie et le savoir-faire humain. La complémentarité des terroirs — du calcaire champenois aux graves bordelaises — fait la singularité de la maison.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-10 gap-y-12">
              {[
                { name: "Champagne", detail: "Craie · Grands & 1ers Crus", line: "La pureté minérale du Mesnil-sur-Oger.", ha: "12 ha" },
                { name: "Sauternes", detail: "Sable, calcaire, argile", line: "Le berceau historique de la maison.", ha: "13 ha" },
                { name: "Margaux", detail: "Graves profondes", line: "L'élégance discrète d'un micro-domaine.", ha: "2,9 ha" },
                { name: "Graves", detail: "Graves, argile, sable", line: "Des blancs ciselés, des rouges au grain fin.", ha: "15 ha" },
              ].map(t => (
                <div key={t.name} data-reveal className="group">
                  <div className="font-serif text-[22px] font-light mb-2 group-hover:text-[var(--gold)] transition-colors duration-500">{t.name}</div>
                  <div className="font-sans text-[11px] mb-2" style={{ color: "rgba(247,245,240,0.45)" }}>{t.detail}</div>
                  <p className="font-serif italic text-[13px] leading-[1.55] mb-3" style={{ color: "rgba(247,245,240,0.7)" }}>{t.line}</p>
                  <div className="font-mono text-[11px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>{t.ha}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ CONTACT / CTA — full-bleed vineyard ═══════ */}
        <section id="contact" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <img src={photos.julieXavierPortrait} alt="" className="absolute inset-0 w-full h-full object-cover photo-grade" data-speed="-0.08" style={{ filter: "brightness(0.45)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,14,12,0.4) 0%, rgba(14,14,12,0.2) 50%, rgba(14,14,12,0.55) 100%)" }} />
          <div className="relative z-10 text-center max-w-[640px] px-8" style={{ color: "#F7F5F0" }}>
            <span className="font-mono text-[11px] tracking-[5px] mb-5 block" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>NOUS RENDRE VISITE</span>
            <SplitText as="h2" by="word" className="font-serif font-light leading-[1.05] tracking-[-1px] mb-6" style={{ fontSize: "clamp(34px, 4.6vw, 64px)" }}>
              4 Rue du Port, Preignac.
            </SplitText>
            <p className="font-serif italic font-light mb-8" style={{ fontSize: "clamp(15px, 1.2vw, 18px)", color: "rgba(247,245,240,0.85)" }}>
              33210 Gironde · sur rendez-vous.
            </p>
            <div className="font-mono text-[11px] tracking-[2px] mb-10" style={{ color: "rgba(247,245,240,0.7)", fontFamily: "'DM Mono', monospace" }}>
              +33 5 56 76 28 44 · CONTACT@GONET-MEDEVILLE.COM
            </div>
            <a
              href="https://www.gonet-medeville.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fill inline-block"
              data-hover
              data-cursor="open"
              style={{ borderColor: "var(--gold)", color: "#F7F5F0" }}
            >
              <span>Visiter le site officiel</span>
            </a>
          </div>
        </section>

        <footer className="py-12 px-8 md:px-16 lg:px-24" style={{ background: "var(--warm)" }}>
          <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row justify-between gap-10 mb-12">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Gonet-Medeville" width={56} height={56} className="w-14 h-14" />
              <div>
                <div className="font-serif text-[22px] font-light">Gonet-Medeville</div>
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
            <span className="font-mono text-[9px]" style={{ color: "var(--ink2)", fontFamily: "'DM Mono', monospace" }}>© 2026 Gonet-Medeville</span>
          </div>
        </footer>
      </main>
    </>
  );
}

function goToContact(e: React.MouseEvent) {
  e.preventDefault();
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center">
      <div data-counter={n} className="font-serif text-[40px] font-light tracking-[-1px]" style={{ color: "var(--ink)" }}>0</div>
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
      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        <span className={`font-serif italic text-white leading-tight ${big ? "text-[18px]" : "text-[14px]"}`}>{label}</span>
        {caption && <span className="font-mono text-[9px] tracking-[2px] text-white/70" style={{ fontFamily: "'DM Mono', monospace" }}>{caption}</span>}
      </div>
    </div>
  );
}
