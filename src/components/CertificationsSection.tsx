'use client';

import { motion } from 'framer-motion';
import styles from './CertificationsSection.module.css';

const certifications = [
    {
        title: 'Microsoft Azure Fundamentals',
        issuer: 'Microsoft',
        date: '2024',
        icon: '☁️',
        badge: 'AZ-900',
    },
    {
        title: 'ASP.NET Core Web API Development',
        issuer: 'Udemy',
        date: '2024',
        icon: '🔧',
        badge: 'Certified',
    },
    {
        title: 'Angular — The Complete Guide',
        issuer: 'Udemy',
        date: '2024',
        icon: '🅰️',
        badge: 'Certified',
    },
    {
        title: 'Docker & Kubernetes Essentials',
        issuer: 'Coursera',
        date: '2023',
        icon: '🐳',
        badge: 'Certified',
    },
    {
        title: 'Python for Computer Vision with OpenCV',
        issuer: 'Udemy',
        date: '2022',
        icon: '👁️',
        badge: 'Certified',
    },
    {
        title: 'Database Design & PostgreSQL',
        issuer: 'Coursera',
        date: '2023',
        icon: '🗄️',
        badge: 'Certified',
    },
];

export default function CertificationsSection() {
    return (
        <section className={styles.section} id="certifications">
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <span className="section-label">Certifications</span>
                    <h2 className={styles.heading}>
                        Continuous <span className={styles.headingAccent}>learning</span> & growth
                    </h2>
                </motion.div>

                <div className={styles.grid}>
                    {certifications.map((cert, idx) => (
                        <motion.div
                            key={idx}
                            className={styles.card}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.cardIcon}>{cert.icon}</div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.certTitle}>{cert.title}</h3>
                                <p className={styles.certIssuer}>{cert.issuer} · {cert.date}</p>
                            </div>
                            <div className={styles.badge}>{cert.badge}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
