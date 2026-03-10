'use client';

import { useEffect } from 'react';

/**
 * Sets up a global IntersectionObserver that watches all [data-reveal] elements.
 * When they scroll into view, they get data-revealed="true" which triggers CSS transition.
 * Renders nothing — just a side-effect component.
 */
export default function ScrollRevealInit() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target as HTMLElement;
                        // Apply stagger delay if specified
                        const delay = el.dataset.revealDelay;
                        if (delay) {
                            setTimeout(() => {
                                el.dataset.revealed = 'true';
                            }, parseInt(delay, 10));
                        } else {
                            el.dataset.revealed = 'true';
                        }
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        // Observe all current [data-reveal] elements
        document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

        // Also watch for dynamically added elements
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.dataset.reveal !== undefined) {
                            observer.observe(node);
                        }
                        node.querySelectorAll('[data-reveal]').forEach((child) => {
                            observer.observe(child);
                        });
                    }
                });
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);

    return null;
}
