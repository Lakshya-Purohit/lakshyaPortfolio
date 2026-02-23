'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './TestimonialsSection.module.css';

const testimonials = [
    {
        quote: "Lakshya's backend architecture skills are exceptional. He optimized our database queries and reduced API response times by 50%. His understanding of system design is well beyond his years.",
        name: 'Rajesh Kumar',
        role: 'Engineering Lead, AKAL Info Systems',
        avatar: 'RK',
    },
    {
        quote: "Working with Lakshya on the e-KYC platform was a great experience. He solved complex WebRTC challenges that others struggled with, delivering a secure and reliable video verification system.",
        name: 'Priya Sharma',
        role: 'Product Manager, AKAL Info Systems',
        avatar: 'PS',
    },
    {
        quote: "His ability to translate complex requirements into clean, well-structured code is remarkable. The Warehouse Management System he co-developed reduced our manual errors by 30%.",
        name: 'Amit Verma',
        role: 'CTO, LP Cloud Lab',
        avatar: 'AV',
    },
    {
        quote: "Lakshya demonstrated incredible potential during his internship at DRDO. His image processing algorithms and neural network implementations exceeded our expectations for an intern.",
        name: 'Dr. Suresh Nair',
        role: 'Scientist, DRDO',
        avatar: 'SN',
    },
    {
        quote: "As a coordinator, Lakshya managed 200+ volunteers and 50+ events flawlessly. His leadership and organizational skills are as strong as his technical abilities.",
        name: 'Prof. Meera Joshi',
        role: 'Faculty Advisor, SKIT',
        avatar: 'MJ',
    },
];

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

    return (
        <section className={styles.section} id="testimonials" ref={sectionRef}>
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className={styles.header}
                >
                    <span className="section-label">Testimonials</span>
                    <h2 className={styles.heading}>
                        What people <span className={styles.headingAccent}>say about me</span>
                    </h2>
                </motion.div>
            </div>

            <div className={styles.sliderContainer}>
                <motion.div
                    className={styles.slider}
                    animate={isInView ? { x: [0, -50 * testimonials.length] } : {}}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 30,
                            ease: 'linear',
                        },
                    }}
                >
                    {[...testimonials, ...testimonials].map((t, idx) => (
                        <div key={idx} className={styles.card}>
                            <div className={styles.quoteIcon}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                            <p className={styles.quote}>{t.quote}</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>{t.avatar}</div>
                                <div>
                                    <div className={styles.authorName}>{t.name}</div>
                                    <div className={styles.authorRole}>{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
