'use client';

import ThemeProvider from '@/components/ThemeProvider';
import CustomCursor from '@/components/CustomCursor';

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <CustomCursor />
            {children}
        </ThemeProvider>
    );
}
