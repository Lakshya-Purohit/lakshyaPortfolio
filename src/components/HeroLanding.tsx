'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './HeroLanding.module.css';

/* ═══════════════════════════════════════════════
   CODE DATA (from CodeEditorScene)
   ═══════════════════════════════════════════════ */
const codeLines = [
    { indent: 0, tokens: [{ text: 'const', type: 'keyword' }, { text: ' developer ', type: 'variable' }, { text: '=', type: 'operator' }, { text: ' {', type: 'bracket' }] },
    { indent: 1, tokens: [{ text: 'name', type: 'property' }, { text: ':', type: 'operator' }, { text: ' "Lakshya Purohit"', type: 'string' }, { text: ',', type: 'plain' }] },
    { indent: 1, tokens: [{ text: 'role', type: 'property' }, { text: ':', type: 'operator' }, { text: ' "Software Developer"', type: 'string' }, { text: ',', type: 'plain' }] },
    { indent: 1, tokens: [{ text: 'location', type: 'property' }, { text: ':', type: 'operator' }, { text: ' "Jaipur, India"', type: 'string' }, { text: ',', type: 'plain' }] },
    { indent: 1, tokens: [{ text: 'skills', type: 'property' }, { text: ':', type: 'operator' }, { text: ' [', type: 'bracket' }] },
    { indent: 2, tokens: [{ text: '"ASP.NET Core"', type: 'string' }, { text: ',', type: 'plain' }, { text: ' "Angular"', type: 'string' }, { text: ',', type: 'plain' }, { text: ' "WebRTC"', type: 'string' }, { text: ',', type: 'plain' }] },
    { indent: 2, tokens: [{ text: '"PostgreSQL"', type: 'string' }, { text: ',', type: 'plain' }, { text: ' "Docker"', type: 'string' }, { text: ',', type: 'plain' }, { text: ' "Python"', type: 'string' }] },
    { indent: 1, tokens: [{ text: ']', type: 'bracket' }, { text: ',', type: 'plain' }] },
    { indent: 1, tokens: [{ text: 'passions', type: 'property' }, { text: ':', type: 'operator' }, { text: ' [', type: 'bracket' }] },
    { indent: 2, tokens: [{ text: '"Backend Architecture"', type: 'string' }, { text: ',', type: 'plain' }] },
    { indent: 2, tokens: [{ text: '"Real-time Systems"', type: 'string' }, { text: ',', type: 'plain' }] },
    { indent: 2, tokens: [{ text: '"Computer Vision"', type: 'string' }] },
    { indent: 1, tokens: [{ text: ']', type: 'bracket' }, { text: ',', type: 'plain' }] },
    { indent: 0, tokens: [{ text: '};', type: 'bracket' }] },
    { indent: 0, tokens: [] },
    { indent: 0, tokens: [{ text: '// Building the future, one commit at a time', type: 'comment' }] },
    { indent: 0, tokens: [{ text: 'async function', type: 'keyword' }, { text: ' buildAmazingStuff', type: 'function' }, { text: '() {', type: 'bracket' }] },
    { indent: 1, tokens: [{ text: 'await', type: 'keyword' }, { text: ' developer', type: 'variable' }, { text: '.', type: 'plain' }, { text: 'init', type: 'function' }, { text: '();', type: 'bracket' }] },
    { indent: 1, tokens: [{ text: 'return', type: 'keyword' }, { text: ' developer', type: 'variable' }, { text: '.', type: 'plain' }, { text: 'craft', type: 'function' }, { text: '(', type: 'bracket' }, { text: '"excellence"', type: 'string' }, { text: ');', type: 'bracket' }] },
    { indent: 0, tokens: [{ text: '}', type: 'bracket' }] },
];

const tabs = [
    { name: 'portfolio.ts', active: true },
    { name: 'skills.json', active: false },
    { name: 'README.md', active: false },
];

const roles = ['Software Developer', 'Backend Architect', 'System Engineer'];

/* Block grid config */
const GRID_COLS = 20;
const GRID_ROWS = 14;
const BLOCK_RADIUS = 4;

/* ═══════════════════════════════════════════════ */

