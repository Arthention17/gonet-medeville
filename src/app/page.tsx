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

  const heroRef = useRef<HTMLDivElement>(null);
  const bottleSectionRef = useRef<HTMLDivElement>(null);
  const bottleImgRef = useRef<HTMLDivElement>(null);
  const bottleTextRef = useRef<HTMLDivElement>(null);
  const bottleYearRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const quoteBgRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);

  // === GSAP ANIMATIONS ===
  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {

      // --- HERO BOTTLE: pin + scale + shift ---
      const bottleTl = gsap.timeline({
        scrollTrigger: {
          trigger: bottleSectionRef.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
        },
      });

      bottleTl
        // Phase 1: bottle grows
        .fromTo(bottleImgRef.current,
          { scale: 0.7, y: 30, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 1 }
        )
        // Phase 2: bottle shifts left, text appears
        .to(bottleImgRef.current, { x: "-30vw", scale: 0.9, duration: 1.5 }, "+=0.2")
        .fromTo(bottleTextRef.current,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 1 },
          "<0.3"
        )
        .fromTo(bottleYearRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "<0.5"
        )
        // Phase 3: zoom into label
        .to(bottleImgRef.current, { scale: 1.8, y: "-15%", duration: 1.5 }, "+=0.3")
        // Phase 4: fade out
        .to(bottleImgRef.current, { opacity: 0, duration: 0.8 }, "+=0.2")
        .to(bottleTextRef.current, { opacity: 0, duration: 0.5 }, "<")
        .to(bottleYearRef.current, { opacity: 0, duration: 0.5 }, "<");

      // --- QUOTE: clip-path reveal ---
      gsap.fromTo(quoteBgRef.current,
        { clipPath: "circle(0% at 50% 50%)" },
        {
          clipPath: "circle(80% at 50% 50%)",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
        }
      );

      // --- HORIZONTAL GALLERY: pin + horizontal scroll ---
      if (galleryTrackRef.current && galleryRef.current) {
        const totalWidth = galleryTrackRef.current.scrollWidth - window.innerWidth;

        gsap.to(galleryTrackRef.current, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Animate each wine card on enter
        wines.forEach((_, i) => {
          const card = document.querySelector(`[data-wine="${i}"]`);
          if (!card) return;
          const img = card.querySelector("[data-bottle-img]");
          const info = card.querySelector("[data-bottle-info]");

          gsap.fromTo(img,
            { y: 60, opacity: 0, scale: 0.85 },
            { y: 0, opacity: 1, scale: 1, duration: 1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: gsap.getById?.("galleryScroll") || undefined,
                start: "left 80%",
                end: "left 30%",
                scrub: 1,
              },
            }
          );
        });
      }

      // --- STAT COUNTERS ---
      document.querySelectorAll("[data-counter]").forEach((el) => {
        const target = parseInt(el.getAttribute("data-counter") || "0");
        gsap.from(el, {
          textContent: 0,
          duration: 2,
          snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });

      // --- REVEAL ELEMENTS ---
      document.querySelectorAll("[data-reveal]").forEach((el, i) => {
        gsap.fromTo(el,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: i * 0.05,
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [ready]);

  // === HERO LETTER ANIMATION ===
  const letters1 = "Gonet".split("");
  const letters2 = "Médeville".split("");

  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      {!ready && <Preloader onComplete={onDone} />}

      <main style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 0.2s" }}>
        <Nav />

        {/* ═══════════ HERO ═══════════ */}
        <section ref={heroRef} className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
          {/* Background vineyard atmosphere */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, #e8e4db 0%, #FAF9F6 40%, #FAF9F6 100%)"
          }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B5935A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }} />

          <div className="text-center relative z-10">
            <div className="font-sans text-[10px] tracking-[8px] font-medium mb-10 uppercase" style={{
              color: "var(--gold)",
              opacity: ready ? 1 : 0,
              transform: ready ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
            }}>
              Grands Vins de Bordeaux & Champagne
            </div>

            <h1 className="font-serif font-light leading-[0.88]">
              <span className="block text-[clamp(68px,12vw,160px)] tracking-tighter">
                {letters1.map((ch, i) => (
                  <span key={i} className="inline-block" style={{
                    opacity: ready ? 1 : 0,
                    transform: ready ? "translateY(0) rotate(0)" : "translateY(100%) rotate(10deg)",
                    transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${0.5 + i * 0.06}s`,
                    transformOrigin: "bottom left",
                  }}>{ch}</span>
                ))}
              </span>
              <span className="block text-[clamp(48px,8vw,120px)] tracking-tight italic -mt-2 text-gold">
                {letters2.map((ch, i) => (
                  <span key={i} className="inline-block" style={{
                    opacity: ready ? 1 : 0,
                    transform: ready ? "translateY(0) rotate(0)" : "translateY(100%) rotate(10deg)",
                    transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${0.8 + i * 0.05}s`,
                    transformOrigin: "bottom left",
                  }}>{ch === " " ? "\u00A0" : ch}</span>
                ))}
              </span>
            </h1>

            <div className="w-16 h-[1px] mx-auto my-10 bg-gold" style={{
              transform: ready ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1) 1.5s",
            }} />

            <p className="font-serif text-[clamp(15px,1.8vw,20px)] font-light italic leading-relaxed" style={{
              color: "var(--ink2)",
              opacity: ready ? 1 : 0,
              transition: "opacity 1s ease 1.8s",
            }}>
              Trois siècles de passion, de la craie champenoise<br />aux graves bordelaises
            </p>

            <div className="mt-12" style={{
              opacity: ready ? 1 : 0,
              transition: "opacity 1s ease 2.2s",
            }}>
              <span className="font-sans text-[9px] tracking-[5px] uppercase" style={{ color: "var(--ink2)" }}>Depuis</span>
              <span className="font-serif text-[28px] font-light ml-3 text-gold">1710</span>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 flex flex-col items-center gap-2" style={{
            opacity: ready ? 1 : 0, transition: "opacity 1s ease 2.5s",
          }}>
            <span className="font-sans text-[9px] tracking-[4px]" style={{ color: "var(--ink2)" }}>SCROLL</span>
            <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: "rgba(181,147,90,0.2)" }}>
              <div className="w-full bg-gold animate-pulse" style={{ height: "50%", animation: "scrollLine 2s ease-in-out infinite" }} />
            </div>
          </div>
        </section>

        {/* ═══════════ BOTTLE SHOWCASE (PINNED) ═══════════ */}
        <section ref={bottleSectionRef} className="h-screen flex items-center justify-center relative overflow-hidden">
          {/* Bottle image */}
          <div ref={bottleImgRef} className="absolute z-10" style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.18))" }}>
            <Image src={wines[0].image} alt={wines[0].name} width={260} height={650} priority className="object-contain select-none" style={{ maxHeight: "75vh" }} />
          </div>

          {/* Text panel (right side) */}
          <div ref={bottleTextRef} className="absolute right-[10%] top-1/2 -translate-y-1/2 max-w-[400px] opacity-0">
            <div className="font-sans text-[10px] tracking-[5px] uppercase mb-4 text-gold">Le joyau de la maison</div>
            <h2 className="font-serif text-[clamp(36px,4vw,52px)] font-light leading-tight mb-2">
              Château <em className="text-gold">Gilette</em>
            </h2>
            <div className="font-serif text-sm italic mb-6" style={{ color: "var(--ink2)" }}>{wines[0].subtitle} — {wines[0].year}</div>
            <div className="w-10 h-[1px] bg-gold/40 mb-6" />
            <p className="font-sans text-[13px] leading-[1.9] font-light" style={{ color: "var(--ink2)" }}>{wines[0].description}</p>
            <div className="mt-6 font-sans text-[11px]" style={{ color: "var(--ink2)", opacity: 0.5 }}>{wines[0].blend}</div>
          </div>

          {/* Year watermark */}
          <div ref={bottleYearRef} className="absolute left-[8%] top-1/2 -translate-y-1/2 opacity-0">
            <div className="font-serif text-[90px] font-light leading-none" style={{ color: "rgba(181,147,90,0.08)" }}>1710</div>
            <div className="font-sans text-[10px] tracking-[3px] mt-2" style={{ color: "var(--ink2)" }}>PREIGNAC · SAUTERNES</div>
          </div>
        </section>

        {/* ═══════════ QUOTE ═══════════ */}
        <section ref={quoteRef} className="min-h-screen flex items-center justify-center relative py-32">
          <div ref={quoteBgRef} className="absolute inset-0 flex items-center justify-center" style={{
            background: "var(--ink)", clipPath: "circle(0% at 50% 50%)"
          }}>
            <div className="text-center max-w-[650px] px-10" style={{ color: "#FAF9F6" }}>
              <div className="font-sans text-[10px] tracking-[6px] text-gold mb-8">PHILOSOPHIE</div>
              <blockquote className="font-serif text-[clamp(20px,3vw,36px)] font-light italic leading-relaxed">
                <span className="text-gold">&ldquo;</span>
                Être artisan du Champagne, c&apos;est notre implication totale à chaque étape — du choix du plant au dégorgement, nous créons des vins vivants.
                <span className="text-gold">&rdquo;</span>
              </blockquote>
              <div className="font-sans text-[10px] tracking-[4px] text-gold-light mt-8">
                JULIE &amp; XAVIER GONET-MÉDEVILLE
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ MARQUEE ═══════════ */}
        <div className="py-14 overflow-hidden border-y border-black/[0.04]">
          <div className="flex gap-16 whitespace-nowrap animate-marquee" style={{ width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-16 items-center">
              {["Sauternes","◆","Champagne","◆","Margaux","◆","Graves","◆","Bordeaux Supérieur","◆"].map((t,i) =>
                <span key={i} className={t==="◆" ? "text-[8px] text-gold" : "font-serif text-[clamp(28px,4vw,50px)] font-light italic"}>{t}</span>
              )}
            </div>)}
          </div>
        </div>

        {/* ═══════════ COLLECTION HEADER ═══════════ */}
        <div className="text-center py-28 px-10">
          <div className="font-sans text-[10px] tracking-[6px] text-gold mb-5" data-reveal>COLLECTION</div>
          <h2 className="font-serif text-[clamp(40px,6vw,72px)] font-light" data-reveal>Nos <em>Vins</em></h2>
        </div>

        {/* ═══════════ HORIZONTAL GALLERY (PINNED) ═══════════ */}
        <section ref={galleryRef} className="relative overflow-hidden">
          <div ref={galleryTrackRef} className="flex h-screen items-center" style={{ width: `${wines.length * 100}vw` }}>
            {wines.map((wine, idx) => (
              <div key={wine.id} data-wine={idx} className="w-screen h-screen flex items-center justify-center flex-shrink-0 px-[clamp(40px,7vw,100px)] relative">
                {/* Glow */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: `radial-gradient(ellipse at ${idx%2===0?"35%":"65%"} 50%, ${wine.accent}0c 0%, transparent 50%)`
                }} />

                <div className="flex items-center gap-[clamp(40px,5vw,100px)] max-w-[1100px] w-full relative z-10" style={{
                  flexDirection: idx%2===0 ? "row" : "row-reverse"
                }}>
                  {/* BOTTLE */}
                  <div data-bottle-img className="flex-shrink-0" style={{
                    filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.15))"
                  }}>
                    <Image src={wine.image} alt={wine.name} width={220} height={550} className="object-contain select-none" style={{ maxHeight: "65vh" }} />
                  </div>

                  {/* INFO */}
                  <div data-bottle-info className="flex-1 max-w-[480px]">
                    <div className="font-sans text-[10px] tracking-[5px] font-semibold mb-3" style={{ color: wine.accent }}>{wine.appellation}</div>
                    <h3 className="font-serif text-[clamp(32px,4vw,56px)] font-light leading-tight mb-1">
                      <span className="block text-[0.5em] font-normal mb-1" style={{color:"var(--ink2)"}}>{wine.prefix}</span>
                      {wine.name}
                    </h3>
                    <div className="font-serif text-[14px] italic mb-7" style={{color:"var(--ink2)"}}>{wine.subtitle} — {wine.year}</div>
                    <div className="w-10 h-[1px] mb-7" style={{ background: wine.accent, opacity: 0.35 }} />
                    <p className="font-sans text-[13px] leading-[1.9] font-light mb-8" style={{color:"var(--ink2)"}}>{wine.description}</p>
                    <div className="flex gap-10">
                      <div><div className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">ASSEMBLAGE</div><div className="font-sans text-xs leading-relaxed" style={{color:"var(--ink2)"}}>{wine.blend}</div></div>
                      <div><div className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">SUPERFICIE</div><div className="font-sans text-xs" style={{color:"var(--ink2)"}}>{wine.surface}</div></div>
                    </div>
                    <button className="mt-10 px-11 py-4 border font-sans text-[10px] tracking-[4px] uppercase relative overflow-hidden group" style={{borderColor:wine.accent,color:wine.accent}} data-hover>
                      <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{background:wine.accent}} />
                      <span className="relative z-10 group-hover:text-white transition-colors duration-500">Découvrir</span>
                    </button>
                  </div>
                </div>

                {/* Year watermark */}
                <div className="absolute bottom-[8%] font-serif text-[clamp(70px,14vw,180px)] font-light leading-none pointer-events-none select-none" style={{
                  [idx%2===0?"right":"left"]:"5%", color:"rgba(0,0,0,0.02)"
                }}>{wine.year}</div>
              </div>
            ))}
          </div>

          {/* Gallery dots */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {wines.map((_,i) => <div key={i} className="w-2 h-2 rounded-full border-[1.5px] border-gold/30" />)}
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section className="py-32 px-10 border-y border-black/[0.04]">
          <div className="max-w-[1000px] mx-auto flex justify-between flex-wrap gap-12">
            {[{n:1710,l:"Année de fondation"},{n:7,l:"Domaines"},{n:43,l:"Hectares"},{n:314,l:"Ans d'héritage"}].map((s,i)=>(
              <div key={i} className="text-center flex-1 min-w-[180px]" data-reveal>
                <div className="font-serif text-[clamp(44px,6vw,68px)] font-light leading-none" data-counter={s.n}>{s.n}</div>
                <div className="font-sans text-[10px] tracking-[3px] text-gold mt-3 uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ TERROIRS ═══════════ */}
        <section className="relative overflow-hidden py-36 px-10" style={{background:"var(--ink)",color:"#FAF9F6"}}>
          <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 20% 30%, rgba(181,147,90,0.06) 0%, transparent 50%)"}} />
          <div className="max-w-[1100px] mx-auto relative z-10 flex gap-20 flex-wrap">
            <div className="flex-1 min-w-[350px]" data-reveal>
              <div className="font-sans text-[10px] tracking-[6px] text-gold mb-6">DE LA CHAMPAGNE AU BORDELAIS</div>
              <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-light leading-tight mb-8">Sept domaines, <em className="text-gold">un héritage</em></h2>
              <p className="font-sans text-sm leading-relaxed max-w-[440px]" style={{color:"rgba(250,249,246,0.5)"}}>De la craie du Mesnil-sur-Oger aux graves profondes de Margaux — chaque terroir imprime son identité unique.</p>
            </div>
            <div className="flex-1 min-w-[280px] grid grid-cols-2 gap-8">
              {[{r:"Champagne",d:"3 Grands Crus · 5 1ers Crus",h:"12 ha"},{r:"Sauternes",d:"Gilette · Les Justices",h:"13 ha"},{r:"Margaux",d:"Château des Eyrins",h:"2,9 ha"},{r:"Graves",d:"Respide-Médeville",h:"15 ha"}].map(t=>
                <div key={t.r} className="border-l border-gold/25 pl-5" data-reveal>
                  <div className="font-serif text-[26px] font-light mb-2">{t.r}</div>
                  <div className="font-sans text-[11px] leading-relaxed" style={{color:"rgba(250,249,246,0.4)"}}>{t.d}</div>
                  <div className="font-sans text-[11px] text-gold mt-2 tracking-[2px]">{t.h}</div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="py-20 px-10 border-t border-gold/10" style={{background:"#F0ECE4"}}>
          <div className="max-w-[1100px] mx-auto flex justify-between flex-wrap gap-12">
            <div><div className="font-serif text-[28px] font-light tracking-[2px] mb-4">Gonet <span className="text-gold">·</span> Médeville</div><div className="font-sans text-xs leading-loose" style={{color:"var(--ink2)"}}>Producteurs de Grands Vins<br/>de Bordeaux &amp; de Champagne</div></div>
            <div><div className="font-sans text-[9px] tracking-[4px] text-gold mb-3">ADRESSE</div><div className="font-sans text-xs leading-loose" style={{color:"var(--ink2)"}}>4 Rue du Port, 33210 Preignac<br/>+33 5 56 76 28 44</div></div>
            <div><div className="font-sans text-[9px] tracking-[4px] text-gold mb-3">CONTACT</div><div className="font-sans text-xs leading-loose" style={{color:"var(--ink2)"}}>contact@gonet-medeville.com</div></div>
          </div>
          <div className="text-center mt-16 font-sans text-[9px] tracking-[2px]" style={{color:"var(--ink2)"}}>L&apos;ABUS D&apos;ALCOOL EST DANGEREUX POUR LA SANTÉ<br/>© VIGNOBLES GONET-MÉDEVILLE — DEPUIS 1710</div>
        </footer>
      </main>

      <style jsx global>{`
        @keyframes marqueeScroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .animate-marquee { animation: marqueeScroll 25s linear infinite; }
        @keyframes scrollLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }
      `}</style>
    </>
  );
}
