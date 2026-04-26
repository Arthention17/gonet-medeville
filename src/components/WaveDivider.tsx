"use client";

interface Props {
  from?: string;
  to?: string;
  flip?: boolean;
}

/**
 * SVG wave transition between sections.
 * Place between two sections. `from` = top color, `to` = bottom color.
 */
export default function WaveDivider({ from = "var(--bg)", to = "#0E0E0C", flip = false }: Props) {
  return (
    <div className="relative w-full overflow-hidden pointer-events-none" style={{ marginTop: "-1px", marginBottom: "-1px", transform: flip ? "scaleY(-1)" : undefined }}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px] block">
        <path
          d="M 0,120 L 0,60 C 120,100 240,20 360,50 C 480,80 600,10 720,40 C 840,70 960,15 1080,45 C 1200,75 1320,25 1440,55 L 1440,120 Z"
          fill={to}
        />
        <path
          d="M 0,0 L 0,60 C 120,100 240,20 360,50 C 480,80 600,10 720,40 C 840,70 960,15 1080,45 C 1200,75 1320,25 1440,55 L 1440,0 Z"
          fill={from}
        />
      </svg>
    </div>
  );
}
