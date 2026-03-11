'use client';

import styles from './CertificationsSection.module.css';

const certifications = [
    {
        title: 'Introduction to Generative AI',
        issuer: 'Google',
        date: '2024',
        icon: '🤖',
        badge: 'Credential',
        url: 'https://www.skills.google/public_profiles/1824948f-c813-445f-ae7f-1ffcf7149c3b/badges/22532866'
    },
    {
        title: 'C#',
        issuer: 'Udemy',
        date: '2024',
        icon: '💻',
        badge: 'Credential',
        url: 'https://www.udemy.com/certificate/UC-5a0889cd-d0c1-49f0-95d8-5874d792e752/'
    },
    {
        title: 'SQL Advance',
        issuer: 'Udemy',
        date: '2024',
        icon: '🗄️',
        badge: 'Credential',
        url: 'https://www.udemy.com/certificate/UC-1657d6d7-35f2-4409-881d-66757063d852/'
    }
];

export default function CertificationsSection() {
    return (
        <section className={styles.section} id="certifications">
            <div className={styles.inner}>
                <div>
                    <span className="section-label">Certifications</span>
                    <h2 className={styles.heading}>
                        Continuous <span className={styles.headingAccent}>learning</span> & growth
                    </h2>
                </div>

                <div className={styles.grid}>
                    {certifications.map((cert, idx) => (
                        <a
                            key={idx}
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.card}
                            data-reveal
                            data-reveal-delay={idx * 80}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className={styles.cardIcon}>{cert.icon}</div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.certTitle}>{cert.title}</h3>
                                <p className={styles.certIssuer}>{cert.issuer}</p>
                            </div>
                            <div className={styles.badge}>{cert.badge}</div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
