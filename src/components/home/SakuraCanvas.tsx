'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

export function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const petals: Petal[] = [];
    const petalCount = 40;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize petals
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 12 + 6,
        speedX: Math.random() * 1.5 - 0.5,
        speedY: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      // Draw a simple petal shape
      ctx.beginPath();
      ctx.fillStyle = '#FFB7C5';
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        p.size / 2, -p.size / 2,
        p.size, -p.size / 4,
        p.size, 0
      );
      ctx.bezierCurveTo(
        p.size, p.size / 4,
        p.size / 2, p.size / 2,
        0, 0
      );
      ctx.fill();

      // Inner highlight
      ctx.beginPath();
      ctx.fillStyle = '#FFC8D6';
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.moveTo(p.size * 0.2, 0);
      ctx.bezierCurveTo(
        p.size * 0.4, -p.size * 0.2,
        p.size * 0.6, -p.size * 0.1,
        p.size * 0.6, 0
      );
      ctx.bezierCurveTo(
        p.size * 0.6, p.size * 0.1,
        p.size * 0.4, p.size * 0.2,
        p.size * 0.2, 0
      );
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p) => {
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Reset petal when it goes off screen
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        drawPetal(p);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}
