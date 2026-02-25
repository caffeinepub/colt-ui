import React, { useEffect, useRef } from 'react';
import { BackgroundStyle } from '../backend';

interface AnimatedBackgroundProps {
  backgroundStyle: BackgroundStyle;
}

const IMAGE_BACKGROUNDS = new Set([
  BackgroundStyle.neonCity,
  BackgroundStyle.spaceNebula,
  BackgroundStyle.cyberForest,
  BackgroundStyle.abstractGlitch,
  BackgroundStyle.darkOcean,
]);

export default function AnimatedBackground({ backgroundStyle }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  // Don't render canvas for image backgrounds
  if (IMAGE_BACKGROUNDS.has(backgroundStyle)) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color?: string; char?: string; speed?: number }> = [];

    const initParticles = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);

      if (backgroundStyle === BackgroundStyle.particleGrid) {
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.2,
          });
        }
      } else if (backgroundStyle === BackgroundStyle.neonRain) {
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: Math.random() * 3 + 1,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.6 + 0.2,
            color: ['#00ffff', '#ff00ff', '#00ff88'][Math.floor(Math.random() * 3)],
          });
        }
      } else if (backgroundStyle === BackgroundStyle.matrixCode) {
        const cols = Math.floor(canvas.width / 20);
        for (let i = 0; i < cols; i++) {
          particles.push({
            x: i * 20,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: Math.random() * 3 + 1,
            size: 14,
            alpha: Math.random() * 0.8 + 0.2,
            char: String.fromCharCode(0x30A0 + Math.random() * 96),
          });
        }
      } else if (backgroundStyle === BackgroundStyle.starfield) {
        for (let i = 0; i < count * 2; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0,
            vy: Math.random() * 0.5 + 0.1,
            size: Math.random() * 2 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
          });
        }
      } else if (backgroundStyle === BackgroundStyle.cyberHexGrid) {
        for (let i = 0; i < count / 2; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 20 + 10,
            alpha: Math.random() * 0.15 + 0.05,
          });
        }
      }
    };

    initParticles();

    const animate = () => {
      if (backgroundStyle === BackgroundStyle.solidDark) {
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.fillStyle = 'rgba(5, 5, 16, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        if (backgroundStyle === BackgroundStyle.particleGrid) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 255, ${p.alpha})`;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        } else if (backgroundStyle === BackgroundStyle.neonRain) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 15);
          ctx.strokeStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = p.size;
          ctx.stroke();
          p.y += p.vy;
          if (p.y > canvas.height) p.y = -20;
        } else if (backgroundStyle === BackgroundStyle.matrixCode) {
          ctx.fillStyle = `rgba(0, 255, 70, ${p.alpha})`;
          ctx.font = `${p.size}px monospace`;
          p.char = String.fromCharCode(0x30A0 + Math.random() * 96);
          ctx.fillText(p.char, p.x, p.y);
          p.y += p.vy;
          if (p.y > canvas.height) p.y = 0;
        } else if (backgroundStyle === BackgroundStyle.starfield) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
          ctx.fill();
          p.y += p.vy;
          if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * canvas.width; }
        } else if (backgroundStyle === BackgroundStyle.cyberHexGrid) {
          ctx.beginPath();
          const s = p.size;
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = p.x + s * Math.cos(angle);
            const hy = p.y + s * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(0, 255, 255, ${p.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -50 || p.x > canvas.width + 50) p.vx *= -1;
          if (p.y < -50 || p.y > canvas.height + 50) p.vy *= -1;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    if (backgroundStyle === BackgroundStyle.solidDark) {
      animate();
    } else {
      animFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [backgroundStyle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
