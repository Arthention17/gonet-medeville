"use client";
import { useEffect, useState } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-5 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(250,249,246,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(181,147,90,0.1)"
          : "1px solid transparent",
      }}
    >
      <div className="font-serif text-base font-medium tracking-[3px]" data-hover>
        G
        <span className="text-[8px] text-gold mx-1 align-middle">◆</span>
        M
      </div>

      <div className="flex gap-7">
        {["Maison", "Collection", "Terroirs", "Héritage"].map((label) => (
          <span
            key={label}
            className="font-sans text-[11px] tracking-[2px] uppercase relative group"
            style={{ color: "var(--ink2)" }}
            data-hover
          >
            {label}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-500" />
          </span>
        ))}
      </div>
    </nav>
  );
}
