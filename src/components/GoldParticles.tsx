"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

/**
 * Gold particles that continuously emit from visible [data-gold-sparkle] elements.
 * No hover needed — particles float up from the text like champagne bubbles.
 */
export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const particles: Particle[] = [];
    const visibleEls = new Set<Element>();

    // Track which [data-gold-sparkle] elements are visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) visibleEls.add(e.target);
        else visibleEls.delete(e.target);
      });
    }, { threshold: 0.3 });

    const observe = () => {
      document.querySelectorAll("[data-gold-sparkle]").forEach(el => observer.observe(el));
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    let frame = 0;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Emit particles from visible gold text elements every ~8 frames
      if (frame % 8 === 0) {
        visibleEls.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width === 0) return;

          // Random position along the text
          const x = rect.left + Math.random() * rect.width;
          const y = rect.top + Math.random() * rect.height * 0.5;

          particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 1.5 - 0.3,
            life: 0,
            maxLife: 50 + Math.random() * 40,
            size: 0.8 + Math.random() * 1.8,
          });
        });
      }

      // Keep max ~80 particles
      while (particles.length > 80) particles.shift();

      // Render
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.1; // drift
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - progress * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(158, 130, 90, ${alpha * 0.55})`;
        ctx.fill();

        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9996]" aria-hidden />;
}
