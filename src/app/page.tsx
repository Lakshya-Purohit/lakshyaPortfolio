'use client';

import { useState, useCallback, useEffect } from 'react';
import ThemeProvider from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import AmbientBackground from '@/components/AmbientBackground';
import Preloader from '@/components/Preloader';
import AIChatbot from '@/components/AIChatbot';
import SearchPalette from '@/components/SearchPalette';
import Navbar from '@/components/Navbar';
import CodeEditorScene from '@/components/CodeEditorScene';
import HeroSection from '@/components/HeroSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import CertificationsSection from '@/components/CertificationsSection';
import BlogSection from '@/components/BlogSection';
import WhyChooseMe from '@/components/WhyChooseMe';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import PeekingCharacter from '@/components/PeekingCharacter';

function MobileDisclaimer() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show on mobile
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="mobileDisclaimer">
      💻 Open on desktop for the best experience
      <button onClick={() => setShow(false)}>✕</button>
    </div>
  );
}

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setShowContent(true);
  }, []);

  return (
    <ThemeProvider>
      <SmoothScroll>
        <CustomCursor />
        <PeekingCharacter />
        <AmbientBackground />
        <Preloader onComplete={handlePreloaderComplete} />
        <AIChatbot />
        <SearchPalette />
        <MobileDisclaimer />

        <div style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          <Navbar />

          <main>
            {/* 3D Code Editor Landing — Pinned scroll */}
            <CodeEditorScene />

            {/* Hero — Image Left, Content Right */}
            <HeroSection />

            {/* Experience Timeline */}
            <ExperienceSection />

            {/* Projects Showcase with Modal */}
            <ProjectsShowcase />

            {/* Testimonials — Sliding Panel */}
            <TestimonialsSection />

            {/* Certifications */}
            <CertificationsSection />

            {/* Blog */}
            <BlogSection />

            {/* Why Choose Me */}
            <WhyChooseMe />

            {/* Contact */}
            <ContactSection />
          </main>

          <Footer />
        </div>
      </SmoothScroll>
    </ThemeProvider>
  );
}
