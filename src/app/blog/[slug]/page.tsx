'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { blogPosts } from '@/data/blogPosts';
import styles from './post.module.css';

function BlogNav() {
    const { theme, toggle } = useTheme();

    return (
        <nav className={styles.blogNav}>
            <div className={styles.blogNavLeft}>
                <Link href="/" className={styles.logo}>
                    LP
                </Link>
                <Link href="/blog" className={styles.backLink}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    All Posts
                </Link>
            </div>
            <button
                className={styles.themeToggle}
                onClick={toggle}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
                {theme === 'dark' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="5" />
                        <line x1="12" y1="1" x2="12" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="23" />
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                        <line x1="1" y1="12" x2="3" y2="12" />
                        <line x1="21" y1="12" x2="23" y2="12" />
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                )}
            </button>
        </nav>
    );
}

function generateId(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

interface TocHeading {
    id: string;
    text: string;
    level: number;
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
    return (
        <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>
                <span className={`${styles.codeDot} ${styles.codeDotRed}`} />
                <span className={`${styles.codeDot} ${styles.codeDotYellow}`} />
                <span className={`${styles.codeDot} ${styles.codeDotGreen}`} />
                {lang && <span className={styles.codeLang}>{lang}</span>}
            </div>
            <div className={styles.codeBody}>
                <code>{code}</code>
            </div>
        </div>
    );
}

function renderMarkdown(md: string): { nodes: React.ReactNode[]; headings: TocHeading[] } {
    const lines = md.split('\n');
    const nodes: React.ReactNode[] = [];
    const headings: TocHeading[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (line.startsWith('```')) {
            const lang = line.slice(3).trim();
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            i++;
            nodes.push(<CodeBlock key={key++} code={codeLines.join('\n')} lang={lang} />);
            continue;
        }

        if (line.includes('|') && line.trim().startsWith('|')) {
            const tableLines: string[] = [];
            while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
                tableLines.push(lines[i]);
                i++;
            }
            const headerCells = tableLines[0].split('|').filter(c => c.trim());
            const bodyRows = tableLines.slice(2);
            nodes.push(
                <table key={key++}>
                    <thead>
                        <tr>
                            {headerCells.map((cell, ci) => (
                                <th key={ci}>{cell.trim()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {bodyRows.map((row, ri) => {
                            const cells = row.split('|').filter(c => c.trim());
                            return (
                                <tr key={ri}>
                                    {cells.map((cell, ci) => (
                                        <td key={ci}>{cell.trim()}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            );
            continue;
        }

        if (line.startsWith('#### ')) {
            const text = line.slice(5);
            const id = generateId(text);
            headings.push({ id, text, level: 4 });
            nodes.push(<h4 id={id} key={key++}>{text}</h4>);
            i++; continue;
        }
        if (line.startsWith('### ')) {
            const text = line.slice(4);
            const id = generateId(text);
            headings.push({ id, text, level: 3 });
            nodes.push(<h3 id={id} key={key++}>{text}</h3>);
            i++; continue;
        }
        if (line.startsWith('## ')) {
            const text = line.slice(3);
            const id = generateId(text);
            headings.push({ id, text, level: 2 });
            nodes.push(<h2 id={id} key={key++}>{text}</h2>);
            i++; continue;
        }

        if (line.trim() === '---') {
            nodes.push(<hr key={key++} />);
            i++; continue;
        }

        if (line.match(/^[\-\*] /)) {
            const items: string[] = [];
            while (i < lines.length && lines[i].match(/^[\-\*] /)) {
                items.push(lines[i].replace(/^[\-\*] /, ''));
                i++;
            }
            nodes.push(
                <ul key={key++}>
                    {items.map((item, ii) => (
                        <li key={ii} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
                    ))}
                </ul>
            );
            continue;
        }

        if (line.match(/^\d+\. /)) {
            const items: string[] = [];
            while (i < lines.length && lines[i].match(/^\d+\. /)) {
                items.push(lines[i].replace(/^\d+\. /, ''));
                i++;
            }
            nodes.push(
                <ol key={key++}>
                    {items.map((item, ii) => (
                        <li key={ii} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
                    ))}
                </ol>
            );
            continue;
        }

        if (line.startsWith('✔')) {
            const items: string[] = [];
            while (i < lines.length && lines[i].startsWith('✔')) {
                items.push(lines[i]);
                i++;
            }
            nodes.push(
                <ul key={key++} style={{ listStyle: 'none', padding: 0 }}>
                    {items.map((item, ii) => (
                        <li key={ii} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} style={{ marginBottom: '0.35rem' }} />
                    ))}
                </ul>
            );
            continue;
        }

        if (line.startsWith('> ')) {
            const items: string[] = [];
            while (i < lines.length && lines[i].startsWith('> ')) {
                items.push(lines[i].replace(/^> /, ''));
                i++;
            }
            nodes.push(
                <blockquote key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(items.join('<br />')) }} />
            );
            continue;
        }

        if (line.trim() === '') { i++; continue; }

        nodes.push(
            <p key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
        );
        i++;
    }

    return { nodes, headings };
}

function inlineFormat(text: string): string {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** TOC Sidebar with scroll-based active tracking and progress bar */
function TableOfContents({ headings }: { headings: TocHeading[] }) {
    const [activeId, setActiveId] = useState<string>('');
    const [progress, setProgress] = useState(0);
    const tocRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

    // Scroll-based tracking using scroll position (more reliable than IntersectionObserver)
    const handleScroll = useCallback(() => {
        // Calculate read progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
        setProgress(pct);

        // Find active heading based on scroll position
        let currentId = '';
        for (const heading of headings) {
            const el = document.getElementById(heading.id);
            if (el) {
                const rect = el.getBoundingClientRect();
                // Heading is considered active if it's above the 35% mark of the viewport
                if (rect.top <= window.innerHeight * 0.35) {
                    currentId = heading.id;
                }
            }
        }
        if (currentId !== activeId) {
            setActiveId(currentId);
        }
    }, [headings, activeId]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // initial
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Auto-scroll the sidebar to keep active item visible
    useEffect(() => {
        if (activeId) {
            const el = tocRefs.current.get(activeId);
            if (el) {
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [activeId]);

    const toc = headings.filter(h => h.level <= 3);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.tocProgress}>
                <div className={styles.tocProgressBar} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.tocLabel}>On This Page</div>
            <ul className={styles.tocList}>
                {toc.map(heading => (
                    <li key={heading.id} className={styles.tocItem}>
                        <a
                            ref={(el) => { if (el) tocRefs.current.set(heading.id, el); }}
                            href={`#${heading.id}`}
                            className={`${styles.tocLink} ${heading.level === 3 ? styles.tocLinkSub : ''} ${activeId === heading.id ? styles.tocLinkActive : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                const el = document.getElementById(heading.id);
                                if (el) {
                                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                                    window.scrollTo({ top, behavior: 'smooth' });
                                }
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default function BlogPostPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return (
            <div className={styles.page}>
                <BlogNav />
                <div className={styles.articleMain}>
                    <h1 className={styles.title}>Post not found</h1>
                    <Link href="/blog" className={styles.backCta}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const { nodes, headings } = renderMarkdown(post.content);

    return (
        <div className={styles.page}>
            <BlogNav />

            <div className={styles.layout}>
                <TableOfContents headings={headings} />

                <main className={styles.articleMain}>
                    <div className={styles.articleContent}>
                        <div className={styles.breadcrumb}>
                            <Link href="/">Home</Link>
                            <span>/</span>
                            <Link href="/blog">Blog</Link>
                            <span>/</span>
                            <span style={{ color: 'var(--text-tertiary)' }}>{post.tag}</span>
                        </div>

                        <div
                            className={styles.coverStrip}
                            style={{ background: post.coverColor }}
                        />

                        <div className={styles.meta}>
                            <span className={styles.category}>{post.category}</span>
                            <span className={styles.metaText}>{post.date}</span>
                            <span className={styles.metaText}>·</span>
                            <span className={styles.metaText}>{post.readTime}</span>
                        </div>

                        <h1 className={styles.title}>{post.title}</h1>
                        <p className={styles.excerpt}>{post.excerpt}</p>

                        <article className={styles.body}>
                            {nodes}
                        </article>

                        <footer className={styles.authorFooter}>
                            <div className={styles.authorDivider} />
                            <div className={styles.authorInfo}>
                                <div className={styles.authorAvatar}>LP</div>
                                <div>
                                    <p className={styles.authorName}>Written by Lakshya Purohit</p>
                                    <p className={styles.authorMeta}>
                                        Published on {post.date} · Originally authored & owned by Lakshya Purohit
                                    </p>
                                </div>
                            </div>
                            <p className={styles.authorCopyright}>
                                © {new Date().getFullYear()} Lakshya Purohit. All rights reserved.
                            </p>
                        </footer>

                        <Link href="/blog" className={styles.backCta}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back to All Posts
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}
