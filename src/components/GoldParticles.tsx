"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

/**
 * Lightweight canvas overlay. When cursor hovers [data-gold-sparkle] elements,
 * tiny gold particles burst from the cursor position.
 */
export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -100, y: -100, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (mouse.current.active && Math.random() > 0.6) {
        for (let i = 0; i < 2; i++) {
          particles.current.push({
            x: e.clientX + (Math.random() - 0.5) * 12,
            y: e.clientY + (Math.random() - 0.5) * 12,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2.5 - 0.5,
            life: 0,
            maxLife: 30 + Math.random() * 30,
            size: 1 + Math.random() * 2,
          });
        }
      }
    };

    const onEnter = () => { mouse.current.active = true; };
    const onLeave = () => { mouse.current.active = false; };

    window.addEventListener("mousemove", onMove);

    const observe = () => {
      document.querySelectorAll("[data-gold-sparkle]").forEach(el => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // gravity
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(158, 130, 90, ${alpha * 0.7})`;
        ctx.fill();

        if (p.life >= p.maxLife) ps.splice(i, 1);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9996]"
      aria-hidden
    />
  );
}
