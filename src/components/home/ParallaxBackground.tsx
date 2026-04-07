'use client';

import { useEffect, useState } from 'react';

export function ParallaxBackground() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Background image layer — moves with parallax */}
      <div
        className="absolute inset-[-40px] bg-cover bg-center transition-transform duration-300 ease-out"
        style={{
          backgroundImage: `url('/home-bg.jpg')`,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(1.05)`,
        }}
      />
      {/* Light overlay for card readability */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
    </div>
  );
}
