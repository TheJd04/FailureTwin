"use client";

import React, { useRef, useEffect } from 'react';

export default function NetworkBackground({ hueOffset = 210, hueSpread = 25 }: { hueOffset?: number; hueSpread?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const targetRef = useRef({ offset: hueOffset, spread: hueSpread });

  useEffect(() => {
    targetRef.current = { offset: hueOffset, spread: hueSpread };
  }, [hueOffset, hueSpread]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width: number, height: number, dpr: number;
    let nodes: {x: number, y: number, vx: number, vy: number, hueFrac: number}[] = [];
    let animId: number | null = null;
    const current = { ...targetRef.current };
    const LINK_DIST = 130;
    const MOUSE_RADIUS = 170;

    function buildNodes() {
      const count = Math.min(140, Math.round((width * height) / 20000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        hueFrac: Math.random(),
      }));
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }
    resize();
    window.addEventListener('resize', resize);

    function handleMove(e: MouseEvent | TouchEvent) {
      const touch = 'touches' in e ? e.touches[0] : null;
      mouseRef.current.x = touch ? touch.clientX : (e as MouseEvent).clientX;
      mouseRef.current.y = touch ? touch.clientY : (e as MouseEvent).clientY;
    }
    function handleLeave() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    }
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true } as unknown as EventListenerOptions);
    window.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchend', handleLeave);

    function draw() {
      current.offset += (targetRef.current.offset - current.offset) * 0.04;
      current.spread += (targetRef.current.spread - current.spread) * 0.04;

      ctx!.clearRect(0, 0, width, height);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const force = (1 - dist / MOUSE_RADIUS) * 1.7;
          const inv = 1 / (dist || 1);
          n.x += dx * inv * force;
          n.y += dy * inv * force;
        }
      });

      ctx!.globalCompositeOperation = 'lighter';

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const hue = current.offset + ((a.hueFrac + b.hueFrac) * 0.5) * current.spread;
            ctx!.strokeStyle = `hsla(${hue}, 75%, 62%, ${(1 - dist / LINK_DIST) * 0.35})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
        const dxm = a.x - mx, dym = a.y - my;
        const dm = Math.sqrt(dxm * dxm + dym * dym);
        if (dm < MOUSE_RADIUS) {
          const hue = current.offset + a.hueFrac * current.spread;
          ctx!.strokeStyle = `hsla(${hue}, 80%, 66%, ${(1 - dm / MOUSE_RADIUS) * 0.55})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(a.x, a.y);
          ctx!.lineTo(mx, my);
          ctx!.stroke();
        }
      }

      nodes.forEach(n => {
        const hue = current.offset + n.hueFrac * current.spread;
        ctx!.beginPath();
        ctx!.fillStyle = `hsla(${hue}, 80%, 66%, 0.8)`;
        ctx!.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx!.fill();
      });

      ctx!.globalCompositeOperation = 'source-over';
    }

    function cleanup() {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('touchend', handleLeave);
    }

    if (reduceMotion) {
      draw();
      return cleanup;
    }

    function frame() {
      draw();
      animId = requestAnimationFrame(frame);
    }
    animId = requestAnimationFrame(frame);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className="ft-particle-canvas fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" aria-hidden="true" />;
}
