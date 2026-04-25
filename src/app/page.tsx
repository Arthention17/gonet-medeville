"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { wines } from "@/lib/wines";

const BottleScene = dynamic(() => import("@/components/BottleScene"), { ssr: false });

export default function Home() {
  const [ready, setReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onPreloaderComplete = useCallback(() => setReady(true), []);
  const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const prog = (start: number, end: number) => clamp((scrollY - start) / (end - start));

  const bottleStart = vh * 1;
  const bottleEnd = vh * 4;
  const quoteStart = vh * 4.5;
  const quoteEnd = vh * 5.5;
  const galleryStart = vh * 6.5;
  const galleryH = vh * (wines.length + 0.5);

  const bottleProg = prog(bottleStart, bottleEnd);
  const bottleScale = 0.4 + bottleProg * 1.2;
  const bottleOpacity = bottleProg > 0.85 ? 1 - (bottleProg - 0.85) / 0.15 : bottleProg < 0.1 ? bottleProg / 0.1 : 1;
  const textReveal = clamp((bottleProg - 0.3) / 0.3);
  const labelZoom = clamp((bottleProg - 0.6) / 0.25);
  const quoteProg = prog(quoteStart, quoteEnd);
  const galleryProg = prog(galleryStart, galleryStart + galleryH);
  const galleryX = galleryProg * (wines.length - 1) * 100;
  const activeWine = Math.min(wines.length - 1, Math.floor(galleryProg * wines.length));

  return (
    <>
      <CustomCursor />
      {!ready && <Preloader onComplete={onPreloaderComplete} />}
      <main style={{ opacity: ready ? 1 : 0, transition: "opacity 0.5s ease 0.2s" }}>
        <Nav />
        <Hero ready={ready} />

        {/* BOTTLE SHOWCASE */}
        <section style={{ height: `${bottleEnd - bottleStart + vh}px`, position: "relative" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${wines[0].accent}${Math.floor(textReveal * 12).toString(16).padStart(2,"0")} 0%, transparent 60%)` }} />
            <div className="w-[50vh] h-[80vh]" style={{ transform: `scale(${bottleScale})`, opacity: bottleOpacity }}>
              <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><span className="font-sans text-xs tracking-[4px] text-gold">CHARGEMENT...</span></div>}>
                <BottleScene image={wines[0].image} scrollProgress={bottleProg} accent={wines[0].accent} />
              </Suspense>
            </div>
            <div className="absolute left-[8%] top-1/2 -translate-y-1/2 max-w-[350px]" style={{ opacity: textReveal }}>
              <div className="font-sans text-[10px] tracking-[5px] text-gold mb-4 uppercase">Le joyau de la maison</div>
              <h2 className="font-serif text-[48px] font-light leading-tight">Château<br /><em>Gilette</em></h2>
              <div className="w-10 h-[1px] my-6" style={{ background: "var(--gold)", opacity: 0.5 }} />
              <p className="font-sans text-[13px] leading-relaxed text-[var(--ink2)] font-light">{wines[0].description}</p>
            </div>
            <div className="absolute right-[8%] top-1/2 -translate-y-1/2 text-right" style={{ opacity: labelZoom }}>
              <div className="font-serif text-[72px] font-light leading-none" style={{ color: "rgba(181,147,90,0.12)" }}>1710</div>
              <div className="font-sans text-[10px] tracking-[3px] text-[var(--ink2)] mt-2">PREIGNAC · SAUTERNES</div>
            </div>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 h-[120px] w-[2px] bg-gold/10 rounded-full">
              <div className="w-[2px] rounded-full bg-gold" style={{ height: `${bottleProg * 100}%` }} />
            </div>
          </div>
        </section>

        {/* QUOTE REVEAL */}
        <section style={{ height: "120vh", position: "relative" }}>
          <div className="sticky top-0 h-screen flex items-center justify-center" style={{ background: "var(--ink)", color: "#FAF9F6", clipPath: `circle(${clamp(quoteProg) * 75 + 1}% at 50% 50%)` }}>
            <div className="text-center max-w-[700px] px-10">
              <div className="font-sans text-[10px] tracking-[6px] text-gold mb-7">PHILOSOPHIE</div>
              <blockquote className="font-serif text-[clamp(24px,3.5vw,42px)] font-light italic leading-relaxed" style={{ opacity: clamp(quoteProg * 1.5 - 0.3) }}>
                <span className="text-gold">&ldquo;</span>Être artisan du Champagne, c&apos;est notre implication totale à chaque étape — du choix du plant au dégorgement, nous créons des vins vivants.<span className="text-gold">&rdquo;</span>
              </blockquote>
              <div className="font-sans text-[10px] tracking-[4px] text-gold-light mt-8" style={{ opacity: clamp(quoteProg * 2 - 0.8) }}>JULIE &amp; XAVIER GONET-MÉDEVILLE</div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="py-16 overflow-hidden border-y border-black/5">
          <div className="flex gap-16 whitespace-nowrap" style={{ animation: "marquee 25s linear infinite", width: "fit-content" }}>
            {[0,1].map(j => <div key={j} className="flex gap-16 items-center">
              {["Sauternes","◆","Champagne","◆","Margaux","◆","Graves","◆","Bordeaux Supérieur","◆"].map((t,i) => <span key={i} className={t === "◆" ? "text-[10px] text-gold" : "font-serif text-[clamp(32px,5vw,56px)] font-light italic"}>{t}</span>)}
            </div>)}
          </div>
        </div>

        {/* HORIZONTAL WINE GALLERY */}
        <section>
          <div className="text-center py-32 px-10">
            <div className="font-sans text-[10px] tracking-[6px] text-gold mb-5">COLLECTION</div>
            <h2 className="font-serif text-[clamp(44px,7vw,80px)] font-light leading-none">Nos <em>Vins</em></h2>
          </div>
          <div style={{ height: galleryH }}>
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
              <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
                {wines.map((w,i) => <div key={w.id} className="w-2 h-2 rounded-full border-[1.5px] transition-all duration-500" style={{ borderColor: i===activeWine?"var(--gold)":"var(--gold-light)", background: i===activeWine?"var(--gold)":"transparent", transform: i===activeWine?"scale(1.4)":"scale(1)" }} />)}
              </div>
              <div className="flex flex-1 items-center" style={{ transform: `translateX(-${galleryX}vw)`, width: `${wines.length*100}vw`, willChange: "transform" }}>
                {wines.map((wine,idx) => <div key={wine.id} className="w-screen h-screen flex items-center justify-center relative" style={{ padding: "0 clamp(40px,8vw,120px)" }}>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at ${idx%2===0?"30%":"70%"} 50%, ${wine.accent}08 0%, transparent 60%)` }} />
                  <div className="flex items-center gap-[clamp(48px,6vw,100px)] max-w-[1200px] w-full relative z-10" style={{ flexDirection: idx%2===0?"row":"row-reverse" }}>
                    <div className="flex-shrink-0 w-[300px] h-[500px]">
                      <Suspense fallback={null}><BottleScene image={wine.image} scrollProgress={galleryProg+idx*0.3} accent={wine.accent} /></Suspense>
                    </div>
                    <div className="flex-1 max-w-[500px]">
                      <div className="font-sans text-[10px] tracking-[5px] font-semibold mb-3" style={{ color: wine.accent }}>{wine.appellation}</div>
                      <h3 className="font-serif text-[clamp(36px,4.5vw,64px)] font-light leading-tight mb-1.5">
                        <span className="block text-[0.5em] font-normal text-[var(--ink2)] mb-1">{wine.prefix}</span>{wine.name}
                      </h3>
                      <div className="font-serif text-[15px] italic text-[var(--ink2)] mb-7">{wine.subtitle} — {wine.year}</div>
                      <div className="w-10 h-[1px] mb-7" style={{ background: wine.accent, opacity: 0.5 }} />
                      <p className="font-sans text-sm text-[var(--ink2)] leading-relaxed font-normal mb-8">{wine.description}</p>
                      <div className="flex gap-10">
                        <div><div className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">ASSEMBLAGE</div><div className="font-sans text-xs text-[var(--ink2)] leading-relaxed">{wine.blend}</div></div>
                        <div><div className="font-sans text-[9px] tracking-[3px] text-gold mb-1.5">SUPERFICIE</div><div className="font-sans text-xs text-[var(--ink2)]">{wine.surface}</div></div>
                      </div>
                      <button className="mt-10 px-11 py-4 border font-sans text-[10px] tracking-[4px] uppercase relative overflow-hidden group" style={{ borderColor: wine.accent, color: wine.accent }} data-hover>
                        <span className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500" style={{ background: wine.accent }} />
                        <span className="relative z-10 group-hover:text-white transition-colors duration-500">Découvrir</span>
                      </button>
                    </div>
                  </div>
                  <div className="absolute bottom-[8%] font-serif text-[clamp(80px,15vw,200px)] font-light leading-none pointer-events-none select-none" style={{ [idx%2===0?"right":"left"]: "5%", color: "rgba(0,0,0,0.03)" }}>{wine.year}</div>
                </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="py-28 px-10 border-y border-black/5">
          <div className="max-w-[1100px] mx-auto flex justify-between flex-wrap gap-12">
            {[{end:1710,label:"Année de fondation"},{end:7,label:"Domaines"},{end:43,label:"Hectares"},{end:314,label:"Ans d'héritage"}].map((stat,i)=><CounterStat key={i} stat={stat} index={i} />)}
          </div>
        </section>

        {/* TERROIRS */}
        <section className="relative overflow-hidden py-36 px-10" style={{ background: "var(--ink)", color: "#FAF9F6" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 30%, rgba(181,147,90,0.06) 0%, transparent 50%)" }} />
          <div className="max-w-[1100px] mx-auto relative z-10 flex gap-20 flex-wrap">
            <div className="flex-1 min-w-[400px]">
              <div className="font-sans text-[10px] tracking-[6px] text-gold mb-6">DE LA CHAMPAGNE AU BORDELAIS</div>
              <h2 className="font-serif text-[clamp(36px,5vw,60px)] font-light leading-tight mb-8">Sept domaines, <em className="text-gold">un héritage</em></h2>
              <p className="font-sans text-sm leading-relaxed max-w-[440px]" style={{ color: "rgba(250,249,246,0.5)" }}>De la craie du Mesnil-sur-Oger aux graves profondes de Margaux, en passant par les sols sableux de Preignac — chaque terroir imprime son identité unique.</p>
            </div>
            <div className="flex-1 min-w-[300px] grid grid-cols-2 gap-8">
              {[{r:"Champagne",d:"3 Grands Crus\n5 Premiers Crus",h:"12 ha"},{r:"Sauternes",d:"Gilette · Les Justices",h:"13 ha"},{r:"Margaux",d:"Château des Eyrins",h:"2,9 ha"},{r:"Graves",d:"Respide-Médeville",h:"15 ha"}].map(t=><RevealCard key={t.r}><div className="border-l border-gold/25 pl-5"><div className="font-serif text-[28px] font-light mb-2">{t.r}</div><div className="font-sans text-[11px] leading-relaxed whitespace-pre-line" style={{color:"rgba(250,249,246,0.45)"}}>{t.d}</div><div className="font-sans text-[11px] text-gold mt-2 tracking-[2px]">{t.h}</div></div></RevealCard>)}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 px-10 border-t border-gold/10" style={{ background: "#F0ECE4" }}>
          <div className="max-w-[1100px] mx-auto flex justify-between flex-wrap gap-12">
            <div><div className="font-serif text-[32px] font-light tracking-[2px] mb-4">Gonet <span className="text-gold">·</span> Médeville</div><div className="font-sans text-xs text-[var(--ink2)] leading-loose">Producteurs de Grands Vins<br/>de Bordeaux &amp; de Champagne</div></div>
            <div><div className="font-sans text-[9px] tracking-[4px] text-gold mb-3.5">ADRESSE</div><div className="font-sans text-xs text-[var(--ink2)] leading-loose">4 Rue du Port, 33210 Preignac<br/>Sur rendez-vous · +33 5 56 76 28 44</div></div>
            <div><div className="font-sans text-[9px] tracking-[4px] text-gold mb-3.5">CONTACT</div><div className="font-sans text-xs text-[var(--ink2)] leading-loose">contact@gonet-medeville.com<br/>Instagram · Facebook</div></div>
          </div>
          <div className="text-center mt-16 font-sans text-[9px] text-[var(--ink2)] tracking-[2px]">L&apos;ABUS D&apos;ALCOOL EST DANGEREUX POUR LA SANTÉ · À CONSOMMER AVEC MODÉRATION<br/>© VIGNOBLES GONET-MÉDEVILLE — DEPUIS 1710</div>
        </footer>
      </main>
      <style jsx global>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </>
  );
}

function CounterStat({stat,index}:{stat:{end:number;label:string};index:number}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => { const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting)setVisible(true)},{threshold:0.3}); if(ref.current)obs.observe(ref.current); return ()=>obs.disconnect(); }, []);
  useEffect(() => { if(!visible)return; const d=2000; const s=performance.now(); const a=(n:number)=>{const p=Math.min((n-s)/d,1);setCount(Math.floor((1-Math.pow(1-p,3))*stat.end));if(p<1)requestAnimationFrame(a);}; requestAnimationFrame(a); }, [visible,stat.end]);
  return <div ref={ref} className="text-center flex-1 min-w-[200px]" style={{opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(30px)",transition:`all .7s cubic-bezier(.16,1,.3,1) ${index*100}ms`}}><div className="font-serif text-[clamp(48px,7vw,72px)] font-light leading-none">{count}</div><div className="font-sans text-[10px] tracking-[3px] text-gold mt-3 uppercase">{stat.label}</div></div>;
}

function RevealCard({children}:{children:React.ReactNode}) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true)},{threshold:0.2}); if(ref.current)obs.observe(ref.current); return ()=>obs.disconnect(); }, []);
  return <div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(24px)",transition:"all .7s cubic-bezier(.16,1,.3,1)"}}>{children}</div>;
}
