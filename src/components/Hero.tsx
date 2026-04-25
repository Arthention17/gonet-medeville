"use client";
import { forwardRef, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { photos } from "@/lib/images";

interface Props {
  heroImg: React.RefObject<HTMLDivElement | null>;
  heroOverlay: React.RefObject<HTMLDivElement | null>;
  ready: boolean;
}

/**
 * Hero — refined cinematic intro.
 * - Letters of "Gonet" / "Medeville" reveal one by one with stagger + power4.out
 * - Background image follows the cursor with subtle parallax (image x/y)
 * - Headline counter-parallaxes (opposite direction) for depth
 * - Edges of the image fade into the cream background via multi-direction overlay
 *   (top + bottom + left + right + radial vignette) so the image never looks "boxed"
 * - "Découvrir" smooth-scrolls to the next section
 */
const Hero = forwardRef<HTMLElement, Props>(function Hero({ heroImg, heroOverlay, ready }, sectionRef) {
  const lettersRef = useRef<HTMLHeadingElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;

    // Letter-by-letter reveal
    const letters = lettersRef.current?.querySelectorAll<HTMLElement>("[data-letter]");
    if (letters && letters.length) {
      gsap.set(letters, { yPercent: 130, opacity: 0 });
      gsap.to(letters, {
        yPercent: 0,
        opacity: 1,
        ease: "power4.out",
        duration: 1.4,
        stagger: 0.06,
        delay: 0.5,
      });
    }
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const wrap = wrapRef.current;
    const img = heroImg.current;
    const title = titleRef.current;
    if (!wrap || !img || !title) return;

    // Mouse parallax — image follows, title counter-parallaxes
    let mx = 0, my = 0, ix = 0, iy = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    };
    wrap.addEventListener("mousemove", onMove);

    let raf = 0;
    const loop = () => {
      ix += (mx * 22 - ix) * 0.06;
      iy += (my * 14 - iy) * 0.06;
      tx += (-mx * 12 - tx) * 0.08;
      ty += (-my * 8 - ty) * 0.08;
      img.style.transform = `translate3d(${ix}px, ${iy}px, 0)`;
      title.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("mousemove", onMove);
    };
  }, [ready, heroImg]);

  const onDiscover = () => {
    const next = document.getElementById("after-hero");
    if (next) {
      window.scrollTo({ top: next.getBoundingClientRect().top + window.scrollY - 1, behavior: "smooth" });
    }
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
    <section ref={sectionRef} className="h-screen relative overflow-hidden">
      <div ref={wrapRef} className="absolute inset-0">
        {/* Background image with subtle Ken Burns + parallax via JS transform */}
        <div ref={heroImg} className="absolute inset-0 will-change-transform photo-grade" style={{ scale: "1.12" }}>
          <img
            src={photos.hero}
            alt=""
            className="w-full h-full object-cover"
            style={{ animation: "kenBurns 28s ease-in-out infinite alternate" }}
          />
        </div>

        {/* Edge feathering — fade the image into the cream/dark page bg from every side */}
        {/* Top fade (cream → transparent) */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, var(--bg) 0%, rgba(247,245,240,0.0) 18%)" }} />
        {/* Bottom fade (cream → transparent), heavier so cream blends down to the next section */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(0deg, var(--bg) 0%, rgba(247,245,240,0.0) 35%)" }} />
        {/* Side fades */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, var(--bg) 0%, rgba(247,245,240,0.0) 10%, rgba(247,245,240,0.0) 90%, var(--bg) 100%)" }} />
        {/* Centre legibility — slight darken under the wordmark */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(14,14,12,0.45) 0%, rgba(14,14,12,0.18) 35%, rgba(14,14,12,0.0) 65%)" }} />
        {/* Scroll-driven darken for transition out */}
        <div ref={heroOverlay} className="absolute inset-0 pointer-events-none opacity-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(14,14,12,0.55) 100%)" }} />
      </div>

      {/* Wordmark */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center" style={{ color: "#F7F5F0" }}>
        <div className="overflow-hidden mb-8" style={{ opacity: ready ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}>
          <span className="font-mono inline-block text-[11px] tracking-[6px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
            MDCCX &mdash; VIGNOBLES FAMILIAUX
          </span>
        </div>

        <div ref={titleRef} className="will-change-transform">
          <h1 ref={lettersRef} className="font-serif font-light leading-[0.92] tracking-[-0.02em]">
            <span className="block" style={{ fontSize: "clamp(48px, 7vw, 110px)" }}>{renderLetters("Gonet")}</span>
            <span className="block italic mt-1" style={{ fontSize: "clamp(40px, 6vw, 90px)", color: "var(--gold)" }}>{renderLetters("Medeville")}</span>
          </h1>
        </div>

        <div className="w-12 h-[1px] mx-auto my-10" style={{ background: "var(--gold)", transform: ready ? "scaleX(1)" : "scaleX(0)", transition: "transform 1.4s cubic-bezier(0.16,1,0.3,1) 1.5s" }} />

        <p className="font-serif italic font-light leading-[1.55] max-w-[440px]" style={{ fontSize: "clamp(15px, 1.3vw, 19px)", color: "rgba(247,245,240,0.88)", opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.7s" }}>
          Trois siècles de patience, de la craie champenoise<br />aux graves bordelaises.
        </p>

        <div className="mt-10" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 1.9s" }}>
          <button className="btn-fill" data-hover data-cursor="enter" onClick={onDiscover}>
            <span>Découvrir</span>
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10" style={{ opacity: ready ? 1 : 0, transition: "opacity 1s ease 2.1s" }}>
        <span className="font-mono text-[9px] tracking-[3px]" style={{ color: "rgba(247,245,240,0.6)", fontFamily: "'DM Mono', monospace" }}>SCROLL</span>
        <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: "rgba(247,245,240,0.2)" }}>
          <div className="w-full h-1/2 bg-[var(--gold)]" style={{ animation: "scrollLine 2.5s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
});

export default Hero;
