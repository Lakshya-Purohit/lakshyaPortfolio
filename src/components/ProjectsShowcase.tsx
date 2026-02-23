'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProjectsShowcase.module.css';

interface Project {
    id: number;
    title: string;
    description: string;
    fullDescription: string;
    year: string;
    role: string;
    tech: string[];
    image: string;
    link?: string;
    linkLabel?: string;
}

const projects: Project[] = [
    {
        id: 1,
        title: 'Schema Drift Tool',
        description: 'Robust standalone tool to detect schema drift between database environments.',
        fullDescription: 'Engineered a robust standalone tool to detect schema drift between database environments. Features include a visual diffing engine, automated safe migration workflows, production-grade error handling, and a Flask-based web UI for comparing and applying schema changes safely across development & production PostgreSQL databases.',
        year: '2025',
        role: 'Full Stack Developer',
        tech: ['Python', 'Flask', 'PostgreSQL', 'JavaScript', 'HTML/CSS'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format',
        link: 'https://db-version-control.onrender.com/',
        linkLabel: 'View Live Project',
    },
    {
        id: 2,
        title: 'Video e-KYC Platform',
        description: 'Secure peer-to-peer video verification with WebRTC and Mediasoup.',
        fullDescription: 'Spearheaded a secure Video e-KYC solution leveraging WebRTC and Mediasoup (SFU) for real-time audio-video verification. Built an Angular frontend integrated with a Node.js backend, enabling low-latency compliance streaming with features like live face detection, document capture, and encrypted media channels for banking compliance.',
        year: '2025',
        role: 'Lead Developer',
        tech: ['Angular', 'WebRTC', 'Mediasoup', 'Node.js', 'SignalR', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1614064641938-3e85294a515d?q=80&w=2676&auto=format',
        linkLabel: 'Company Project — Private',
    },
    {
        id: 3,
        title: 'OCR Invoice Engine',
        description: 'Automated OCR system for invoice data extraction with 40% accuracy boost.',
        fullDescription: 'Developed an automated OCR system for invoice data extraction, generating structured Excel reports. Advanced image preprocessing using OpenCV (deskewing, noise removal, thresholding) improved Tesseract OCR accuracy by 40%. The pipeline handles multi-format invoices with configurable extraction templates and batch processing capabilities.',
        year: '2023',
        role: 'Python Developer',
        tech: ['Python', 'OpenCV', 'Tesseract', 'NumPy', 'Pandas'],
        image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?q=80&w=2574&auto=format',
        linkLabel: 'Company Project — Private',
    },
    {
        id: 4,
        title: 'Warehouse Management System',
        description: 'Mission-critical WMS with printing APIs and invoice microservices.',
        fullDescription: 'Co-engineered mission-critical Printing API and Invoicing for a complex Warehouse Management System. Built optimized Microservices architecture with ASP.NET Core, reducing manual errors by 30%. Features include barcode generation, automated label printing, real-time inventory tracking, and multi-warehouse shipment coordination.',
        year: '2024',
        role: 'Backend Developer',
        tech: ['ASP.NET Core', 'C#', 'SQL Server', 'Microservices', 'Docker'],
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format',
        linkLabel: 'Enterprise — Private',
    },
];

export default function ProjectsShowcase() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section className={styles.section} id="projects">
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={styles.header}
                >
                    <div>
                        <span className="section-label">Portfolio</span>
                        <h2 className={styles.heading}>
                            Projects I&apos;ve <span className={styles.headingAccent}>crafted</span>
                        </h2>
                    </div>
                    <p className={styles.headerSub}>
                        Each project represents a unique challenge, solved with cutting-edge technology
                        and meticulous attention to detail.
                    </p>
                </motion.div>

                <div className={styles.grid}>
                    {projects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            onClick={() => setSelectedProject(project)}
                            data-cursor="read-more"
                        >
                            <div className={styles.cardImage}>
                                <img src={project.image} alt={project.title} />
                                <div className={styles.cardOverlay}>
                                    <span className={styles.viewBtn}>
                                        View Details
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className={styles.cardBody}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.year}>{project.year}</span>
                                    <span className={styles.roleBadge}>{project.role}</span>
                                </div>
                                <h3 className={styles.cardTitle}>{project.title}</h3>
                                <p className={styles.cardDesc}>{project.description}</p>
                                <div className={styles.cardTech}>
                                    {project.tech.slice(0, 3).map((t) => (
                                        <span key={t} className={styles.techTag}>{t}</span>
                                    ))}
                                    {project.tech.length > 3 && (
                                        <span className={styles.techMore}>+{project.tech.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className={styles.modalBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className={styles.modalClose} onClick={() => setSelectedProject(null)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            <div className={styles.modalImage}>
                                <img src={selectedProject.image} alt={selectedProject.title} />
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.modalMeta}>
                                    <span className={styles.year}>{selectedProject.year}</span>
                                    <span className={styles.roleBadge}>{selectedProject.role}</span>
                                </div>

                                <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
                                <p className={styles.modalDesc}>{selectedProject.fullDescription}</p>

                                <div className={styles.modalTech}>
                                    <h4 className={styles.modalTechTitle}>Technologies Used</h4>
                                    <div className={styles.modalTechList}>
                                        {selectedProject.tech.map((t) => (
                                            <span key={t} className={styles.techTag}>{t}</span>
                                        ))}
                                    </div>
                                </div>

                                {selectedProject.link ? (
                                    <a
                                        href={selectedProject.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.modalLink}
                                    >
                                        {selectedProject.linkLabel}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                                        </svg>
                                    </a>
                                ) : (
                                    <span className={styles.modalLinkPrivate}>{selectedProject.linkLabel}</span>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
