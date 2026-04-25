"use client";
import { forwardRef, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface Props {
  heroImg: React.RefObject<HTMLDivElement>;
  heroOverlay: React.RefObject<HTMLDivElement>;
  ready: boolean;
}

/**
 * Hero v3 — Dark, cinematic, logo-centric.
 * Noir background, the BubbleField WebGL renders behind.
 * Logo large and gold. Title appears letter by letter.
 * Subtle gold particles visible through the BubbleField.
 */
const Hero = forwardRef<HTMLElement, Props>(function Hero({ heroImg, heroOverlay, ready }, sectionRef) {
  const lettersRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    const letters = lettersRef.current?.querySelectorAll<HTMLElement>("[data-letter]");
    if (letters && letters.length) {
      gsap.set(letters, { yPercent: 130, opacity: 0 });
      gsap.to(letters, {
        yPercent: 0, opacity: 1, ease: "power4.out",
        duration: 1.6, stagger: 0.055, delay: 0.6,
      });
    }
  }, [ready]);

  const onDiscover = () => {
    const next = document.getElementById("after-hero");
    if (next) window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 1, behavior: "smooth" });
  };

  const renderLetters = (word: string) =>
    [...word].map((c, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom" style={{ paddingBottom: "0.05em" }}>
        <span data-letter className="inline-block will-change-transform">
          {c === " " ? "\u00A0" : c}
        </span>
      </span>
    ));

  return (
    <section ref={sectionRef} className="h-screen relative overflow-hidden" style={{ background: "#0E0E0C" }}>
      {/* Overlay refs kept for compatibility with page.tsx parallax code */}
      <div ref={heroImg} className="absolute inset-0 will-change-transform" style={{ opacity: 0 }} />
      <div ref={heroOverlay} className="absolute inset-0 pointer-events-none" style={{ opacity: 0 }} />

      {/* Subtle radial glow behind logo */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 40%, rgba(158,130,90,0.08) 0%, transparent 55%)"
      }} />

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 w-12 h-12 pointer-events-none" style={{ borderTop: "1px solid rgba(158,130,90,0.25)", borderLeft: "1px solid rgba(158,130,90,0.25)", opacity: ready ? 1 : 0, transition: "opacity 1.5s ease 2s" }} />
      <div className="absolute top-8 right-8 w-12 h-12 pointer-events-none" style={{ borderTop: "1px solid rgba(158,130,90,0.25)", borderRight: "1px solid rgba(158,130,90,0.25)", opacity: ready ? 1 : 0, transition: "opacity 1.5s ease 2s" }} />
      <div className="absolute bottom-8 left-8 w-12 h-12 pointer-events-none" style={{ borderBottom: "1px solid rgba(158,130,90,0.25)", borderLeft: "1px solid rgba(158,130,90,0.25)", opacity: ready ? 1 : 0, transition: "opacity 1.5s ease 2s" }} />
      <div className="absolute bottom-8 right-8 w-12 h-12 pointer-events-none" style={{ borderBottom: "1px solid rgba(158,130,90,0.25)", borderRight: "1px solid rgba(158,130,90,0.25)", opacity: ready ? 1 : 0, transition: "opacity 1.5s ease 2s" }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center" style={{ color: "#F7F5F0" }}>
        {/* Logo — grand et doré */}
        <div style={{ opacity: ready ? 1 : 0, transform: ready ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)", transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.2s" }}>
          <img
            src="/logo.png"
            alt="Gonet-Medeville"
            width={140}
            height={140}
            className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] mx-auto"
            style={{ filter: "invert(1) brightness(1.3) drop-shadow(0 0 40px rgba(158,130,90,0.3))" }}
          />
        </div>

        {/* Filet doré animé */}
        <div className="flex items-center gap-3 my-8">
          <div className="h-[1px] w-10 md:w-20" style={{ background: "linear-gradient(90deg, transparent, var(--gold))", transform: ready ? "scaleX(1)" : "scaleX(0)", transformOrigin: "right", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1) 1s" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "var(--gold)", opacity: ready ? 1 : 0, transition: "opacity 0.6s ease 1.3s" }} />
          <div className="h-[1px] w-10 md:w-20" style={{ background: "linear-gradient(270deg, transparent, var(--gold))", transform: ready ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1) 1s" }} />
        </div>

        {/* Titre lettre par lettre */}
        <div ref={titleRef} className="will-change-transform">
          <h1 ref={lettersRef} className="font-serif font-light leading-[0.88] tracking-[-0.03em]">
            <span className="block" style={{ fontSize: "clamp(52px, 9vw, 140px)" }}>{renderLetters("Gonet")}</span>
            <span className="block italic mt-2" style={{ fontSize: "clamp(42px, 7vw, 110px)", color: "var(--gold)" }}>{renderLetters("Medeville")}</span>
          </h1>
        </div>

        <div className="mt-10 max-w-[520px]" style={{ opacity: ready ? 1 : 0, transition: "opacity 1.2s ease 1.8s" }}>
          <p className="font-mono text-[10px] md:text-[11px] tracking-[6px] mb-2" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
            VIGNOBLES FAMILIAUX · DEPUIS MDCCX
          </p>
          <p className="font-serif italic font-light leading-[1.6] mt-6" style={{ fontSize: "clamp(14px, 1.2vw, 18px)", color: "rgba(247,245,240,0.65)" }}>
            Bordeaux &amp; Champagne — trois siècles de patience,<br />de la craie champenoise aux graves bordelaises.
          </p>
        </div>

        <div className="mt-12" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 2.2s" }}>
          <button className="btn-fill" data-hover data-cursor="enter" onClick={onDiscover} style={{ borderColor: "rgba(158,130,90,0.5)", color: "#F7F5F0" }}>
            <span>Découvrir la maison</span>
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 2.5s" }}>
        <span className="font-mono text-[9px] tracking-[3px]" style={{ color: "rgba(247,245,240,0.4)", fontFamily: "'DM Mono', monospace" }}>SCROLL</span>
        <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: "rgba(247,245,240,0.15)" }}>
          <div className="w-full h-1/2 bg-[var(--gold)]" style={{ animation: "scrollLine 2.5s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
});

export default Hero;
