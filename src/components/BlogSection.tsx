'use client';

import { motion } from 'framer-motion';
import styles from './BlogSection.module.css';

const blogPosts = [
    {
        title: 'Building Scalable APIs with ASP.NET Core',
        excerpt: 'Deep dive into best practices for building high-performance RESTful APIs with proper dependency injection, caching strategies, and middleware patterns.',
        date: 'Jan 2026',
        readTime: '8 min read',
        category: 'Backend',
        tag: 'ASP.NET',
    },
    {
        title: 'Real-time Video with WebRTC & Mediasoup',
        excerpt: 'How to architect a secure, low-latency video streaming platform using SFU-based media routing for compliance and verification workflows.',
        date: 'Dec 2025',
        readTime: '12 min read',
        category: 'Real-time',
        tag: 'WebRTC',
    },
    {
        title: 'Database Schema Versioning in Production',
        excerpt: 'Strategies for detecting schema drift, automating safe migrations, and building version control for database schemas across environments.',
        date: 'Nov 2025',
        readTime: '6 min read',
        category: 'DevOps',
        tag: 'PostgreSQL',
    },
];

export default function BlogSection() {
    return (
        <section className={styles.section} id="blog">
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={styles.header}
                >
                    <div>
                        <span className="section-label">Blog</span>
                        <h2 className={styles.heading}>
                            Thoughts & <span className={styles.headingAccent}>insights</span>
                        </h2>
                    </div>
                    <p className={styles.headerSub}>
                        Writing about software architecture, best practices, and lessons learned.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {blogPosts.map((post, idx) => (
                        <motion.article
                            key={idx}
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            data-cursor="read-more"
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
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
