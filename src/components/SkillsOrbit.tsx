'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SkillsOrbit.module.css';

/* ═══════════════════════════════════════════════
   SKILLS DATA
   ═══════════════════════════════════════════════ */
const SKILLS = [
    { label: 'Next.js', icon: '▲' },
    { label: 'ASP.NET', icon: '🔷' },
    { label: 'Angular', icon: '🅰️' },
    { label: 'React', icon: '⚛️' },
    { label: 'Docker', icon: '🐳' },
    { label: 'PostgreSQL', icon: '🐘' },
    { label: 'Python', icon: '🐍' },
    { label: 'TypeScript', icon: 'TS' },
    { label: 'Node.js', icon: '🟢' },
    { label: 'WebRTC', icon: '📡' },
    { label: 'C#', icon: '#️⃣' },
    { label: 'SQL Server', icon: '🗄️' },
    { label: 'Git', icon: '🔀' },
    { label: 'Flask', icon: '🧪' },
    { label: 'Redis', icon: '🔴' },
    { label: 'MongoDB', icon: '🍃' },
];

interface Ball {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    label: string;
    icon: string;
    glowing: boolean;
}

const BALL_RADIUS_DESKTOP = 38;
const BALL_RADIUS_MOBILE = 30;
const FLEE_RADIUS = 120;
const FLEE_FORCE = 1.8;
const FRICTION = 0.985;
const WANDER = 0.08;
const COLLISION_DAMPING = 0.7;

function createBalls(containerWidth: number, containerHeight: number): Ball[] {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
    const r = isMobile ? BALL_RADIUS_MOBILE : BALL_RADIUS_DESKTOP;
    return SKILLS.map((skill, i) => ({
        id: i,
        x: r + Math.random() * (containerWidth - r * 2),
        y: r + Math.random() * (containerHeight - r * 2),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: r,
        label: skill.label,
        icon: skill.icon,
        glowing: false,
    }));
}

export default function SkillsOrbit() {
    const arenaRef = useRef<HTMLDivElement>(null);
    const [balls, setBalls] = useState<Ball[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);
    const initialized = useRef(false);

    /* ── Init balls once arena is measured ── */
    useEffect(() => {
        if (!arenaRef.current || initialized.current) return;
        const rect = arenaRef.current.getBoundingClientRect();
        setBalls(createBalls(rect.width, rect.height));
        initialized.current = true;
    }, []);

    /* ── Track mouse ── */
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!arenaRef.current) return;
        const rect = arenaRef.current.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseRef.current = { x: -9999, y: -9999 };
    }, []);

    /* ── Physics loop ── */
    useEffect(() => {
        if (balls.length === 0) return;

        const animate = () => {
            setBalls(prev => {
                if (!arenaRef.current) return prev;
                const rect = arenaRef.current.getBoundingClientRect();
                const W = rect.width;
                const H = rect.height;
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                const next = prev.map(ball => ({ ...ball }));

                for (let i = 0; i < next.length; i++) {
                    const b = next[i];

                    /* Mouse repulsion */
                    const dmx = b.x - mx;
                    const dmy = b.y - my;
                    const distMouse = Math.sqrt(dmx * dmx + dmy * dmy);
                    b.glowing = distMouse < FLEE_RADIUS * 1.2;

                    if (distMouse < FLEE_RADIUS && distMouse > 0.1) {
                        const force = ((FLEE_RADIUS - distMouse) / FLEE_RADIUS) * FLEE_FORCE;
                        b.vx += (dmx / distMouse) * force;
                        b.vy += (dmy / distMouse) * force;
                    }

                    /* Ball-ball collision */
                    for (let j = i + 1; j < next.length; j++) {
                        const o = next[j];
                        const dx = b.x - o.x;
                        const dy = b.y - o.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = b.radius + o.radius;

                        if (dist < minDist && dist > 0.1) {
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const overlap = (minDist - dist) / 2;

                            /* Separate */
                            b.x += nx * overlap;
                            b.y += ny * overlap;
                            o.x -= nx * overlap;
                            o.y -= ny * overlap;

                            /* Bounce */
                            const relVx = b.vx - o.vx;
                            const relVy = b.vy - o.vy;
                            const dot = relVx * nx + relVy * ny;

                            if (dot > 0) {
                                b.vx -= dot * nx * COLLISION_DAMPING;
                                b.vy -= dot * ny * COLLISION_DAMPING;
                                o.vx += dot * nx * COLLISION_DAMPING;
                                o.vy += dot * ny * COLLISION_DAMPING;
                            }
                        }
                    }

                    /* Wander */
                    b.vx += (Math.random() - 0.5) * WANDER;
                    b.vy += (Math.random() - 0.5) * WANDER;

                    /* Friction */
                    b.vx *= FRICTION;
                    b.vy *= FRICTION;

                    /* Move */
                    b.x += b.vx;
                    b.y += b.vy;

                    /* Wall bounce */
                    if (b.x < b.radius) { b.x = b.radius; b.vx = Math.abs(b.vx) * 0.6; }
                    if (b.x > W - b.radius) { b.x = W - b.radius; b.vx = -Math.abs(b.vx) * 0.6; }
                    if (b.y < b.radius) { b.y = b.radius; b.vy = Math.abs(b.vy) * 0.6; }
                    if (b.y > H - b.radius) { b.y = H - b.radius; b.vy = -Math.abs(b.vy) * 0.6; }
                }

                return next;
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [balls.length]);

    return (
        <section className={styles.section} id="skills" aria-label="Technical Skills">
            <div className={styles.inner}>
                <header className={styles.header}>
                    <span className="section-label">Skills</span>
                    <h2 className={styles.heading}>
                        Technologies I <span className={styles.headingAccent}>work with</span>
                    </h2>
                    <p className={styles.srOnly}>
                        Lakshya Purohit&apos;s technical skills include Next.js, ASP.NET, Angular, React, Docker, PostgreSQL, Python, TypeScript, Node.js, WebRTC, C#, SQL Server, Git, Flask, Redis, and MongoDB.
                    </p>
                </header>

                <div
                    className={styles.arena}
                    ref={arenaRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    role="img"
                    aria-label={`Interactive skill visualization showing: ${SKILLS.map(s => s.label).join(', ')}`}
                >
                    {balls.map(ball => (
                        <div
                            key={ball.id}
                            className={`${styles.ball} ${ball.glowing ? styles.ballGlow : ''}`}
                            style={{
                                width: ball.radius * 2,
                                height: ball.radius * 2,
                                transform: `translate(${ball.x - ball.radius}px, ${ball.y - ball.radius}px)`,
                            }}
                        >
                            <div className={styles.ballInner}>
                                <span className={styles.ballIcon}>{ball.icon}</span>
                                <span className={styles.ballLabel}>{ball.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
