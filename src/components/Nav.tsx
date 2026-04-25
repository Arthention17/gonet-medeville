"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const sample = () => {
      setScrolled(window.scrollY > 60);
      let el = document.elementFromPoint(window.innerWidth / 2, 80) as HTMLElement | null;
      while (el) {
        const bg = getComputedStyle(el).backgroundColor;
        const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d?\.?\d+))?/);
        if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
          const lum = (parseInt(m[1]) + parseInt(m[2]) + parseInt(m[3])) / 3;
          setDark(lum < 90);
          return;
        }
        el = el.parentElement;
      }
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { sample(); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    sample();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const fg = dark ? "#F7F5F0" : "var(--ink)";
  const links = ["La Maison", "Collection", "Terroirs", "Contact"];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-10 py-4 flex items-center justify-between transition-all duration-700" style={{
        background: scrolled ? (dark ? "rgba(14,14,12,0.78)" : "rgba(247,245,240,0.86)") : "transparent",
        backdropFilter: scrolled ? "blur(22px) saturate(1.3)" : "none",
        borderBottom: scrolled ? `1px solid ${dark ? "rgba(247,245,240,0.08)" : "rgba(158,130,90,0.08)"}` : "1px solid transparent",
        color: fg,
      }}>
        <a href="#" className="flex items-center gap-3 group" data-hover>
          <img
            src="/logo.png"
            alt="Gonet-Medeville"
            width={44} height={44}
            className="w-9 h-9 md:w-11 md:h-11 transition-all duration-500"
            style={{ filter: dark ? "invert(1) brightness(1.1)" : "none" }}
          />
          <span className="hidden sm:flex items-baseline gap-1.5">
            <span className="font-serif text-[15px] tracking-[2px] font-medium">Gonet</span>
            <span className="font-serif text-[15px] tracking-[2px] font-light italic text-[var(--gold)]">Medeville</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l} href="#" className="link-hover font-sans text-[11px] tracking-[1.5px] uppercase opacity-70 hover:opacity-100 transition-opacity duration-300" data-hover style={{ color: fg }}>
              {l}
            </a>
          ))}
        </div>

        {/* Hamburger (mobile) */}
        <button
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center"
          data-hover
        >
          <span className="block w-6 h-[1.5px] absolute transition-all duration-400" style={{ background: fg, transform: open ? "rotate(45deg)" : "translateY(-5px)" }} />
          <span className="block w-6 h-[1.5px] absolute transition-all duration-400" style={{ background: fg, transform: open ? "rotate(-45deg)" : "translateY(5px)" }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[99] md:hidden flex flex-col items-center justify-center gap-8 transition-all duration-700"
        style={{
          background: "var(--bg)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        }}
      >
        {links.map((l, i) => (
          <a
            key={l}
            href="#"
            onClick={() => setOpen(false)}
            className="font-serif font-light tracking-[-1px]"
            style={{
              fontSize: "clamp(36px, 9vw, 56px)",
              color: "var(--ink)",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(28px)",
              transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.07}s`,
            }}
          >
            {l}
          </a>
        ))}
        <div className="absolute bottom-12 font-mono text-[10px] tracking-[3px]" style={{ color: "var(--gold)", fontFamily: "'DM Mono', monospace" }}>
          MDCCX · GONET · MEDEVILLE
        </div>
      </div>
    </>
  );
}
