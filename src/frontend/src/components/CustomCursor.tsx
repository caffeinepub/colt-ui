import type React from "react";
import { useEffect, useRef, useState } from "react";
import { CursorStyle } from "../backend";

// Extended cursor style type to include local-only styles
type ExtendedCursorStyle =
  | CursorStyle
  | "galaxySwirl"
  | "neonSnake"
  | "pixelBlock"
  | "laserBeam";

interface CustomCursorProps {
  cursorStyle?: ExtendedCursorStyle;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  cursorStyle = CursorStyle.neonDot,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const posRef = useRef({ x: -200, y: -200 });
  const smoothPosRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  // Inject global cursor-hide style on mount
  useEffect(() => {
    let styleEl = document.getElementById(
      "colt-cursor-hide",
    ) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "colt-cursor-hide";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = "* { cursor: none !important; }";
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const interactiveSelectors =
      'a, button, input, textarea, select, [role="button"], [tabindex]';
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      setIsHovering(!!target.closest(interactiveSelectors));
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    const animate = () => {
      const { x, y } = posRef.current;
      const smooth = smoothPosRef.current;
      smooth.x += (x - smooth.x) * 0.15;
      smooth.y += (y - smooth.y) * 0.15;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const color = isHovering ? "#00ff88" : "#00e5ff";
  const glow = isHovering
    ? "0 0 8px #00ff88, 0 0 20px #00ff88"
    : "0 0 8px #00e5ff, 0 0 20px #00e5ff";
  const scale = isClicking ? 0.7 : isHovering ? 1.3 : 1;

  const renderCursor = () => {
    switch (cursorStyle) {
      case CursorStyle.neonDot:
        return (
          <NeonDotCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case CursorStyle.crosshair:
        return (
          <CrosshairCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case CursorStyle.ringPulse:
        return (
          <RingPulseCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case CursorStyle.starBurst:
        return (
          <StarBurstCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case CursorStyle.arrowGlow:
        return (
          <ArrowGlowCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case "galaxySwirl":
        return (
          <GalaxySwirlCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case "neonSnake":
        return (
          <NeonSnakeCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case "pixelBlock":
        return (
          <PixelBlockCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      case "laserBeam":
        return (
          <LaserBeamCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
      default:
        return (
          <NeonDotCursor
            color={color}
            glow={glow}
            scale={scale}
            posRef={posRef}
            smoothPosRef={smoothPosRef}
          />
        );
    }
  };

  return <>{renderCursor()}</>;
};

// ── Shared cursor props ──────────────────────────────────────────────────────
interface CursorProps {
  color: string;
  glow: string;
  scale: number;
  posRef: React.MutableRefObject<{ x: number; y: number }>;
  smoothPosRef: React.MutableRefObject<{ x: number; y: number }>;
}

// ── Neon Dot ─────────────────────────────────────────────────────────────────
function NeonDotCursor({
  color,
  glow,
  scale,
  posRef,
  smoothPosRef,
}: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      const smooth = smoothPosRef.current;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${smooth.x - 16}px, ${smooth.y - 16}px)`;
      if (trailRef.current)
        trailRef.current.style.transform = `translate(${smooth.x - 6}px, ${smooth.y - 6}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, smoothPosRef]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full"
        style={{
          background: color,
          boxShadow: glow,
          transform: `scale(${scale})`,
          transition: "background 0.2s, box-shadow 0.2s",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-8 h-8 rounded-full border"
        style={{
          borderColor: color,
          boxShadow: `0 0 6px ${color}`,
          opacity: 0.7,
          transition: "border-color 0.2s",
        }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] w-3 h-3 rounded-full"
        style={{
          background: "rgba(0, 229, 255, 0.15)",
          boxShadow: "0 0 4px rgba(0, 229, 255, 0.3)",
        }}
      />
    </>
  );
}

// ── Crosshair ────────────────────────────────────────────────────────────────
function CrosshairCursor({ color, glow, scale, posRef }: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      if (ref.current)
        ref.current.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef]);

  const size = 40 * scale;
  const half = size / 2;

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        style={{
          position: "absolute",
          top: `${half - 0.75}px`,
          left: 0,
          right: 0,
          height: "1.5px",
          background: color,
          boxShadow: glow,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `${half - 0.75}px`,
          top: 0,
          bottom: 0,
          width: "1.5px",
          background: color,
          boxShadow: glow,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${half - 3}px`,
          left: `${half - 3}px`,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: color,
          boxShadow: glow,
        }}
      />
    </div>
  );
}

// ── Ring Pulse ───────────────────────────────────────────────────────────────
function RingPulseCursor({ color, glow, posRef, smoothPosRef }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      tickRef.current++;
      const { x, y } = posRef.current;
      const smooth = smoothPosRef.current;
      const pulse = Math.sin(tickRef.current * 0.08) * 0.5 + 0.5;
      const pulse2 = Math.sin(tickRef.current * 0.08 + Math.PI) * 0.5 + 0.5;

      if (dotRef.current)
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      if (ring1Ref.current) {
        const r1 = 14 + pulse * 8;
        ring1Ref.current.style.transform = `translate(${smooth.x - r1}px, ${smooth.y - r1}px)`;
        ring1Ref.current.style.width = `${r1 * 2}px`;
        ring1Ref.current.style.height = `${r1 * 2}px`;
        ring1Ref.current.style.opacity = String(0.4 + pulse * 0.5);
      }
      if (ring2Ref.current) {
        const r2 = 22 + pulse2 * 10;
        ring2Ref.current.style.transform = `translate(${smooth.x - r2}px, ${smooth.y - r2}px)`;
        ring2Ref.current.style.width = `${r2 * 2}px`;
        ring2Ref.current.style.height = `${r2 * 2}px`;
        ring2Ref.current.style.opacity = String(0.2 + pulse2 * 0.3);
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, smoothPosRef]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: glow }}
      />
      <div
        ref={ring1Ref}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2"
        style={{ borderColor: color, boxShadow: `0 0 8px ${color}` }}
      />
      <div
        ref={ring2Ref}
        className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border"
        style={{ borderColor: color, boxShadow: `0 0 4px ${color}` }}
      />
    </>
  );
}

// ── Star Burst ───────────────────────────────────────────────────────────────
function StarBurstCursor({ color, glow, scale, posRef }: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      tickRef.current++;
      const { x, y } = posRef.current;
      const rot = tickRef.current * 1.5;
      if (ref.current) {
        ref.current.style.left = `${x - 20}px`;
        ref.current.style.top = `${y - 20}px`;
        ref.current.style.transform = `rotate(${rot}deg) scale(${scale})`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, scale]);

  const rays = 8;
  const rayEls = Array.from({ length: rays }, (_, i) => {
    const angle = (360 / rays) * i;
    return (
      <div
        key={`ray-${angle}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "18px",
          height: "2px",
          marginTop: "-1px",
          marginLeft: "0px",
          background: `linear-gradient(to right, ${color}, transparent)`,
          boxShadow: `0 0 4px ${color}`,
          transformOrigin: "0 50%",
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  });

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999]"
      style={{ width: "40px", height: "40px" }}
    >
      {rayEls}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: color,
          boxShadow: glow,
        }}
      />
    </div>
  );
}

// ── Arrow Glow ───────────────────────────────────────────────────────────────
function ArrowGlowCursor({ color, scale, posRef }: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      if (ref.current) {
        ref.current.style.left = `${x}px`;
        ref.current.style.top = `${y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef]);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999]"
      style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
    >
      <svg
        width="22"
        height="26"
        viewBox="0 0 22 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Arrow cursor"
        role="img"
        style={{
          filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})`,
        }}
      >
        <path
          d="M2 2L2 20L7 15L11 24L14 23L10 14L18 14L2 2Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ── Galaxy Swirl ─────────────────────────────────────────────────────────────
function GalaxySwirlCursor({ color, posRef }: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);

  useEffect(() => {
    const animate = () => {
      tickRef.current++;
      const { x, y } = posRef.current;
      const rot = tickRef.current * 2;
      if (ref.current) {
        ref.current.style.left = `${x - 20}px`;
        ref.current.style.top = `${y - 20}px`;
        ref.current.style.transform = `rotate(${rot}deg)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef]);

  // Generate spiral arms
  const dots: {
    key: string;
    left: number;
    top: number;
    size: number;
    opacity: number;
  }[] = [];
  for (let armIdx = 0; armIdx < 3; armIdx++) {
    const baseAngle = (360 / 3) * armIdx;
    for (let i = 0; i < 5; i++) {
      const angle = baseAngle + i * 18;
      const dist = 4 + i * 3;
      const size = 5 - i * 0.6;
      const opacity = 1 - i * 0.15;
      const rad = (angle * Math.PI) / 180;
      const cx = 20 + Math.cos(rad) * dist;
      const cy = 20 + Math.sin(rad) * dist;
      dots.push({
        key: `arm-${armIdx}-dot-${i}`,
        left: cx - size / 2,
        top: cy - size / 2,
        size,
        opacity,
      });
    }
  }

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999]"
      style={{ width: "40px", height: "40px" }}
    >
      {dots.map((d) => (
        <div
          key={d.key}
          style={{
            position: "absolute",
            left: `${d.left}px`,
            top: `${d.top}px`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${d.size * 2}px ${color}`,
            opacity: d.opacity,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: "#ffffff",
          boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
        }}
      />
    </div>
  );
}

// ── Neon Snake ───────────────────────────────────────────────────────────────
// Uses a single container div with 6 child divs tracked via index
function NeonSnakeCursor({ color, glow, posRef }: CursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<Array<{ x: number; y: number }>>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      historyRef.current.unshift({ x, y });
      if (historyRef.current.length > 35) historyRef.current.pop();

      const container = containerRef.current;
      if (!container) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const children = container.children;
      // child 0 = head
      if (children[0]) {
        const el = children[0] as HTMLElement;
        el.style.left = `${x - 6}px`;
        el.style.top = `${y - 6}px`;
      }
      // children 1-5 = body segments
      for (let i = 1; i < 6; i++) {
        const el = children[i] as HTMLElement;
        if (!el) continue;
        const idx = Math.min(i * 5, historyRef.current.length - 1);
        const pos = historyRef.current[idx];
        if (pos) {
          const bSize = Math.max(4, 11 - i * 1.2);
          el.style.left = `${pos.x - bSize / 2}px`;
          el.style.top = `${pos.y - bSize / 2}px`;
          el.style.width = `${bSize}px`;
          el.style.height = `${bSize}px`;
          el.style.opacity = String(0.9 - i * 0.13);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-0 h-0 pointer-events-none"
    >
      {/* head */}
      <div
        className="fixed rounded-full pointer-events-none z-[9999]"
        style={{
          width: "12px",
          height: "12px",
          background: color,
          boxShadow: glow,
        }}
      />
      {/* body segments */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={`snake-body-${i}`}
          className="fixed rounded-full pointer-events-none"
          style={{
            zIndex: 9998 - i,
            background: color,
            boxShadow: `0 0 ${8 - i}px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

// ── Pixel Block ───────────────────────────────────────────────────────────────
function PixelBlockCursor({ color, scale, posRef }: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      if (ref.current) {
        ref.current.style.left = `${x - 8}px`;
        ref.current.style.top = `${y - 8}px`;
        ref.current.style.transform = `scale(${scale})`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, scale]);

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[9999]"
      style={{
        width: "16px",
        height: "16px",
        background: color,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}66, inset 0 0 6px rgba(255,255,255,0.4)`,
        imageRendering: "pixelated",
        borderRadius: "2px",
        border: "2px solid rgba(255,255,255,0.6)",
      }}
    />
  );
}

// ── Laser Beam ───────────────────────────────────────────────────────────────
function LaserBeamCursor({ color, posRef, smoothPosRef }: CursorProps) {
  const beamRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      const smooth = smoothPosRef.current;

      const dx = x - smooth.x;
      const dy = y - smooth.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const len = Math.max(16, Math.min(60, dist * 1.5));

      if (beamRef.current) {
        beamRef.current.style.left = `${smooth.x}px`;
        beamRef.current.style.top = `${smooth.y - 1.5}px`;
        beamRef.current.style.width = `${len}px`;
        beamRef.current.style.transform = `rotate(${angle}deg)`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${x - 4}px`;
        dotRef.current.style.top = `${y - 4}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, smoothPosRef]);

  return (
    <>
      <div
        ref={beamRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          height: "3px",
          background: `linear-gradient(to right, transparent, ${color})`,
          boxShadow: `0 0 6px ${color}, 0 0 12px ${color}66`,
          transformOrigin: "0 50%",
          borderRadius: "3px",
        }}
      />
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          width: "8px",
          height: "8px",
          background: "#ffffff",
          boxShadow: `0 0 8px ${color}, 0 0 20px ${color}`,
        }}
      />
    </>
  );
}

export default CustomCursor;
