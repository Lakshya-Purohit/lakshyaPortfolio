'use client';

import { useEffect, useRef } from 'react';
import styles from './CustomCursor.module.css';

const NUM_CIRCLES = 20;

// Apple-style monochrome gradient for light mode (dark ink dots)
// and a light gradient for dark mode (white dots)
const LIGHT_COLORS = [
    '#1d1d1f', '#222222', '#262626', '#2b2b2b', '#303030',
    '#363636', '#3c3c3c', '#424242', '#494949', '#515151',
    '#595959', '#626262', '#6b6b6b', '#757575', '#7f7f7f',
    '#8a8a8a', '#969696', '#a3a3a3', '#b0b0b0', '#bebebe',
];

const DARK_COLORS = [
    '#f5f5f7', '#f0f0f2', '#eaeaec', '#e4e4e6', '#dededf',
    '#d6d6d8', '#cecece', '#c5c5c7', '#bcbcbe', '#b3b3b5',
    '#a9a9ab', '#9f9fa1', '#959597', '#8a8a8c', '#7f7f81',
    '#74747a', '#696972', '#5e5e6b', '#535362', '#48485a',
];

export default function CustomCursor() {
    const circlesRef = useRef<HTMLDivElement[]>([]);
    const coords = useRef({ x: 0, y: 0 });
    const labelRef = useRef<HTMLDivElement>(null);
    const labelVisible = useRef(false);
    const rafRef = useRef<number>(0);
    const innerCoords = useRef(
        Array.from({ length: NUM_CIRCLES }, () => ({ x: 0, y: 0 }))
    );

    useEffect(() => {
        const circles = circlesRef.current;
        if (!circles.length) return;

        // Assign initial colours based on current theme
        const applyColors = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const palette = isDark ? DARK_COLORS : LIGHT_COLORS;
            circles.forEach((c, i) => {
                c.style.backgroundColor = palette[i] ?? palette[palette.length - 1];
            });
        };
        applyColors();

        // Re-apply on theme change
        const observer = new MutationObserver(applyColors);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        document.body.style.cursor = 'none';

        const onMouseMove = (e: MouseEvent) => {
            coords.current.x = e.clientX;
            coords.current.y = e.clientY;

            // Label (View) visibility
            const isReadMore = (e.target as HTMLElement).closest?.('[data-cursor="read-more"]');
            const shouldShow = !!isReadMore;
            if (shouldShow !== labelVisible.current) {
                labelVisible.current = shouldShow;
                if (labelRef.current) {
                    labelRef.current.style.opacity = shouldShow ? '1' : '0';
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });

        const animate = () => {
            let x = coords.current.x;
            let y = coords.current.y;

            circles.forEach((circle, i) => {
                // Position this circle
                circle.style.left = `${x - 12}px`;
                circle.style.top = `${y - 12}px`;

                // Scale: first circle is biggest (1), last is smallest
                const scale = (NUM_CIRCLES - i) / NUM_CIRCLES;
                circle.style.transform = `scale(${scale})`;

                // Store
                innerCoords.current[i].x = x;
                innerCoords.current[i].y = y;

                // Next circle lerps toward this one
                const next = innerCoords.current[i + 1] ?? innerCoords.current[0];
                x += (next.x - x) * 0.35;
                y += (next.y - y) * 0.35;
            });

            // Keep label centered on the first circle (cursor head)
            if (labelRef.current && labelVisible.current) {
                labelRef.current.style.left = `${coords.current.x}px`;
                labelRef.current.style.top = `${coords.current.y}px`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            document.body.style.cursor = '';
            observer.disconnect();
        };
    }, []);

    return (
        <>
            {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
                <div
                    key={i}
                    className={styles.circle}
                    ref={el => { if (el) circlesRef.current[i] = el; }}
                />
            ))}
            <div ref={labelRef} className={styles.label} style={{ opacity: 0 }}>
                View
            </div>
        </>
    );
}
