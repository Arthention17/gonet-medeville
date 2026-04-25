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
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-700" style={{
      background: scrolled ? "rgba(247,245,240,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
      borderBottom: scrolled ? "1px solid rgba(158,130,90,0.08)" : "1px solid transparent",
    }}>
      <a href="#" className="flex items-center gap-2.5 group" data-hover>
        <img
          src={scrolled ? "/photos/logo-dark.png" : "/photos/logo-white.png"}
          alt="Gonet-Medeville"
          className="h-9 w-auto object-contain transition-all duration-500"
        />
      </a>
      <div className="hidden md:flex items-center gap-7">
        {["La Maison","Collection","Terroirs","Contact"].map(l => (
          <a key={l} href="#" className="link-hover font-sans text-[11px] tracking-[1.5px] uppercase transition-colors duration-300" style={{
            color: scrolled ? "var(--ink2)" : "rgba(255,255,255,0.7)",
          }} data-hover>{l}</a>
        ))}
      </div>
    </nav>
  );
}
