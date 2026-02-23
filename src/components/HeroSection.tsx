'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './HeroSection.module.css';

const roles = [
    'Software Developer',
    'Backend Architect',
    'System Engineer',
    'Video Solutions Expert',
];

export default function HeroSection() {
    const [currentRole, setCurrentRole] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((prev) => (prev + 1) % roles.length);
        }, 2400);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.hero} id="about" ref={sectionRef}>
            <div className={styles.heroInner}>
                {/* Left — Image */}
                <motion.div
                    className={styles.imageCol}
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                >
                    <div className={styles.imageWrapper}>
                        <div className={styles.imageFrame}>
                            <img
                                src="/profile.jpg"
                                alt="Lakshya Purohit"
                                className={styles.profileImg}
                            />
                            <div className={styles.imageOverlay} />
                        </div>
                        <div className={styles.imageDecor}>
                            <div className={styles.decorLine} />
                            <div className={styles.decorDot} />
                        </div>
                    </div>
                    <div className={styles.statusBadge}>
                        <span className={styles.statusDot} />
                        Available for work
                    </div>
                </motion.div>

                {/* Right — Content */}
                <div className={styles.contentCol}>
                    <motion.div
                        className={styles.greeting}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Hi there! I am
                    </motion.div>

                    <motion.h1
                        className={styles.name}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                    >
                        <span className={styles.firstName}>Lakshya</span>
                        <span className={styles.lastName}>Purohit<span className={styles.dot}>.</span></span>
                    </motion.h1>

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

                    <motion.p
                        className={styles.bio}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        I specialize in building <strong>scalable, high-performance</strong> enterprise
                        systems. Passionate about complex backend architectures, real-time communication,
                        and database optimization — engineering solutions that handle thousands of
                        concurrent users.
                    </motion.p>

                    <motion.div
                        className={styles.ctaRow}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
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
                    </motion.div>

                    <motion.div
                        className={styles.stats}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.stat}>
                            <span className={styles.statNum}>3+</span>
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
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