export default function HeroLanding() {
    const [currentRole, setCurrentRole] = useState(0);
    const [visibleLines, setVisibleLines] = useState(0);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [hoveredBlocks, setHoveredBlocks] = useState<Set<number>>(new Set());

    const gridRef = useRef<HTMLDivElement>(null);
    const mouseGridPos = useRef({ col: -1, row: -1 });
    const rafId = useRef<number>(0);
    const blockOpacities = useRef<Float32Array>(new Float32Array(GRID_COLS * GRID_ROWS));

    /* ── Role rotation ── */
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((prev) => (prev + 1) % roles.length);
        }, 2400);
        return () => clearInterval(interval);
    }, []);

    /* ── Open editor window on mount ── */
    useEffect(() => {
        const timer = setTimeout(() => setIsWindowOpen(true), 400);
        return () => clearTimeout(timer);
    }, []);

    /* ── Auto-type code lines ── */
    useEffect(() => {
        let line = 0;
        const interval = setInterval(() => {
            line++;
            if (line > codeLines.length) {
                clearInterval(interval);
                return;
            }
            setVisibleLines(line);
        }, 180);
        return () => clearInterval(interval);
    }, []);

    /* ── Block grid mouse tracking ── */
    const handleGridMouseMove = useCallback((e: React.MouseEvent) => {
        if (!gridRef.current) return;
        const rect = gridRef.current.getBoundingClientRect();
        const col = Math.floor(((e.clientX - rect.left) / rect.width) * GRID_COLS);
        const row = Math.floor(((e.clientY - rect.top) / rect.height) * GRID_ROWS);
        mouseGridPos.current = { col, row };
    }, []);

    const handleGridMouseLeave = useCallback(() => {
        mouseGridPos.current = { col: -100, row: -100 };
    }, []);

    /* ── Animate block opacities ── */
    useEffect(() => {
        const DECAY = 0.92;
        const animate = () => {
            const { col: mc, row: mr } = mouseGridPos.current;
            const newSet = new Set<number>();
            let changed = false;

            for (let r = 0; r < GRID_ROWS; r++) {
                for (let c = 0; c < GRID_COLS; c++) {
                    const idx = r * GRID_COLS + c;
                    const dist = Math.sqrt((c - mc) ** 2 + (r - mr) ** 2);
                    const target = dist < BLOCK_RADIUS ? Math.max(0, 1 - dist / BLOCK_RADIUS) : 0;

                    const current = blockOpacities.current[idx];
                    let next: number;
                    if (target > current) {
                        next = current + (target - current) * 0.3;
                    } else {
                        next = current * DECAY;
                    }
                    if (next < 0.01) next = 0;
                    if (Math.abs(next - current) > 0.005) changed = true;
                    blockOpacities.current[idx] = next;
                    if (next > 0.01) newSet.add(idx);
                }
            }
            if (changed) {
                setHoveredBlocks(new Set(newSet));
            }
            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId.current);
    }, []);

    return (
        <section className={styles.landing} id="about" aria-label="About Lakshya Purohit">
            <div className={styles.inner}>
                {/* ═══ LEFT — Hero Content ═══ */}
                <div className={styles.heroCol}>
                    {/* Top row: Photo + Intro side-by-side */}
                    <div className={styles.topRow}>
                        <div className={styles.imageWrapper}>
                            <div className={styles.imageFrame}>
                                <Image
                                    src="/profile.jpg"
                                    alt="Lakshya Purohit"
                                    className={styles.profileImg}
                                    width={400}
                                    height={400}
                                    priority
                                />
                                <div className={styles.imageOverlay} />
                            </div>
                        </div>

                        <div className={styles.introCol}>
                            <div className={styles.greeting}>Hi there! I am</div>
                            <h1 className={styles.name}>
                                <span className={styles.firstName}>Lakshya</span>{' '}
                                <span className={styles.lastName}>
                                    Purohit<span className={styles.dot}>.</span>
                                </span>
                            </h1>
                            <div className={styles.statusBadge}>
                                <span className={styles.statusDot} />
                                Available for work
                            </div>
                        </div>
                    </div>

                    {/* Content below */}
                    <div className={styles.contentArea}>
                        {/* Rotating roles */}
                        <div className={styles.roleBox}>
                            {roles.map((role, idx) => (
                                <motion.span
                                    key={role}
                                    className={`${styles.role} ${idx === currentRole ? styles.roleActive : ''}`}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={idx === currentRole ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    {role}
                                </motion.span>
                            ))}
                        </div>

                        <p className={styles.bio}>
                            I specialize in building <strong>scalable, high-performance</strong> enterprise
                            systems. Passionate about complex backend architectures, real-time communication,
                            and database optimization — engineering solutions that handle thousands of
                            concurrent users.
                        </p>

                        <div className={styles.ctaRow}>
                            <a href="mailto:lakshya.purohit.2105@gmail.com" className={styles.ctaPrimary}>
                                Let&apos;s Collaborate
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </a>
                            <a
                                href="https://docs.google.com/document/d/1QXMsRv8-HO6GgMjwXDKBD6rv7IirnCnm5zZBYpnHftI/export?format=pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaSecondary}
                            >
                                Download Resume
                            </a>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>2+</span>
                                <span className={styles.statLabel}>Years Experience</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNum}>10+</span>
                                <span className={styles.statLabel}>Projects Delivered</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.stat}>
                                <span className={styles.statNum}>70%</span>
                                <span className={styles.statLabel}>Performance Gain</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ═══ RIGHT — Code Editor ═══ */}
                <div className={styles.editorCol}>
                    {/* Block Grid Background */}
                    <div
                        className={styles.blockGrid}
                        ref={gridRef}
                        onMouseMove={handleGridMouseMove}
                        onMouseLeave={handleGridMouseLeave}
                        style={{
                            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                        }}
                    >
                        {Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => (
                            <div
                                key={i}
                                className={styles.block}
                                style={{
                                    opacity: hoveredBlocks.has(i) ? blockOpacities.current[i] * 0.5 : 0,
                                }}
                            />
                        ))}
                    </div>

                    {/* VS Code window */}
                    <div className={`${styles.editorWindow} ${isWindowOpen ? styles.windowOpen : ''}`}>
                        {/* title bar */}
                        <div className={styles.titleBar}>
                            <div className={styles.trafficLights}>
                                <span className={styles.red} />
                                <span className={styles.yellow} />
                                <span className={styles.green} />
                            </div>
                            <span className={styles.titleText}>Lakshya Purohit — Portfolio</span>
                            <div className={styles.titleActions}>
                                <span className={styles.titleIcon}>⌘</span>
                            </div>
                        </div>

                        {/* tabs */}
                        <div className={styles.tabBar}>
                            {tabs.map((tab) => (
                                <div key={tab.name} className={`${styles.tab} ${tab.active ? styles.tabActive : ''}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                        <polyline points="13 2 13 9 20 9" />
                                    </svg>
                                    {tab.name}
                                </div>
                            ))}
                        </div>

                        {/* editor body */}
                        <div className={styles.editorBody}>
                            {/* sidebar */}
                            <div className={styles.sidebar}>
                                <div className={styles.sidebarIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <div className={styles.sidebarIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                    </svg>
                                </div>
                                <div className={styles.sidebarIcon}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M6 3v18" /><path d="M18 9l-6-6-6 6" />
                                    </svg>
                                </div>
                            </div>

                            {/* code area */}
                            <div className={styles.codeArea}>
                                {codeLines.map((line, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.codeLine} ${idx < visibleLines ? styles.lineVisible : ''}`}
                                        style={{ transitionDelay: `${(idx % 5) * 0.03}s` }}
                                    >
                                        <span className={styles.lineNumber}>{idx + 1}</span>
                                        <span className={styles.lineContent} style={{ paddingLeft: `${line.indent * 1.5}rem` }}>
                                            {line.tokens.map((token, tIdx) => (
                                                <span key={tIdx} className={styles[`token_${token.type}`]}>
                                                    {token.text}
                                                </span>
                                            ))}
                                            {idx === visibleLines - 1 && <span className={styles.cursor}>|</span>}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* status bar */}
                        <div className={styles.statusBar}>
                            <span>TypeScript</span>
                            <span>UTF-8</span>
                            <span>Ln {visibleLines}, Col 1</span>
                            <span className={styles.statusPrettier}>Prettier</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
