import React, { useEffect, useRef, useState } from 'react';
import { CursorStyle } from '../backend';

interface CustomCursorProps {
  cursorStyle?: CursorStyle;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  cursorStyle = CursorStyle.neonDot,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const posRef = useRef({ x: -200, y: -200 });
  const smoothPosRef = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], [tabindex]';
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      setIsHovering(!!target.closest(interactiveSelectors));
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    const animate = () => {
      const { x, y } = posRef.current;
      const smooth = smoothPosRef.current;
      smooth.x += (x - smooth.x) * 0.15;
      smooth.y += (y - smooth.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
        cursorRef.current.dataset.smoothX = String(smooth.x);
        cursorRef.current.dataset.smoothY = String(smooth.y);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const color = isHovering ? '#00ff88' : '#00e5ff';
  const glow = isHovering
    ? '0 0 8px #00ff88, 0 0 20px #00ff88'
    : '0 0 8px #00e5ff, 0 0 20px #00e5ff';
  const scale = isClicking ? 0.7 : isHovering ? 1.3 : 1;

  const renderCursor = () => {
    switch (cursorStyle) {
      case CursorStyle.neonDot:
        return (
          <>
            {/* Main dot */}
            <NeonDotCursor color={color} glow={glow} scale={scale} posRef={posRef} smoothPosRef={smoothPosRef} />
          </>
        );
      case CursorStyle.crosshair:
        return <CrosshairCursor color={color} glow={glow} scale={scale} posRef={posRef} smoothPosRef={smoothPosRef} />;
      case CursorStyle.ringPulse:
        return <RingPulseCursor color={color} glow={glow} scale={scale} posRef={posRef} smoothPosRef={smoothPosRef} />;
      case CursorStyle.starBurst:
        return <StarBurstCursor color={color} glow={glow} scale={scale} posRef={posRef} smoothPosRef={smoothPosRef} />;
      case CursorStyle.arrowGlow:
        return <ArrowGlowCursor color={color} glow={glow} scale={scale} posRef={posRef} smoothPosRef={smoothPosRef} />;
      default:
        return <NeonDotCursor color={color} glow={glow} scale={scale} posRef={posRef} smoothPosRef={smoothPosRef} />;
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
function NeonDotCursor({ color, glow, scale, posRef, smoothPosRef }: CursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      const smooth = smoothPosRef.current;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${smooth.x - 16}px, ${smooth.y - 16}px)`;
      if (trailRef.current) trailRef.current.style.transform = `translate(${smooth.x - 6}px, ${smooth.y - 6}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, smoothPosRef]);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: glow, transform: `scale(${scale})`, transition: 'background 0.2s, box-shadow 0.2s' }} />
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998] w-8 h-8 rounded-full border"
        style={{ borderColor: color, boxShadow: `0 0 6px ${color}`, opacity: 0.7, transition: 'border-color 0.2s' }} />
      <div ref={trailRef} className="fixed top-0 left-0 pointer-events-none z-[9997] w-3 h-3 rounded-full"
        style={{ background: 'rgba(0, 229, 255, 0.15)', boxShadow: '0 0 4px rgba(0, 229, 255, 0.3)' }} />
    </>
  );
}

// ── Crosshair ────────────────────────────────────────────────────────────────
function CrosshairCursor({ color, glow, scale, posRef, smoothPosRef }: CursorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const { x, y } = posRef.current;
      if (ref.current) ref.current.style.transform = `translate(${x - 20}px, ${y - 20}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [posRef, smoothPosRef]);

  const size = 40 * scale;
  const half = size / 2;

  return (
    <div ref={ref} className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ width: `${size}px`, height: `${size}px` }}>
      {/* Horizontal line */}
      <div style={{
        position: 'absolute', top: `${half - 0.75}px`, left: 0, right: 0, height: '1.5px',
        background: color, boxShadow: glow,
      }} />
      {/* Vertical line */}
      <div style={{
        position: 'absolute', left: `${half - 0.75}px`, top: 0, bottom: 0, width: '1.5px',
        background: color, boxShadow: glow,
      }} />
      {/* Center dot */}
      <div style={{
        position: 'absolute', top: `${half - 3}px`, left: `${half - 3}px`,
        width: '6px', height: '6px', borderRadius: '50%',
        background: color, boxShadow: glow,
      }} />
    </div>
  );
}

// ── Ring Pulse ───────────────────────────────────────────────────────────────
function RingPulseCursor({ color, glow, scale, posRef, smoothPosRef }: CursorProps) {
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

      if (dotRef.current) dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
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
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: glow }} />
      <div ref={ring1Ref} className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2"
        style={{ borderColor: color, boxShadow: `0 0 8px ${color}` }} />
      <div ref={ring2Ref} className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border"
        style={{ borderColor: color, boxShadow: `0 0 4px ${color}` }} />
    </>
  );
}

// ── Star Burst ───────────────────────────────────────────────────────────────
function StarBurstCursor({ color, glow, scale, posRef, smoothPosRef }: CursorProps) {
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
  }, [posRef, smoothPosRef, scale]);

  const rays = 8;
  const rayEls = Array.from({ length: rays }, (_, i) => {
    const angle = (360 / rays) * i;
    return (
      <div key={i} style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '18px',
        height: '2px',
        marginTop: '-1px',
        marginLeft: '0px',
        background: `linear-gradient(to right, ${color}, transparent)`,
        boxShadow: `0 0 4px ${color}`,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
      }} />
    );
  });

  return (
    <div ref={ref} className="fixed pointer-events-none z-[9999]" style={{ width: '40px', height: '40px' }}>
      {rayEls}
      {/* Center dot */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '6px', height: '6px', borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        background: color, boxShadow: glow,
      }} />
    </div>
  );
}

// ── Arrow Glow ───────────────────────────────────────────────────────────────
function ArrowGlowCursor({ color, glow, scale, posRef, smoothPosRef }: CursorProps) {
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
  }, [posRef, smoothPosRef]);

  return (
    <div ref={ref} className="fixed pointer-events-none z-[9999]"
      style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg"
        style={{ filter: `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 8px ${color})` }}>
        <path d="M2 2L2 20L7 15L11 24L14 23L10 14L18 14L2 2Z"
          fill={color} stroke={color} strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default CustomCursor;
