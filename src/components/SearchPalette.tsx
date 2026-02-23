'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SearchPalette.module.css';

interface SearchItem {
    label: string;
    section?: string;
    href?: string;
    icon: string;
    action?: () => void;
}

const SEARCH_ITEMS: SearchItem[] = [
    { label: 'Home', section: 'Navigation', href: '#', icon: '🏠' },
    { label: 'About Me', section: 'Navigation', href: '#about', icon: '👤' },
    { label: 'Experience', section: 'Navigation', href: '#experience', icon: '💼' },
    { label: 'Projects', section: 'Navigation', href: '#projects', icon: '🚀' },
    { label: 'Testimonials', section: 'Navigation', href: '#testimonials', icon: '💬' },
    { label: 'Certifications', section: 'Navigation', href: '#certifications', icon: '🏆' },
    { label: 'Blog', section: 'Navigation', href: '#blog', icon: '📝' },
    { label: 'Why Choose Me', section: 'Navigation', href: '#why-choose-me', icon: '⭐' },
    { label: 'Contact', section: 'Navigation', href: '#contact', icon: '📧' },
    { label: 'ASP.NET Core', section: 'Skills', href: '#experience', icon: '⚙️' },
    { label: 'Angular', section: 'Skills', href: '#experience', icon: '🅰️' },
    { label: 'WebRTC', section: 'Skills', href: '#projects', icon: '📹' },
    { label: 'PostgreSQL', section: 'Skills', href: '#experience', icon: '🗄️' },
    { label: 'Docker', section: 'Skills', href: '#experience', icon: '🐳' },
    { label: 'Python', section: 'Skills', href: '#experience', icon: '🐍' },
    { label: 'React / Next.js', section: 'Skills', href: '#projects', icon: '⚛️' },
    { label: 'TypeScript', section: 'Skills', href: '#projects', icon: '📘' },
    { label: 'Email Lakshya', section: 'Actions', href: 'mailto:lakshya.purohit.2105@gmail.com', icon: '✉️' },
    { label: 'GitHub Profile', section: 'Actions', href: 'https://github.com/lakshyapurohit', icon: '🐙' },
    { label: 'LinkedIn Profile', section: 'Actions', href: 'https://linkedin.com/in/lakshyapurohit', icon: '🔗' },
    { label: 'Download Resume', section: 'Actions', href: 'mailto:lakshya.purohit.2105@gmail.com?subject=Resume%20Request', icon: '📄' },
];

export default function SearchPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim()
        ? SEARCH_ITEMS.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase()) ||
            (item.section && item.section.toLowerCase().includes(query.toLowerCase()))
        )
        : SEARCH_ITEMS;

    // Keyboard shortcut: Cmd+K / Ctrl+K
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Auto-focus input when opened
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    // Reset selection when filtered changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Scroll selected into view
    useEffect(() => {
        const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
        el?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex]);

    const executeItem = useCallback((item: SearchItem) => {
        setOpen(false);
        setQuery('');
        if (item.action) {
            item.action();
        } else if (item.href) {
            if (item.href.startsWith('#')) {
                const el = document.querySelector(item.href);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.open(item.href, '_blank');
            }
        }
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filtered[selectedIndex]) {
            e.preventDefault();
            executeItem(filtered[selectedIndex]);
        }
    };

    // Group items by section only when open
    const grouped = open ? (() => {
        const groups: { section: string; items: (SearchItem & { globalIdx: number })[] }[] = [];
        filtered.forEach((item, i) => {
            const sec = item.section || 'Other';
            let group = groups.find(g => g.section === sec);
            if (!group) { group = { section: sec, items: [] }; groups.push(group); }
            group.items.push({ ...item, globalIdx: i });
        });
        return groups;
    })() : [];

    return (
        <>
            {/* Global floating keyboard hint (visible when palette is closed) */}
            {!open && (
                <div className={styles.globalHint} onClick={() => setOpen(true)}>
                    <kbd className={styles.hintKbd}>
                        {typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'} + K
                    </kbd>
                    <span className={styles.hintText}>Search</span>
                </div>
            )}

            {open && (
                <div className={styles.overlay} onClick={() => setOpen(false)}>
                    <div className={styles.palette} onClick={e => e.stopPropagation()}>
                        {/* Search input */}
                        <div className={styles.searchBar}>
                            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                ref={inputRef}
                                className={styles.searchInput}
                                type="text"
                                placeholder="Search pages, skills, actions..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <kbd className={styles.kbd}>ESC</kbd>
                        </div>

                        {/* Results */}
                        <div className={styles.results} ref={listRef}>
                            {grouped.map(group => (
                                <div key={group.section}>
                                    <div className={styles.sectionLabel}>{group.section}</div>
                                    {group.items.map(item => (
                                        <button
                                            key={item.label}
                                            className={`${styles.resultItem} ${item.globalIdx === selectedIndex ? styles.resultActive : ''}`}
                                            onClick={() => executeItem(item)}
                                            onMouseEnter={() => setSelectedIndex(item.globalIdx)}
                                        >
                                            <span className={styles.resultIcon}>{item.icon}</span>
                                            <span className={styles.resultLabel}>{item.label}</span>
                                            {item.globalIdx === selectedIndex && (
                                                <span className={styles.resultHint}>↵</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ))}
                            {filtered.length === 0 && (
                                <div className={styles.noResults}>No results found</div>
                            )}
                        </div>

                        {/* Footer hint */}
                        <div className={styles.footer}>
                            <span><kbd>↑↓</kbd> Navigate</span>
                            <span><kbd>↵</kbd> Open</span>
                            <span><kbd>esc</kbd> Close</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
