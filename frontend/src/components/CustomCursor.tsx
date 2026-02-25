import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const trailPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onEnterInteractive = () => setIsHovering(true);
    const onLeaveInteractive = () => setIsHovering(false);

    const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], [tabindex]';

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest(interactiveSelectors)) {
        onEnterInteractive();
      } else {
        onLeaveInteractive();
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    const animate = () => {
      const { x, y } = posRef.current;
      const trail = trailPosRef.current;

      // Smooth trail
      trail.x += (x - trail.x) * 0.12;
      trail.y += (y - trail.y) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${trail.x - 16}px, ${trail.y - 16}px)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.x - 6}px, ${trail.y - 6}px)`;
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

  return (
    <>
      {/* Main dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full transition-transform duration-75"
        style={{
          background: isHovering ? '#00ff88' : '#00e5ff',
          boxShadow: isHovering
            ? '0 0 8px #00ff88, 0 0 16px #00ff88'
            : '0 0 8px #00e5ff, 0 0 16px #00e5ff',
          transform: `scale(${isClicking ? 0.5 : 1})`,
        }}
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] w-8 h-8 rounded-full border transition-all duration-100"
        style={{
          borderColor: isHovering ? '#00ff88' : '#00e5ff',
          boxShadow: isHovering
            ? '0 0 6px #00ff88'
            : '0 0 6px #00e5ff',
          transform: `scale(${isHovering ? 1.5 : isClicking ? 0.8 : 1})`,
          opacity: isHovering ? 0.9 : 0.6,
        }}
      />
      {/* Subtle trail dot */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997] w-3 h-3 rounded-full"
        style={{
          background: 'rgba(0, 229, 255, 0.15)',
          boxShadow: '0 0 4px rgba(0, 229, 255, 0.3)',
        }}
      />
    </>
  );
};

export default CustomCursor;
