import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  twinkleDir: number;
  colorBase: string;
}

export const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    const starPalettes = [
      'rgba(34, 211, 238,',  // Cyan / Aqua
      'rgba(52, 211, 153,',  // Aurora Emerald
      'rgba(241, 245, 249,', // Starlight White
      'rgba(56, 189, 248,',  // Electric Sky Blue
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor((window.innerWidth * window.innerHeight) / 4500);
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.2,
          speed: Math.random() * 0.015 + 0.005,
          twinkleDir: Math.random() > 0.5 ? 1 : -1,
          colorBase: starPalettes[Math.floor(Math.random() * starPalettes.length)],
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Organic twinkle
        star.alpha += star.speed * star.twinkleDir;
        if (star.alpha >= 0.9) {
          star.alpha = 0.9;
          star.twinkleDir = -1;
        } else if (star.alpha <= 0.15) {
          star.alpha = 0.15;
          star.twinkleDir = 1;
        }

        ctx.fillStyle = `${star.colorBase} ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
