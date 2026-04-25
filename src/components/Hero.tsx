"use client";

interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  return (
    <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute w-[50vw] h-[50vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(181,147,90,0.04) 0%, transparent 70%)",
          top: "20%",
          left: "25%",
        }}
      />

      <div className="text-center relative z-10">
        {/* Eyebrow */}
        <div
          className="font-sans text-[10px] tracking-[8px] font-medium mb-10 uppercase transition-all duration-1000"
          style={{
            color: "var(--gold)",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "0.3s",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Grands Vins de Bordeaux & Champagne
        </div>

        {/* GONET */}
        <h1 className="font-serif font-light leading-[0.88]">
          <span className="block text-[clamp(72px,13vw,180px)] tracking-tighter">
            {"Gonet".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready
                    ? "translateY(0) rotate(0)"
                    : "translateY(80px) rotate(8deg)",
                  transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.06}s`,
                  transformOrigin: "bottom left",
                  color: "var(--ink)",
                }}
              >
                {ch}
              </span>
            ))}
          </span>

          {/* MÉDEVILLE */}
          <span className="block text-[clamp(52px,9vw,130px)] tracking-tight italic -mt-2">
            {"Médeville".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready
                    ? "translateY(0) rotate(0)"
                    : "translateY(80px) rotate(8deg)",
                  transition: `all 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${0.7 + i * 0.05}s`,
                  transformOrigin: "bottom left",
                  color: "var(--gold)",
                }}
              >
                {ch}
              </span>
            ))}
          </span>
        </h1>

        {/* Gold line */}
        <div
          className="w-[60px] h-[1px] mx-auto my-10"
          style={{
            background: "var(--gold)",
            transform: ready ? "scaleX(1)" : "scaleX(0)",
            transition:
              "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.4s",
          }}
        />

        {/* Subtitle */}
        <p
          className="font-serif text-[clamp(16px,2vw,22px)] font-light italic leading-relaxed"
          style={{
            color: "var(--ink2)",
            opacity: ready ? 1 : 0,
            transition: "opacity 1s ease 1.6s",
          }}
        >
          Trois siècles de passion
          <br />
          de la craie champenoise aux graves bordelaises
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-9 flex flex-col items-center gap-2"
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 1s ease 2s",
        }}
      >
        <span
          className="font-sans text-[9px] tracking-[4px]"
          style={{ color: "var(--ink2)" }}
        >
          SCROLL
        </span>
        <svg
          width="14"
          height="20"
          className="animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          <path
            d="M7 0v16M2 11l5 5 5-5"
            stroke="var(--gold)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
}
