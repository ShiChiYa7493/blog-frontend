'use client';

import { useEffect, useRef } from 'react';

type ParticleType = 'petal' | 'snowflake' | 'ice';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: ParticleType;
  color: string;
}

const PETAL_COLORS = ['#FFB7C5', '#FFC8D6', '#B8D4E8', '#D0E8FF', '#FFFFFF'];

export function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create mixed particles: sakura petals + blue/white petals + snowflakes
    // 25 sakura petals
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 22 + 18,
        speedX: Math.random() * 1.5 - 0.5,
        speedY: Math.random() * 1.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.4 + 0.5,
        type: 'petal',
        color: PETAL_COLORS[Math.floor(Math.random() * 3)], // pink variants
      });
    }

    // 10 blue/white petals
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 18 + 14,
        speedX: Math.random() * 1.2 - 0.4,
        speedY: Math.random() * 1.2 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.3 + 0.4,
        type: 'petal',
        color: PETAL_COLORS[3 + Math.floor(Math.random() * 2)], // blue/white
      });
    }

    // 15 snowflakes (large, visible)
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 10 + 10,
        speedX: Math.random() * 0.8 - 0.4,
        speedY: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        opacity: Math.random() * 0.3 + 0.6,
        type: 'snowflake',
        color: '#FFFFFF',
      });
    }

    // 10 ice crystals (glowing orbs)
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.4 + 0.15,
        rotation: 0,
        rotationSpeed: 0,
        opacity: Math.random() * 0.3 + 0.5,
        type: 'ice',
        color: '#FFFFFF',
      });
    }

    const drawPetal = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      // Petal shape
      ctx.beginPath();
      ctx.fillStyle = p.color;
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
      ctx.fillStyle = p.color === '#FFB7C5' ? '#FFC8D6' : 'rgba(255,255,255,0.6)';
      ctx.globalAlpha = p.opacity * 0.4;
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

    const drawSnowflake = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      // Outer glow
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 1.5);
      glow.addColorStop(0, 'rgba(200, 225, 255, 0.3)');
      glow.addColorStop(1, 'rgba(200, 225, 255, 0)');
      ctx.beginPath();
      ctx.fillStyle = glow;
      ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // 6-arm snowflake
      ctx.strokeStyle = 'rgba(220, 235, 255, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -p.size);
        ctx.stroke();
        // Branches
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.45);
        ctx.lineTo(p.size * 0.3, -p.size * 0.65);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.45);
        ctx.lineTo(-p.size * 0.3, -p.size * 0.65);
        ctx.stroke();
        // Tip dot
        ctx.beginPath();
        ctx.fillStyle = 'rgba(220, 235, 255, 0.9)';
        ctx.arc(0, -p.size, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(Math.PI / 3);
      }

      // Center dot
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawIce = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = p.opacity;

      // Outer glow
      const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
      outerGlow.addColorStop(0, 'rgba(150, 200, 255, 0.4)');
      outerGlow.addColorStop(0.5, 'rgba(150, 200, 255, 0.1)');
      outerGlow.addColorStop(1, 'rgba(150, 200, 255, 0)');
      ctx.beginPath();
      ctx.fillStyle = outerGlow;
      ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Core glow
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      coreGlow.addColorStop(0, 'rgba(200, 230, 255, 0.95)');
      coreGlow.addColorStop(0.4, 'rgba(180, 215, 255, 0.5)');
      coreGlow.addColorStop(1, 'rgba(180, 215, 255, 0)');
      ctx.beginPath();
      ctx.fillStyle = coreGlow;
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Movement
        if (p.type === 'snowflake' || p.type === 'ice') {
          // Snowflakes drift more gently with shimmer
          p.x += p.speedX + Math.sin(p.y * 0.008 + p.x * 0.005) * 0.3;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          // Subtle shimmer
          p.opacity = (Math.sin(Date.now() * 0.002 + p.x) * 0.15) + 0.45;
        } else {
          p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
        }

        // Reset when off screen
        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        // Draw based on type
        if (p.type === 'petal') drawPetal(p);
        else if (p.type === 'snowflake') drawSnowflake(p);
        else drawIce(p);
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
