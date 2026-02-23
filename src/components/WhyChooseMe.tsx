'use client';

import { motion } from 'framer-motion';
import styles from './WhyChooseMe.module.css';

const reasons = [
    {
        icon: '⚡',
        title: 'Performance Obsessed',
        description: 'I optimize for speed at every layer — from database queries to API response times. 70% performance improvements are my baseline.',
        stat: '50%',
        statLabel: 'Faster APIs',
    },
    {
        icon: '🏗️',
        title: 'Architecture First',
        description: 'I design scalable systems from day one. Microservices, DI, caching, and clean architecture patterns are my foundation.',
        stat: '3+',
        statLabel: 'Years Enterprise',
    },
    {
        icon: '🔒',
        title: 'Security by Design',
        description: 'From RBAC implementations to encrypted WebRTC channels, security is never an afterthought in my development process.',
        stat: '100%',
        statLabel: 'Secure delivery',
    },
    {
        icon: '🚀',
        title: 'Full Stack Delivery',
        description: 'From backend APIs to responsive frontends to CI/CD pipelines — I deliver complete, production-ready solutions.',
        stat: '10+',
        statLabel: 'Projects Shipped',
    },
];

export default function WhyChooseMe() {
    return (
        <section className={styles.section} id="why-me">
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={styles.header}
                >
                    <span className="section-label">Why Choose Me</span>
                    <h2 className={styles.heading}>
                        The <span className={styles.headingAccent}>difference</span> I bring
                    </h2>
                </motion.div>

                <div className={styles.grid}>
                    {reasons.map((reason, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.cardIcon}>{reason.icon}</div>
                            <h3 className={styles.cardTitle}>{reason.title}</h3>
                            <p className={styles.cardDesc}>{reason.description}</p>
                            <div className={styles.cardStat}>
                                <span className={styles.statNum}>{reason.stat}</span>
                                <span className={styles.statLabel}>{reason.statLabel}</span>
                            </div>
                            <div className={styles.cardGlow} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
