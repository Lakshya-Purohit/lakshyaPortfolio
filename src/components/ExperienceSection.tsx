'use client';

import { motion } from 'framer-motion';
import styles from './ExperienceSection.module.css';

const experiences = [
    {
        period: 'Aug 2025 — Present',
        company: 'AKAL Info Systems',
        role: 'Software Developer',
        highlights: [
            'Engineered high-performance ASP.NET Core RESTful APIs using C# and OOP',
            'Optimized Postgres queries improving system latency by 50%',
            'Architected secure Video e-KYC with Angular, WebRTC, and SignalR',
            'Implemented CI/CD pipelines for automated deployment workflows',
        ],
        tech: ['ASP.NET Core', 'C#', 'PostgreSQL', 'Angular', 'WebRTC', 'Docker'],
    },
    {
        period: 'Jul 2024 — Jul 2025',
        company: 'LP Cloud Lab',
        role: 'Software Developer',
        highlights: [
            'Formulated scalable ASP.NET solutions using Dependency Injection',
            'Boosted performance by 20% via streamlined data exchange',
            'Tuned SQL Server stored procedures, reducing API times by 30%',
        ],
        tech: ['ASP.NET', 'SQL Server', 'C#', 'REST APIs'],
    },
    {
        period: 'Jun 2023 — Dec 2023',
        company: 'NOI Technologies',
        role: 'Full Stack Developer Intern',
        highlights: [
            'Developed ERP modules using Moqui Framework (Java/Groovy)',
            'Applied SOA and automation scripts for data processing',
            'Implemented RBAC Security for multi-tenant data protection',
        ],
        tech: ['Java', 'Groovy', 'Moqui', 'SOA'],
    },
    {
        period: 'Jun 2022 — Aug 2022',
        company: 'DRDO',
        role: 'Image Processing Intern',
        highlights: [
            'Engineered Python CV algorithms using OpenCV and NumPy',
            'Developed Neural Network-based object detection systems',
            'Collaborated on real-time defense-grade image analysis',
        ],
        tech: ['Python', 'OpenCV', 'NumPy', 'Neural Networks'],
    },
];

export default function ExperienceSection() {
    return (
        <section className={styles.section} id="experience">
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label">Career Timeline</span>
                    <h2 className={styles.heading}>
                        <span className={styles.headingNum}>3+</span> years of building
                        <span className={styles.headingAccent}> scalable systems</span>
                    </h2>
                </motion.div>

                <div className={styles.timeline}>
                    {experiences.map((exp, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.card}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            data-cursor="read-more"
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.period}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                    </svg>
                                    {exp.period}
                                </div>
                                <div className={styles.roleTag}>{exp.role}</div>
                            </div>

                            <h3 className={styles.company}>{exp.company}</h3>

                            <ul className={styles.highlights}>
                                {exp.highlights.map((h, hIdx) => (
                                    <li key={hIdx}>{h}</li>
                                ))}
                            </ul>

                            <div className={styles.techRow}>
                                {exp.tech.map((t) => (
                                    <span key={t} className={styles.techChip}>{t}</span>
                                ))}
                            </div>

                            <div className={styles.cardNum}>0{idx + 1}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
