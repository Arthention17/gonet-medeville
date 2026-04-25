"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", s, { passive: true });
    return () => window.removeEventListener("scroll", s);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-8 md:px-12 py-5 flex items-center justify-between transition-all duration-700" style={{
      background: scrolled ? "rgba(247,245,240,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
      borderBottom: scrolled ? "1px solid rgba(158,130,90,0.08)" : "1px solid transparent",
    }}>
      <a href="#" className="flex items-baseline gap-1 group" data-hover>
        <span className="font-serif text-lg tracking-[2px] font-medium">Gonet</span>
        <span className="font-serif text-lg tracking-[2px] font-light italic text-[var(--gold)]">Medeville</span>
      </a>

      <div className="hidden md:flex items-center gap-8">
        {["La Maison","Collection","Terroirs","Contact"].map(l => (
          <a key={l} href="#" className="link-hover font-sans text-[11px] tracking-[1.5px] uppercase text-[var(--ink2)] hover:text-[var(--ink)] transition-colors duration-300" data-hover>
            {l}
          </a>
        ))}
      </div>
    </nav>
  );
}
