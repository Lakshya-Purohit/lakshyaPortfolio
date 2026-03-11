'use client';

import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { blogPosts } from '@/data/blogPosts';
import styles from './blog.module.css';

function BlogNav() {
    const { theme, toggle } = useTheme();

    return (
        <nav className={styles.blogNav}>
            <div className={styles.blogNavLeft}>
                <Link href="/" className={styles.logo}>
                    LP
                </Link>
                <Link href="/" className={styles.backLink}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Portfolio
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

export default function BlogPage() {
    return (
        <div className={styles.page}>
            <BlogNav />

            <div className={styles.inner}>
                <header className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                        <span>/</span>
                        <span>Blog</span>
                    </div>
                    <h1 className={styles.heading}>
                        Thoughts & <span className={styles.headingAccent}>Insights</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Writing about software architecture, backend engineering, real-time systems,
                        and lessons learned building production software.
                    </p>
                </header>

                <div className={styles.grid}>
                    {blogPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={styles.card}
                        >
                            <div
                                className={styles.cardCover}
                                style={{ background: post.coverColor }}
                            />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTop}>
                                    <span className={styles.category}>{post.category}</span>
                                    <span className={styles.date}>{post.date}</span>
                                </div>
                                <h2 className={styles.postTitle}>{post.title}</h2>
                                <p className={styles.excerpt}>{post.excerpt}</p>
                                <div className={styles.cardFooter}>
                                    <span className={styles.tag}>{post.tag}</span>
                                    <span className={styles.readTime}>{post.readTime}</span>
                                </div>
                                <div className={styles.readMore}>
                                    Read Article
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
