"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { wines } from "@/lib/wines";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    const r = () => setVh(window.innerHeight);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);

  useEffect(() => {
    const s = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  const onDone = useCallback(() => setReady(true), []);
  const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const prog = (s: number, e: number) => clamp((scrollY - s) / (e - s));

  // === SECTION OFFSETS ===
  const bottleStart = vh * 0.9;
  const bottleEnd = vh * 3.8;
  const quoteStart = vh * 4.2;
  const quoteEnd = vh * 5.2;
  const galleryStart = vh * 6;
  const galleryH = vh * (wines.length + 0.5);
  
  // === BOTTLE HERO ANIMATION ===
  const bp = prog(bottleStart, bottleEnd);
  // Phase 1 (0-0.3): bottle appears and grows
  // Phase 2 (0.3-0.6): text appears, bottle shifts left
  // Phase 3 (0.6-1): zoom on label
  const bottleScale = bp < 0.3 
    ? 0.6 + (bp / 0.3) * 0.4 
    : bp < 0.6 
    ? 1.0 
    : 1.0 + ((bp - 0.6) / 0.4) * 0.8;
  const bottleX = bp < 0.3 ? 0 : bp < 0.6 ? -((bp - 0.3) / 0.3) * 20 : -20;
  const bottleRotate = bp < 0.3 ? -5 + (bp / 0.3) * 5 : 0;
  const bottleOpacity = bp < 0.05 ? bp / 0.05 : bp > 0.9 ? 1 - (bp - 0.9) / 0.1 : 1;
  const textOp = clamp((bp - 0.25) / 0.2);
  const labelZoomOp = clamp((bp - 0.55) / 0.2);
  const bottleY = bp > 0.6 ? -((bp - 0.6) / 0.4) * 15 : 0; // shift up to focus label

  // === QUOTE ===
  const qp = prog(quoteStart, quoteEnd);

  // === GALLERY ===  
  const gp = prog(galleryStart, galleryStart + galleryH);
  const gx = gp * (wines.length - 1) * 100;
  const activeIdx = Math.min(wines.length - 1, Math.floor(gp * wines.length));

  return (
    <>
      <CustomCursor />
      {!ready && <Preloader onComplete={onDone} />}
      <main style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
        <Nav />
        <Hero ready={ready} />

        {/* ═══════════ BOTTLE SHOWCASE ═══════════ */}
        <section style={{ height: `${bottleEnd - bottleStart + vh}px`, position: "relative" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            {/* Radial glow */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `radial-gradient(ellipse at ${50 + bottleX}% 50%, rgba(212,160,23,${textOp * 0.06}) 0%, transparent 60%)`
            }} />

            {/* THE REAL BOTTLE */}
            <div style={{
              transform: `scale(${bottleScale}) translateX(${bottleX}%) translateY(${bottleY}%) rotate(${bottleRotate}deg)`,
              opacity: bottleOpacity,
              transition: "none",
              willChange: "transform, opacity",
              filter: `drop-shadow(0 ${20 + bp * 30}px ${30 + bp * 40}px rgba(0,0,0,${0.15 + bp * 0.1}))`,
            }}>
              <Image
                src={wines[0].image}
                alt={wines[0].name}
                width={280}
                height={700}
                priority
                className="object-contain select-none pointer-events-none"
                style={{ maxHeight: "70vh" }}
              />
            </div>

            {/* Left text */}
            <div className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-[380px]" style={{ opacity: textOp, transform: `translateY(${(1 - textOp) * 30}px)` }}>
              <div className="font-sans text-[10px] tracking-[5px] uppercase mb-4" style={{ color: "var(--gold)" }}>
                Le joyau de la maison
              </div>
              <h2 className="font-serif text-[clamp(36px,4vw,56px)] font-light leading-tight">
                Château<br /><em className="text-gold">Gilette</em>
              </h2>
              <div className="w-10 h-[1px] my-6 bg-gold opacity-50" />
              <p className="font-sans text-[13px] leading-[1.9] font-light" style={{ color: "var(--ink2)" }}>
                {wines[0].description}
              </p>
              <div className="mt-6 font-sans text-[11px] leading-relaxed" style={{ color: "var(--ink2)", opacity: 0.6 }}>
                {wines[0].blend}
              </div>
            </div>

            {/* Right year */}
            <div className="absolute right-[8%] top-1/2 -translate-y-1/2 text-right" style={{ opacity: labelZoomOp }}>
              <div className="font-serif text-[80px] font-light leading-none" style={{ color: "rgba(181,147,90,0.1)" }}>1710</div>
              <div className="font-sans text-[10px] tracking-[3px] mt-2" style={{ color: "var(--ink2)" }}>PREIGNAC · SAUTERNES</div>
            </div>

            {/* Progress bar */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 h-[120px] w-[2px] rounded-full" style={{ background: "rgba(181,147,90,0.1)" }}>
              <div className="w-full rounded-full bg-gold" style={{ height: `${bp * 100}%` }} />
            </div>
          </div>
        </section>

        {/* ═══════════ QUOTE REVEAL ═══════════ */}
        <section style={{ height: "120vh", position: "relative" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center" style={{
            background: "var(--ink)", color: "#FAF9F6",
            clipPath: `circle(${clamp(qp) * 75 + 1}% at 50% 50%)`
          }}>
            <div className="text-center max-w-[700px] px-10">
              <div className="font-sans text-[10px] tracking-[6px] text-gold mb-7">PHILOSOPHIE</div>
              <blockquote className="font-serif text-[clamp(22px,3.5vw,40px)] font-light italic leading-relaxed" style={{ opacity: clamp(qp * 1.5 - 0.3) }}>
                <span className="text-gold">&ldquo;</span>
                Être artisan du Champagne, c&apos;est notre implication totale à chaque étape — du choix du plant au dégorgement, nous créons des vins vivants.
                <span className="text-gold">&rdquo;</span>
              </blockquote>
              <div className="font-sans text-[10px] tracking-[4px] mt-8" style={{ color: "var(--gold-light)", opacity: clamp(qp * 2 - 0.8) }}>
                JULIE &amp; XAVIER GONET-MÉDEVILLE
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ MARQUEE ═══════════ */}
        <div className="py-14 overflow-hidden border-y border-black/5">
          <div className="flex gap-16 whitespace-nowrap animate-marquee" style={{ width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-16 items-center">
              {["Sauternes","◆","Champagne","◆","Margaux","◆","Graves","◆","Bordeaux Supérieur","◆"].map((t,i) =>
                <span key={i} className={t==="◆"?"text-[10px] text-gold":"font-serif text-[clamp(28px,4vw,52px)] font-light italic"}>{t}</span>
              )}
            </div>)}
          </div>
        </div>

        {/* ═══════════ COLLECTION HEADER ═══════════ */}
        <div className="text-center py-28 px-10">
          <div className="font-sans text-[10px] tracking-[6px] text-gold mb-5">COLLECTION</div>
          <h2 className="font-serif text-[clamp(40px,6vw,72px)] font-light">Nos <em>Vins</em></h2>
        </div>

        {/* ═══════════ HORIZONTAL WINE GALLERY ═══════════ */}
        <section>
          <div style={{ height: galleryH }}>
            <div className="sticky top-0 h-screen overflow-hidden">
              {/* Dots */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
                {wines.map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full border-[1.5px] transition-all duration-500" style={{
                    borderColor: i === activeIdx ? "var(--gold)" : "var(--gold-light)",
                    background: i === activeIdx ? "var(--gold)" : "transparent",
                    transform: i === activeIdx ? "scale(1.5)" : "scale(1)",
                  }} />
                ))}
              </div>

              {/* Track */}
              <div className="flex h-full items-center" style={{
                transform: `translateX(-${gx}vw)`,
                width: `${wines.length * 100}vw`,
                willChange: "transform",
              }}>
                {wines.map((wine, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <div key={wine.id} className="w-screen h-screen flex items-center justify-center px-[clamp(40px,8vw,120px)] relative">
                      {/* Glow */}
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: `radial-gradient(ellipse at ${idx % 2 === 0 ? "35%" : "65%"} 50%, ${wine.accent}0a 0%, transparent 50%)`
                      }} />

                      <div className="flex items-center gap-[clamp(40px,5vw,100px)] max-w-[1100px] w-full relative z-10" style={{
                        flexDirection: idx % 2 === 0 ? "row" : "row-reverse"
                      }}>
                        {/* REAL BOTTLE PHOTO */}
                        <div className="flex-shrink-0 relative" style={{
                          transform: isActive ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                          opacity: isActive ? 1 : 0.5,
                          transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
                          filter: `drop-shadow(0 30px 50px rgba(0,0,0,0.15))`,
                        }}>
                          <Image
                            src={wine.image}
                            alt={wine.name}
                            width={220}
                            height={550}
                            className="object-contain select-none"
                            style={{ maxHeight: "65vh" }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 max-w-[480px]" style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive ? "translateX(0)" : `translateX(${idx % 2 === 0 ? "40px" : "-40px"})`,
                          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
                        }}>
                          <div className="font-sans text-[10px] tracking-[5px] font-semibold mb-3" style={{ color: wine.accent }}>{wine.appellation}</div>
                          <h3 className="font-serif text-[clamp(32px,4vw,58px)] font-light leading-tight mb-1">
                            <span className="block text-[0.5em] font-normal mb-1" style={{ color: "var(--ink2)" }}>{wine.prefix}</span>
                            {wine.name}
                          </h3>
                          <div className="font-serif text-[15px] italic mb-7" style={{ color: "var(--ink2)" }}>{wine.subtitle} — {wine.year}</div>
                          <div className="w-10 h-[1px] mb-7" style={{ background: wine.accent, opacity: 0.4 }} />
                          <p className="font-sans text-[13px] leading-[1.9] font-light mb-8" style={{ color: "var(--ink2)" }}>{wine.description}</p>
                          <div className="flex gap-10">
                            <div>
                              <div className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">ASSEMBLAGE</div>
                              <div className="font-sans text-xs leading-relaxed" style={{ color: "var(--ink2)" }}>{wine.blend}</div>
                            </div>
                            <div>
                              <div className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">SUPERFICIE</div>
                              <div className="font-sans text-xs" style={{ color: "var(--ink2)" }}>{wine.surface}</div>
                            </div>
                          </div>
                          <button className="mt-10 px-11 py-4 border font-sans text-[10px] tracking-[4px] uppercase relative overflow-hidden group" style={{ borderColor: wine.accent, color: wine.accent }} data-hover>
                            <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ background: wine.accent }} />
                            <span className="relative z-10 group-hover:text-white transition-colors duration-500">Découvrir</span>
                          </button>
                        </div>
                      </div>

                      {/* Year watermark */}
                      <div className="absolute bottom-[8%] font-serif text-[clamp(70px,14vw,180px)] font-light leading-none pointer-events-none select-none" style={{
                        [idx % 2 === 0 ? "right" : "left"]: "5%",
                        color: "rgba(0,0,0,0.025)"
                      }}>{wine.year}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section className="py-28 px-10 border-y border-black/5">
          <div className="max-w-[1100px] mx-auto flex justify-between flex-wrap gap-12">
            {[{end:1710,label:"Année de fondation"},{end:7,label:"Domaines"},{end:43,label:"Hectares"},{end:314,label:"Ans d'héritage"}].map((s,i)=>
              <Counter key={i} stat={s} i={i} />
            )}
          </div>
        </section>

        {/* ═══════════ TERROIRS ═══════════ */}
        <section className="relative overflow-hidden py-36 px-10" style={{ background:"var(--ink)", color:"#FAF9F6" }}>
          <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 20% 30%, rgba(181,147,90,0.06) 0%, transparent 50%)" }} />
          <div className="max-w-[1100px] mx-auto relative z-10 flex gap-20 flex-wrap">
            <div className="flex-1 min-w-[350px]">
              <div className="font-sans text-[10px] tracking-[6px] text-gold mb-6">DE LA CHAMPAGNE AU BORDELAIS</div>
              <h2 className="font-serif text-[clamp(32px,4.5vw,56px)] font-light leading-tight mb-8">Sept domaines, <em className="text-gold">un héritage</em></h2>
              <p className="font-sans text-sm leading-relaxed max-w-[440px]" style={{ color:"rgba(250,249,246,0.5)" }}>De la craie du Mesnil-sur-Oger aux graves profondes de Margaux — chaque terroir imprime son identité unique.</p>
            </div>
            <div className="flex-1 min-w-[280px] grid grid-cols-2 gap-8">
              {[{r:"Champagne",d:"3 Grands Crus · 5 Premiers Crus",h:"12 ha"},{r:"Sauternes",d:"Gilette · Les Justices",h:"13 ha"},{r:"Margaux",d:"Château des Eyrins",h:"2,9 ha"},{r:"Graves",d:"Respide-Médeville",h:"15 ha"}].map(t=>
                <Reveal key={t.r}><div className="border-l border-gold/25 pl-5"><div className="font-serif text-[26px] font-light mb-2">{t.r}</div><div className="font-sans text-[11px] leading-relaxed" style={{color:"rgba(250,249,246,0.4)"}}>{t.d}</div><div className="font-sans text-[11px] text-gold mt-2 tracking-[2px]">{t.h}</div></div></Reveal>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="py-20 px-10 border-t border-gold/10" style={{ background:"#F0ECE4" }}>
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
      `}</style>
    </>
  );
}

function Counter({stat,i}:{stat:{end:number;label:string};i:number}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:0.3});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
  useEffect(()=>{if(!vis)return;const d=2000,s=performance.now();const a=(n:number)=>{const p=Math.min((n-s)/d,1);setCount(Math.floor((1-Math.pow(1-p,3))*stat.end));if(p<1)requestAnimationFrame(a)};requestAnimationFrame(a)},[vis,stat.end]);
  return <div ref={ref} className="text-center flex-1 min-w-[180px]" style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",transition:`all .7s cubic-bezier(.16,1,.3,1) ${i*100}ms`}}><div className="font-serif text-[clamp(44px,6vw,68px)] font-light leading-none">{count}</div><div className="font-sans text-[10px] tracking-[3px] text-gold mt-3 uppercase">{stat.label}</div></div>;
}

function Reveal({children}:{children:React.ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.2});if(ref.current)o.observe(ref.current);return()=>o.disconnect()},[]);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all .7s cubic-bezier(.16,1,.3,1)"}}>{children}</div>;
}
