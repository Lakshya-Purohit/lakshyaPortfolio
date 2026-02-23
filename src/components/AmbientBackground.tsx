'use client';

import styles from './AmbientBackground.module.css';

export default function AmbientBackground() {
    return (
        <div className={styles.container} aria-hidden="true">
            {/* Animated mesh gradient */}
            <div className={styles.meshGradient} />

            {/* Slow moving aurora streaks */}
            <div className={styles.aurora}>
                <div className={styles.auroraStreak} />
                <div className={`${styles.auroraStreak} ${styles.streak2}`} />
                <div className={`${styles.auroraStreak} ${styles.streak3}`} />
            </div>

            {/* Subtle dot grid */}
            <div className={styles.dotGrid} />
        </div>
    );
}
