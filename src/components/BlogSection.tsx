'use client';

import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import styles from './BlogSection.module.css';

export default function BlogSection() {
    return (
        <section className={styles.section} id="blog">
            <div className={styles.inner}>
                <div className={styles.header}>
                    <div>
                        <span className="section-label">Blog</span>
                        <h2 className={styles.heading}>
                            Thoughts & <span className={styles.headingAccent}>insights</span>
                        </h2>
                    </div>
                    <div className={styles.headerRight}>
                        <p className={styles.headerSub}>
                            Writing about software architecture, best practices, and lessons learned.
                        </p>
                        <Link href="/blog" className={styles.viewAll}>
                            View All Posts
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className={styles.grid}>
                    {[...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((post, idx) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className={styles.cardLink}
                        >
                            <article
                                className={styles.card}
                                data-cursor="read-more"
                                data-reveal
                                data-reveal-delay={idx * 100}
                            >
                                <div className={styles.cardTop}>
                                    <span className={styles.category}>{post.category}</span>
                                    <span className={styles.date}>{post.date}</span>
                                </div>
                                <h3 className={styles.postTitle}>{post.title}</h3>
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
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
