import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export const CustomCursor: React.FC = () => {
  const { theme } = useTheme();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position refs for 0-render 144Hz GPU-accelerated motion
  const mousePos = useRef({ x: -100, y: -100 });
  const reticlePos = useRef({ x: -100, y: -100 });
  const isClickingRef = useRef(false);

  useEffect(() => {
    // Detect touch device and disable custom cursor
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instant hardware-accelerated update for the core dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%) scale(${isClickingRef.current ? 0.7 : 1})`;
      }
    };

    const onMouseDown = () => {
      isClickingRef.current = true;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%) scale(0.7)`;
      }
    };

    const onMouseUp = () => {
      isClickingRef.current = false;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%) scale(1)`;
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.closest('input') !== null ||
        target.closest('textarea') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // RAF loop for spring physics smooth reticle ring interpolation (0 React re-renders)
    let animId: number;
    const lerp = () => {
      reticlePos.current.x += (mousePos.current.x - reticlePos.current.x) * 0.22;
      reticlePos.current.y += (mousePos.current.y - reticlePos.current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${reticlePos.current.x}px, ${reticlePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(lerp);
    };

    animId = requestAnimationFrame(lerp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      {/* 1. Precision Luminous Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform"
        style={{
          transform: `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className="rounded-full transition-all duration-150 w-2 h-2"
          style={{
            backgroundColor: isHovering ? theme.cursorRing : theme.cursorColor,
            boxShadow: `0 0 12px ${isHovering ? theme.cursorRing : theme.cursorColor}`,
          }}
        />
      </div>

      {/* 2. Magnetic Tactical Reticle HUD Ring with 4 Corner Brackets */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
        style={{
          transform: `translate3d(${reticlePos.current.x}px, ${reticlePos.current.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        <div
          className={`relative rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
            isHovering ? 'w-12 h-12' : 'w-8 h-8'
          }`}
          style={{
            border: `1px solid ${isHovering ? `${theme.cursorColor}cc` : `${theme.cursorRing}55`}`,
            backgroundColor: `${theme.cursorColor}15`,
            boxShadow: `0 0 20px ${theme.cursorColor}40`,
          }}
        >
          {/* Subtle Rotating Tactical Crosshair / Corner Brackets */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              isHovering ? 'rotate-45 scale-110' : 'rotate-0 scale-95'
            }`}
          >
            {/* Top tick */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1.5" style={{ backgroundColor: theme.cursorColor }}></div>
            {/* Bottom tick */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] h-1.5" style={{ backgroundColor: theme.cursorColor }}></div>
            {/* Left tick */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] w-1.5" style={{ backgroundColor: theme.cursorColor }}></div>
            {/* Right tick */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1.5px] w-1.5" style={{ backgroundColor: theme.cursorColor }}></div>
          </div>
        </div>
      </div>
    </>
  );
};
