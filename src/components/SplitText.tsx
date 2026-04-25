"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  by?: "char" | "word" | "line";
  delay?: number;
  stagger?: number;
  trigger?: "scroll" | "mount";
  start?: string;
  style?: React.CSSProperties;
}

export default function SplitText({
  children,
  className,
  as: Tag = "h2",
  by = "char",
  delay = 0,
  stagger = 0.025,
  trigger = "scroll",
  start = "top 82%",
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parts = el.querySelectorAll<HTMLElement>("[data-split]");
    if (!parts.length) return;
    gsap.set(parts, { yPercent: 110, opacity: 0 });
    const anim = () =>
      gsap.to(parts, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger,
        delay,
        ease: "power3.out",
      });
    if (trigger === "mount") {
      anim();
    } else {
      const st = ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: anim,
      });
      return () => st.kill();
    }
  }, [children, by, stagger, delay, trigger, start]);

  let units: string[];
  if (by === "char") units = [...children];
  else if (by === "word") units = children.split(" ");
  else units = children.split("\n");

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className} style={style}>
      {units.map((u, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span data-split className="inline-block" style={{ willChange: "transform, opacity" }}>
            {u === " " ? "\u00A0" : u}
            {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
