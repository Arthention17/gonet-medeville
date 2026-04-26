"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GiletteShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const textARef = useRef<HTMLDivElement>(null);
  const textBRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const bottle = bottleRef.current;
    const textA = textARef.current;
    const textB = textBRef.current;
    const year = yearRef.current;
    const glow = glowRef.current;
    if (!sec || !bottle || !textA || !textB || !year || !glow) return;

    gsap.set(bottle, { xPercent: 0, yPercent: 0, scale: 1.2, rotation: 0 });
    gsap.set(textA, { opacity: 0, x: -60 });
    gsap.set(textB, { opacity: 0, x: 60 });
    gsap.set(year, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Phase 1 (0→0.12) : bouteille centre, zoom out
    tl.to(bottle, { scale: 1.0, duration: 0.12, ease: "power2.out" }, 0)
      .to(year, { opacity: 0.06, y: 0, duration: 0.12 }, 0)
      .to(glow, { background: "radial-gradient(ellipse at 50% 50%, rgba(158,130,90,0.08) 0%, transparent 55%)", duration: 0.12 }, 0)

    // Phase 2 (0.12→0.30) : bouteille → droite + inclinaison, texte A à gauche
      .to(bottle, { xPercent: 30, rotation: 4, scale: 0.95, duration: 0.18, ease: "power2.inOut" }, 0.12)
      .to(textA, { opacity: 1, x: 0, duration: 0.14, ease: "power3.out" }, 0.18)
      .to(year, { opacity: 0, duration: 0.08 }, 0.12)

    // Phase 3 (0.30→0.38) : pause lecture
      .to({}, { duration: 0.08 }, 0.30)

    // Phase 4 (0.38→0.52) : texte A disparaît, bouteille revient centre
      .to(textA, { opacity: 0, x: -40, duration: 0.10, ease: "power2.in" }, 0.38)
      .to(bottle, { xPercent: 0, rotation: 0, scale: 1.05, duration: 0.14, ease: "power2.inOut" }, 0.40)

    // Phase 5 (0.52→0.70) : bouteille → gauche + inclinaison inverse, texte B à droite
      .to(bottle, { xPercent: -30, rotation: -4, scale: 0.95, duration: 0.18, ease: "power2.inOut" }, 0.52)
      .to(textB, { opacity: 1, x: 0, duration: 0.14, ease: "power3.out" }, 0.58)
      .to(year, { opacity: 0.08, y: 0, duration: 0.10 }, 0.55)
      .to(glow, { background: "radial-gradient(ellipse at 35% 50%, rgba(158,130,90,0.10) 0%, transparent 55%)", duration: 0.14 }, 0.52)

    // Phase 6 (0.70→1.0) : pause lecture longue
      .to({}, { duration: 0.30 }, 0.70);

    // Colorer le spacer pour éviter un flash blanc
    const pinSpacer = sec.parentElement;
    if (pinSpacer && pinSpacer.classList.contains("pin-spacer")) {
      pinSpacer.style.background = "var(--warm)";
    }

    // Trier les pins dans l'ordre du DOM
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="h-screen relative overflow-hidden" style={{ background: "#0E0E0C" }} data-cursor-zone="dark" data-ambilight="rgba(212,160,23,0.05)">
      <div ref={glowRef} className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(158,130,90,0.04) 0%, transparent 55%)" }} />

      <div ref={bottleRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 will-change-transform"
        style={{ perspective: "800px" }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          const img = e.currentTarget.querySelector("img");
          if (img) gsap.to(img, { rotateY: x * 25, rotateX: -y * 15, duration: 0.8, ease: "power3.out" });
        }}
        onMouseLeave={(e) => {
          const img = e.currentTarget.querySelector("img");
          if (img) gsap.to(img, { rotateY: 0, rotateX: 0, duration: 1.4, ease: "power3.out" });
        }}
        data-cursor="découvrir"
      >
        <div className="relative">
          <img src="/bottles/gilette.png" alt="Château Gilette" className="h-[55vh] md:h-[65vh] w-auto object-contain select-none" style={{ filter: "drop-shadow(0 40px 80px rgba(158,130,90,0.3))" }} />
          <div className="absolute inset-0 -z-10 blur-[100px] opacity-25" style={{ background: "radial-gradient(ellipse, #9E825A, transparent 70%)" }} />
        </div>
      </div>

      {/* Texte A — gauche (quand bouteille est à droite) */}
      <div ref={textARef} className="absolute left-[6%] lg:left-[10%] top-1/2 -translate-y-1/2 max-w-[400px] z-10" style={{ color: "#F7F5F0" }}>
        <span className="font-mono text-[10px] tracking-[5px] block mb-5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>LE VIN EMBLÉMATIQUE</span>
        <h2 className="font-serif font-light leading-[1] tracking-[-2px] mb-3" style={{ fontSize: "clamp(38px, 4.5vw, 72px)" }}>Château</h2>
        <h2 className="font-serif italic font-light leading-[1] tracking-[-2px] mb-6" style={{ fontSize: "clamp(46px, 5.5vw, 88px)", color: "var(--gold)" }}>Gilette</h2>
        <p className="font-serif italic text-[15px]" style={{ color: "rgba(247,245,240,0.6)" }}>Crème de Tête · Sauternes</p>
      </div>

      {/* Texte B — droite (quand bouteille est à gauche) */}
      <div ref={textBRef} className="absolute right-[6%] lg:right-[10%] top-1/2 -translate-y-1/2 max-w-[440px] z-10" style={{ color: "#F7F5F0" }}>
        <span className="font-mono text-[10px] tracking-[5px] block mb-5" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>SAUTERNES · 1989</span>
        <p className="font-sans text-[14px] leading-[2] mb-10" style={{ color: "rgba(247,245,240,0.6)" }}>
          L&apos;antiquaire du Sauternes. Vieilli vingt ans en cuves béton centenaires avant sa mise en bouteille — une patience unique au monde. Seulement 5&nbsp;000 bouteilles par millésime.
        </p>
        <div className="flex gap-10">
          <div>
            <div className="font-serif text-[32px] font-light" style={{ color: "var(--gold)" }}>20</div>
            <span className="font-mono text-[9px] tracking-[2px]" style={{ color: "rgba(247,245,240,0.4)", fontFamily: "'DM Mono', monospace" }}>ANS EN CUVES</span>
          </div>
          <div className="w-[1px] h-12" style={{ background: "rgba(158,130,90,0.2)" }} />
          <div>
            <div className="font-serif text-[32px] font-light" style={{ color: "var(--gold)" }}>5k</div>
            <span className="font-mono text-[9px] tracking-[2px]" style={{ color: "rgba(247,245,240,0.4)", fontFamily: "'DM Mono', monospace" }}>BOUTEILLES</span>
          </div>
          <div className="w-[1px] h-12" style={{ background: "rgba(158,130,90,0.2)" }} />
          <div>
            <div className="font-serif text-[32px] font-light" style={{ color: "var(--gold)" }}>90%</div>
            <span className="font-mono text-[9px] tracking-[2px]" style={{ color: "rgba(247,245,240,0.4)", fontFamily: "'DM Mono', monospace" }}>SÉMILLON</span>
          </div>
        </div>
      </div>

      <div ref={yearRef} className="absolute bottom-[8%] left-1/2 -translate-x-1/2 font-serif font-light italic leading-none pointer-events-none select-none" style={{ fontSize: "clamp(100px, 18vw, 280px)", color: "var(--gold)", opacity: 0 }}>1989</div>
    </section>
  );
}
