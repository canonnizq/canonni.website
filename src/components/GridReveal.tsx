import { useEffect, useRef } from 'react';
import styles from '../styles/GridReveal.module.css';

// Spacing between dots (CSS px), glow radius around the pointer, and easing speed.
const CELL = 44;
const GLOW_RADIUS = 190;
const EASE_SPEED = 8.5;
// Resting dot radius and how much dots grow as the glow approaches.
const DOT_RADIUS = 1.15;
const DOT_GROWTH = 1.5;

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function readCssVar(name: string, fallback: string): [number, number, number] {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value.startsWith('#') ? hexToRgb(value) : hexToRgb(fallback);
}

export default function GridReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = {
      background: readCssVar('--background-normal', '#222831'),
      line: readCssVar('--background-subtle', '#393e46'),
      glow: readCssVar('--text-normal', '#dfd0b8'),
    };

    // Resting dots are static, so paint them once into an offscreen canvas and
    // blit it each frame — far cheaper than redrawing thousands of arcs.
    const base = document.createElement('canvas');
    const baseCtx = base.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    const paintBase = () => {
      if (!baseCtx) return;
      baseCtx.fillStyle = `rgb(${palette.background.join(',')})`;
      baseCtx.fillRect(0, 0, width, height);

      baseCtx.fillStyle = `rgba(${palette.line.join(',')}, 0.55)`;
      const cols = Math.floor(width / CELL);
      const rows = Math.floor(height / CELL);
      for (let col = 0; col <= cols; col++) {
        for (let row = 0; row <= rows; row++) {
          baseCtx.beginPath();
          baseCtx.arc(col * CELL, row * CELL, DOT_RADIUS, 0, Math.PI * 2);
          baseCtx.fill();
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      base.width = canvas.width;
      base.height = canvas.height;
      baseCtx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintBase();
    };

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let hasPointer = false;

    // How close the eased glow is to the centered content, used to lift the
    // text so it stays readable while the light passes underneath it.
    let centerRect: DOMRect | null = null;
    let contentLift = 0;
    let lastLift = -1;

    const refreshCenter = () => {
      centerRect = document.querySelector<HTMLElement>('.center')?.getBoundingClientRect() ?? null;
    };

    const onMove = (e: MouseEvent) => {
      if (!hasPointer) {
        // Snap the glow to the pointer on first entry so it doesn't slide in.
        hasPointer = true;
        current.x = e.clientX;
        current.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onResize = () => {
      resize();
      refreshCenter();
      if (reduced) ctx.drawImage(base, 0, 0, width, height);
    };

    let raf = 0;
    let last = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-EASE_SPEED * dt);

      if (hasPointer) {
        current.x += (target.x - current.x) * k;
        current.y += (target.y - current.y) * k;

        if (centerRect) {
          const nx = Math.min(Math.max(current.x, centerRect.left), centerRect.right);
          const ny = Math.min(Math.max(current.y, centerRect.top), centerRect.bottom);
          const dist = Math.hypot(current.x - nx, current.y - ny);
          contentLift += (Math.max(0, 1 - dist / 220) - contentLift) * k;
          const rounded = Math.round(contentLift * 100) / 100;
          if (rounded !== lastLift) {
            lastLift = rounded;
            document.documentElement.style.setProperty('--content-lift', rounded.toFixed(2));
          }
        }
      }

      ctx.drawImage(base, 0, 0, width, height);

      if (hasPointer) {
        // Soft ambient pool of light around the pointer.
        const poolR = GLOW_RADIUS * 1.35;
        const pool = ctx.createRadialGradient(
          current.x,
          current.y,
          0,
          current.x,
          current.y,
          poolR
        );
        pool.addColorStop(0, `rgba(${palette.glow.join(',')}, 0.1)`);
        pool.addColorStop(1, `rgba(${palette.glow.join(',')}, 0)`);
        ctx.fillStyle = pool;
        ctx.fillRect(0, 0, width, height);

        // Brighten and enlarge the dots near the pointer.
        const r = GLOW_RADIUS;
        const colStart = Math.max(0, Math.floor((current.x - r) / CELL));
        const colEnd = Math.min(Math.floor(width / CELL), Math.ceil((current.x + r) / CELL));
        const rowStart = Math.max(0, Math.floor((current.y - r) / CELL));
        const rowEnd = Math.min(Math.floor(height / CELL), Math.ceil((current.y + r) / CELL));

        for (let row = rowStart; row <= rowEnd; row++) {
          for (let col = colStart; col <= colEnd; col++) {
            const px = col * CELL;
            const py = row * CELL;
            const d = Math.hypot(px - current.x, py - current.y);
            if (d >= r) continue;

            const t = 1 - d / r;
            // Smoothstep falloff: soft at the edge, gentle near the center.
            const falloff = t * t * (3 - 2 * t);

            ctx.fillStyle = `rgba(${palette.glow.join(',')}, ${(falloff * 0.75).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(px, py, DOT_RADIUS + falloff * DOT_GROWTH, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      raf = requestAnimationFrame(render);
    };

    resize();
    refreshCenter();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', onResize);

    if (reduced) {
      ctx.drawImage(base, 0, 0, width, height);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.grid} aria-hidden="true" />;
}
