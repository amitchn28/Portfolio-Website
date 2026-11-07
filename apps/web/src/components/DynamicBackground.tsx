import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export const DynamicBackground: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    resize();

    // Gliding energy pulses on wave strands
    const particles = [
      { streamIdx: 0, strandIdx: 0, progress: 0.15, speed: 0.0007 },
      { streamIdx: 0, strandIdx: 1, progress: 0.65, speed: 0.0009 },
      { streamIdx: 1, strandIdx: 0, progress: 0.35, speed: 0.0008 },
      { streamIdx: 1, strandIdx: 2, progress: 0.85, speed: 0.0006 },
    ];

    const render = () => {
      time += 0.006;
      // Smooth mouse follow lerp
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;

      // Define 2 Harmonic Wave Stream Bundles (refined, elegant, non-junky)
      // Stream 0: Primary Upper-Mid Flow (e.g. Violet/Magenta in Cyber theme)
      // Stream 1: Secondary Lower-Mid Flow (e.g. Cyan/Emerald in Cyber theme)
      const streams = [
        {
          baseY: h * 0.42,
          primaryColor: theme.canvasOrbs.orb1,
          secondaryColor: theme.canvasOrbs.orb2,
          amplitude: 38,
          frequency: 0.0015,
          speed: 1.0,
          strands: [
            { offset: -16, phase: 0.0, opacity: 0.22, lineWidth: 1.8 },
            { offset: 0, phase: 0.6, opacity: 0.35, lineWidth: 2.2 },
            { offset: 16, phase: 1.2, opacity: 0.18, lineWidth: 1.5 },
          ],
        },
        {
          baseY: h * 0.68,
          primaryColor: theme.canvasOrbs.orb2,
          secondaryColor: theme.canvasOrbs.orb3,
          amplitude: 44,
          frequency: 0.0012,
          speed: 0.75,
          strands: [
            { offset: -18, phase: 0.4, opacity: 0.20, lineWidth: 1.6 },
            { offset: 0, phase: 1.1, opacity: 0.32, lineWidth: 2.0 },
            { offset: 18, phase: 1.8, opacity: 0.16, lineWidth: 1.4 },
          ],
        },
      ];

      // Helper function to calculate Y for a given stream, strand, and X coordinate
      const getWaveY = (stream: typeof streams[0], strand: typeof streams[0]['strands'][0], x: number) => {
        const mouseDist = Math.hypot(x - mouseX, stream.baseY - mouseY);
        const mouseInfluence = Math.max(0, 1 - mouseDist / 420) * 28;

        // Multi-frequency harmonic undulation (silky organic flow)
        const harm1 = Math.sin(x * stream.frequency + time * stream.speed + strand.phase) * stream.amplitude;
        const harm2 = Math.cos(x * (stream.frequency * 0.65) - time * (stream.speed * 0.5) + strand.offset * 0.05) * (stream.amplitude * 0.4);
        const harm3 = Math.sin(x * (stream.frequency * 1.8) + time * 0.8) * 8;

        return stream.baseY + strand.offset + harm1 + harm2 + harm3 - mouseInfluence;
      };

      // 1. Draw Each Stream with Ethereal Ribbon Fill & Layered Strands
      streams.forEach((stream) => {
        // Step A: Draw soft translucent ribbon fill between top and bottom strand
        const topStrand = stream.strands[0];
        const bottomStrand = stream.strands[stream.strands.length - 1];

        ctx.beginPath();
        // Top edge left-to-right
        for (let x = 0; x <= w; x += 12) {
          const y = getWaveY(stream, topStrand, x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        // Bottom edge right-to-left
        for (let x = w; x >= 0; x -= 12) {
          const y = getWaveY(stream, bottomStrand, x);
          ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Horizontal gradient fill with soft fade-out at edges
        const ribbonGrad = ctx.createLinearGradient(0, stream.baseY, w, stream.baseY);
        ribbonGrad.addColorStop(0, 'transparent');
        ribbonGrad.addColorStop(0.12, `${stream.primaryColor}0d`); // ~5% opacity
        ribbonGrad.addColorStop(0.5, `${stream.secondaryColor}1a`);  // ~10% opacity
        ribbonGrad.addColorStop(0.88, `${stream.primaryColor}0d`);
        ribbonGrad.addColorStop(1, 'transparent');

        ctx.fillStyle = ribbonGrad;
        ctx.fill();

        // Step B: Draw the Individual Luminous Strands
        stream.strands.forEach((strand, sIdx) => {
          ctx.beginPath();

          for (let x = 0; x <= w; x += 8) {
            const y = getWaveY(stream, strand, x);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Strand color gradient across viewport with soft edge fade
          const strandGrad = ctx.createLinearGradient(0, stream.baseY, w, stream.baseY);
          strandGrad.addColorStop(0, 'transparent');
          strandGrad.addColorStop(0.08, `${sIdx % 2 === 0 ? stream.primaryColor : stream.secondaryColor}30`);
          strandGrad.addColorStop(0.5, `${sIdx % 2 === 0 ? stream.primaryColor : stream.secondaryColor}`);
          strandGrad.addColorStop(0.92, `${sIdx % 2 === 0 ? stream.primaryColor : stream.secondaryColor}30`);
          strandGrad.addColorStop(1, 'transparent');

          ctx.strokeStyle = strandGrad;
          ctx.globalAlpha = strand.opacity;
          ctx.lineWidth = strand.lineWidth;
          ctx.shadowBlur = 14;
          ctx.shadowColor = sIdx % 2 === 0 ? stream.primaryColor : stream.secondaryColor;
          ctx.stroke();
        });
      });

      // 2. Gliding Luminous Energy Pulses (subtle, ethereal glow beads)
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) p.progress = 0;

        const currentStream = streams[p.streamIdx];
        const currentStrand = currentStream.strands[p.strandIdx];
        const px = p.progress * w;
        const py = getWaveY(currentStream, currentStrand, px);

        // Edge fade multiplier so particles fade gracefully at screen boundaries
        const edgeFade = Math.sin(p.progress * Math.PI);

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.shadowColor = currentStream.primaryColor;
        ctx.globalAlpha = 0.85 * edgeFade;
        ctx.fill();
        ctx.restore();
      });

      // 3. Interactive Ambient Cursor Light Pool
      const cursorGradient = ctx.createRadialGradient(
        mouseX,
        mouseY,
        0,
        mouseX,
        mouseY,
        340
      );
      cursorGradient.addColorStop(0, `${theme.canvasOrbs.orb1}22`);
      cursorGradient.addColorStop(0.5, `${theme.canvasOrbs.orb2}10`);
      cursorGradient.addColorStop(1, 'transparent');

      ctx.globalAlpha = 0.85;
      ctx.fillStyle = cursorGradient;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 340, 0, Math.PI * 2);
      ctx.fill();

      // Reset canvas context states
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Fluid Luminous Glowing Mesh Orbs (Hardware-Accelerated CSS) */}
      <div
        className="absolute -top-[10%] -left-[10%] w-[55vw] h-[55vw] rounded-full blur-[110px] opacity-45 mix-blend-screen animate-pulse-slow transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${theme.canvasOrbs.orb1} 0%, ${theme.canvasOrbs.orb2} 50%, transparent 75%)`,
        }}
      />

      <div
        className="absolute top-[35%] -right-[15%] w-[50vw] h-[50vw] rounded-full blur-[130px] opacity-40 mix-blend-screen transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${theme.canvasOrbs.orb2} 0%, ${theme.canvasOrbs.orb3} 50%, transparent 75%)`,
          animation: 'pulse 8s ease-in-out infinite alternate',
        }}
      />

      <div
        className="absolute -bottom-[15%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-35 mix-blend-screen transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${theme.canvasOrbs.orb3} 0%, ${theme.canvasOrbs.orb1} 50%, transparent 75%)`,
          animation: 'pulse 10s ease-in-out infinite alternate',
        }}
      />

      {/* Futuristic Geometric Vector Grid Layer (Subtle 48px blueprint matrix) */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${theme.canvasOrbs.orb1} 1px, transparent 1px), linear-gradient(90deg, ${theme.canvasOrbs.orb1} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Dynamic Luminous Wave Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
};
