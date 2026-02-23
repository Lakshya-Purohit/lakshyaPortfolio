'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './PeekingCharacter.module.css';

/**
 * 3D Peeking Character — lives in the bottom-left corner.
 * 
 * Behaviour:
 *  - IDLE: Visible at bottom-left corner, eyes follow cursor.
 *  - SCROLL: Slides LEFT (off-screen) when scrolling down.
 *  - PROXIMITY/HOVER: Slides LEFT/DOWN to hide when cursor is too close.
 */

const HIDE_THRESHOLD = 160; // Distance in px to trigger hiding

export default function PeekingCharacter() {
    const charRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const [isScrolling, setIsScrolling] = useState(false);
    const [isHiding, setIsHiding] = useState(false);
    const [eye, setEye] = useState({ x: 0, y: 0 });
    const scrollTm = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const rafRef = useRef<number>(0);

    /* ─── Eye tracking & Proximity Loop ──────── */
    const update = useCallback(() => {
        if (charRef.current) {
            const rect = charRef.current.getBoundingClientRect();
            // Character center (approx center of head)
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + 40; // Head is towards the top of the container

            const dx = mousePos.current.x - cx;
            const dy = mousePos.current.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Proximity check
            setIsHiding(dist < HIDE_THRESHOLD);

            // Normalise pupils
            const nx = Math.max(-1, Math.min(1, dx / 350));
            const ny = Math.max(-1, Math.min(1, dy / 350));

            setEye(prev => ({
                x: prev.x + (nx - prev.x) * 0.12,
                y: prev.y + (ny - prev.y) * 0.12,
            }));
        }
        rafRef.current = requestAnimationFrame(update);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = () => {
            setIsScrolling(true);
            clearTimeout(scrollTm.current);
            scrollTm.current = setTimeout(() => {
                setIsScrolling(false);
            }, 600); // Wait bit after last scroll to show up again
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        rafRef.current = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearTimeout(scrollTm.current);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [update]);

    // Pupil displacement
    const px = eye.x * 3.5;
    const py = eye.y * 3;

    return (
        <div
            ref={charRef}
            className={`${styles.character} ${isScrolling ? styles.scrolling : ''} ${isHiding ? styles.hiding : ''}`}
            aria-hidden="true"
        >
            <svg
                className={styles.svg}
                viewBox="0 0 100 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0071E3', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#004A99', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#FFE5C5', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#F5BE8B', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="meshShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="2" stdDeviation="4" floodOpacity="0.2" />
                    </filter>
                    <radialGradient id="highlight" cx="50%" cy="40%" r="50%">
                        <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                    </radialGradient>
                </defs>

                {/* 3D Body (Sphere-like torso) */}
                <ellipse cx="50" cy="85" rx="35" ry="30" fill="url(#bodyGrad)" />
                <ellipse cx="50" cy="85" rx="35" ry="30" fill="url(#highlight)" />

                {/* Hands (3D spheres) */}
                <circle cx="15" cy="80" r="10" fill="url(#faceGrad)" />
                <circle cx="85" cy="80" r="10" fill="url(#faceGrad)" />
                <circle cx="15" cy="80" r="10" fill="url(#highlight)" opacity="0.5" />
                <circle cx="85" cy="80" r="10" fill="url(#highlight)" opacity="0.5" />

                {/* 3D Head (Sphere) */}
                <g filter="url(#meshShadow)">
                    <circle cx="50" cy="40" r="32" fill="url(#faceGrad)" />
                    <circle cx="50" cy="40" r="32" fill="url(#highlight)" />

                    {/* Ears */}
                    <circle cx="18" cy="40" r="6" fill="url(#faceGrad)" />
                    <circle cx="82" cy="40" r="6" fill="url(#faceGrad)" />

                    {/* Hair (Volume overlay) */}
                    <path
                        d="M 18 35 Q 18 10 50 8 Q 82 10 82 35 Q 50 25 18 35 Z"
                        fill="#4A3728"
                    />

                    {/* Eyes (Embedded 3D look) */}
                    <g transform={`translate(${px}, ${py})`}>
                        {/* Eyes sockets depth */}
                        <ellipse cx="38" cy="42" rx="7" ry="8" fill="rgba(0,0,0,0.05)" />
                        <ellipse cx="62" cy="42" rx="7" ry="8" fill="rgba(0,0,0,0.05)" />

                        {/* Eyeballs */}
                        <ellipse cx="38" cy="41" rx="6" ry="7" fill="white" />
                        <ellipse cx="62" cy="41" rx="6" ry="7" fill="white" />

                        {/* Irises */}
                        <circle cx="38" cy="41" r="4.5" fill="#3A7FD0" />
                        <circle cx="62" cy="41" r="4.5" fill="#3A7FD0" />

                        {/* Pupils */}
                        <circle cx="38" cy="41" r="2.2" fill="#1d1d1f" />
                        <circle cx="62" cy="41" r="2.2" fill="#1d1d1f" />

                        {/* Specular */}
                        <circle cx="39.5" cy="39.5" r="1" fill="white" opacity="0.9" />
                        <circle cx="63.5" cy="39.5" r="1" fill="white" opacity="0.9" />
                    </g>

                    {/* Nose (3D bump) */}
                    <ellipse cx="50" cy="52" rx="3" ry="4" fill="#E8A070" opacity="0.8" />

                    {/* Mouth */}
                    <path d="M 40 65 Q 50 72 60 65" stroke="#C0703A" strokeWidth="2" strokeLinecap="round" fill="none" />
                </g>
            </svg>
        </div>
    );
}
