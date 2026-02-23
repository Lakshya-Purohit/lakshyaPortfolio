'use client';

import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.left}>
                    <span className={styles.logo}>
                        <span className={styles.logoAccent}>L</span>P
                        <span className={styles.logoDot} />
                    </span>
                    <span className={styles.copy}>© 2026 Lakshya Purohit</span>
                </div>

                <div className={styles.center}>
                    <span className={styles.craft}>Crafted with precision & passion</span>
                </div>

                <div className={styles.right}>
                    <a href="https://github.com/Lakshya-Purohit" target="_blank" rel="noopener noreferrer" className={styles.footLink}>GitHub</a>
                    <a href="https://www.linkedin.com/in/lakshya-purohit-a472a6200/" target="_blank" rel="noopener noreferrer" className={styles.footLink}>LinkedIn</a>
                    <a href="mailto:lakshya.purohit.2105@gmail.com" className={styles.footLink}>Email</a>
                </div>
            </div>
        </footer>
    );
}
