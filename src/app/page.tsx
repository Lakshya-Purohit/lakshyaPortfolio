'use client';

import { useState, useEffect } from 'react';
import ThemeProvider from '@/components/ThemeProvider';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import AmbientBackground from '@/components/AmbientBackground';
import AIChatbot from '@/components/AIChatbot';
import SearchPalette from '@/components/SearchPalette';
import Navbar from '@/components/Navbar';
import HeroLanding from '@/components/HeroLanding';
import SkillsOrbit from '@/components/SkillsOrbit';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsShowcase from '@/components/ProjectsShowcase';
import TestimonialsSection from '@/components/TestimonialsSection';
import CertificationsSection from '@/components/CertificationsSection';
import BlogSection from '@/components/BlogSection';
import WhyChooseMe from '@/components/WhyChooseMe';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import PeekingCharacter from '@/components/PeekingCharacter';
import ScrollRevealInit from '@/components/ScrollRevealInit';

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
  return (
    <ThemeProvider>
      <SmoothScroll>
        <CustomCursor />
        <PeekingCharacter />
        <ScrollRevealInit />
        <AmbientBackground />
        <AIChatbot />
        <SearchPalette />
        <MobileDisclaimer />

        <Navbar />

        <main>
          {/* Hero (left) + Code Editor (right) — merged landing */}
          <HeroLanding />

          {/* Animated Bouncing Skills */}
          <SkillsOrbit />

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
      </SmoothScroll>
    </ThemeProvider>
  );
}
