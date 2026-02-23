'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Preloader.module.css';

const words = ['Hello', 'नमस्ते', 'Bonjour', 'こんにちは', 'Hola'];

// ── CODE BUGS (text snippets, syntax errors, code fragments)
const CODE_BUGS = [
  '{}', '[];', 'null', 'undefined', '===', '!==', '=>',
  'NaN', '404', '...', '()', '??', '||', '&&', '--',
  '++', '/*', '*/', '//', '{{}}', '[][]', '0x0',
  'try{}', 'catch', 'throw', 'async', 'await', 'void',
  'return;', '>=', '<=', '!=', '%%', '$$', '@#!', '</>',
  '</>', '<br/>', '::', '->', '.map()', '.then()',
];

const NUM_BUGS = 36;

interface Bug {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
}

const BUG_COLORS = [
  'rgba(0,113,227,0.90)',
  'rgba(29,29,31,0.75)',
  'rgba(0,113,227,1.0)',
  'rgba(80,80,90,0.85)',
  'rgba(0,90,180,0.90)',
  'rgba(29,29,31,0.60)',
];

function createBugs(): Bug[] {
  return Array.from({ length: NUM_BUGS }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    text: CODE_BUGS[i % CODE_BUGS.length],
    size: 13 + Math.random() * 9,
    rotation: Math.random() * 40 - 20,
    rotSpeed: (Math.random() - 0.5) * 1.5,
    opacity: 0.72 + Math.random() * 0.23,
    color: BUG_COLORS[i % BUG_COLORS.length],
  }));
}

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'ready' | 'exit' | 'done'>('intro');
  const [wordIndex, setWordIndex] = useState(0);
  const [bugs, setBugs] = useState<Bug[]>(() => createBugs());
  const mouseRef = useRef({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Cycle greeting words
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex(prev => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Auto-show "ready" after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => setPhase('ready'), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate code bugs — they scatter away from cursor
  useEffect(() => {
    const FLEE_RADIUS = 14;
    const FLEE_FORCE = 0.65;
    const FRICTION = 0.96;
    const WANDER = 0.04;

    const animate = () => {
      setBugs(prev => prev.map(bug => {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        let { x, y, vx, vy, rotation, rotSpeed, ...rest } = bug;

        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < FLEE_RADIUS && dist > 0.1) {
          const force = (FLEE_RADIUS - dist) / FLEE_RADIUS * FLEE_FORCE;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
        }

        vx += (Math.random() - 0.5) * WANDER;
        vy += (Math.random() - 0.5) * WANDER;
        vx *= FRICTION;
        vy *= FRICTION;

        x += vx;
        y += vy;

        if (x < 0) { x = 0; vx = Math.abs(vx) * 0.5; }
        if (x > 100) { x = 100; vx = -Math.abs(vx) * 0.5; }
        if (y < 0) { y = 0; vy = Math.abs(vy) * 0.5; }
        if (y > 100) { y = 100; vy = -Math.abs(vy) * 0.5; }

        rotation += rotSpeed + (vx + vy) * 2;

        return { ...rest, x, y, vx, vy, rotation, rotSpeed };
      }));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const enter = useCallback(() => {
    if (phase !== 'ready') return;
    setPhase('exit');
    setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 1200);
  }, [phase, onComplete]);

  // Input listeners
  useEffect(() => {
    if (phase !== 'ready') return;

    const handleWheel = (e: WheelEvent) => { if (e.deltaY > 10) enter(); };
    const handleTouchStart = (e: TouchEvent) => { (containerRef.current as any).__touchY = e.touches[0].clientY; };
    const handleTouchEnd = (e: TouchEvent) => {
      const startY = (containerRef.current as any)?.__touchY ?? 0;
      if (startY - e.changedTouches[0].clientY > 50) enter();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); enter(); }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, enter]);

  if (phase === 'done') return null;

  return (
    <div ref={containerRef} className={`${styles.preloader} ${phase === 'exit' ? styles.exit : ''}`}>
      {/* CODE BUG text fragments that scatter from cursor */}
      <div className={styles.bugContainer}>
        {bugs.map(bug => (
          <span
            key={bug.id}
            className={styles.bug}
            style={{
              left: `${bug.x}%`,
              top: `${bug.y}%`,
              fontSize: `${bug.size}px`,
              opacity: bug.opacity,
              color: bug.color,
              transform: `translate(-50%, -50%) rotate(${bug.rotation}deg)`,
            }}
          >
            {bug.text}
          </span>
        ))}
      </div>

      {/* Glass card */}
      <div className={styles.glassCard}>
        <div className={styles.greetingWrap}>
          <span key={wordIndex} className={styles.greeting}>
            {words[wordIndex]}
          </span>
        </div>

        <div className={styles.nameWrap}>
          <h1 className={styles.name}>
            <span className={styles.firstName}>Lakshya</span>{' '}
            <span className={styles.lastName}>Purohit</span>
          </h1>
        </div>

        <div className={styles.roleWrap}>
          <span className={styles.role}>Software Developer &amp; System Architect</span>
        </div>

        {phase === 'ready' && (
          <div className={styles.swipePrompt}>
            <div className={styles.swipeArrow}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </div>
            <span>Swipe up to enter</span>
          </div>
        )}
      </div>

      <div className={styles.bottomTag}>
        <span className={styles.tagDot} />
        Portfolio 2026
      </div>
    </div>
  );
}
