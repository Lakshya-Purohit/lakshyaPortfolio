'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CodeEditorScene.module.css';

gsap.registerPlugin(ScrollTrigger);

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

// Block grid config
const GRID_COLS = 28;
const GRID_ROWS = 16;
const BLOCK_RADIUS = 4; // blocks affected around cursor

export default function CodeEditorScene() {
    const [visibleLines, setVisibleLines] = useState(0);
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [hoveredBlocks, setHoveredBlocks] = useState<Set<number>>(new Set());
    const sectionRef = useRef<HTMLDivElement>(null);
    const pinWrapRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const mouseGridPos = useRef({ col: -1, row: -1 });
    const rafId = useRef<number>(0);
    const blockOpacities = useRef<Float32Array>(new Float32Array(GRID_COLS * GRID_ROWS));

    useEffect(() => {
        const timer = setTimeout(() => setIsWindowOpen(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!sectionRef.current || !pinWrapRef.current) return;

        const totalLines = codeLines.length;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${window.innerHeight * 2}`,
            pin: pinWrapRef.current,
            pinSpacing: true,
            scrub: 0.5,
            onUpdate: (self) => {
                const lines = Math.floor(self.progress * totalLines);
                setVisibleLines(Math.min(lines, totalLines));
            },
        });

        return () => { trigger.kill(); };
    }, []);

    // Interactive block grid mouse tracking
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

    // Animate block opacities
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
        <section className={styles.scene} ref={sectionRef} id="code-scene">
            <div className={styles.pinWrap} ref={pinWrapRef}>
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
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <div className={styles.sidebarIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                                </svg>
                            </div>
                            <div className={styles.sidebarIcon}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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

                {/* scroll hint */}
                <div className={styles.scrollHint}>
                    <div className={styles.scrollMouse}>
                        <div className={styles.scrollWheel} />
                    </div>
                    <span>Scroll to explore</span>
                </div>
            </div>
        </section>
    );
}
