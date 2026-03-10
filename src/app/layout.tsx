import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://lakshyapurohit.dev'),
  title: {
    default: "Lakshya Purohit | Software Developer & System Architect — Portfolio",
    template: "%s | Lakshya Purohit",
  },
  description:
    "Lakshya Purohit is a Software Developer and System Architect from Jaipur, India. Expert in ASP.NET Core, Angular, WebRTC, PostgreSQL, Python, Docker, and enterprise backend systems. Specializing in scalable architectures, real-time communication, and high-performance full-stack applications. View projects, experience, skills, and certifications.",
  keywords: [
    "Lakshya Purohit",
    "Lakshya Purohit portfolio",
    "Lakshya Purohit developer",
    "Software Developer",
    "System Architect",
    "Backend Developer",
    "Full Stack Developer",
    "ASP.NET Core Developer",
    "Angular Developer",
    "WebRTC Developer",
    "Python Developer",
    "Portfolio",
    "Jaipur Developer",
    "India Software Developer",
    "Next.js",
    "React Developer",
    "PostgreSQL",
    "Docker",
    "Microservices",
    "TypeScript",
    "Node.js",
    "C# Developer",
    "Redis",
    "MongoDB",
    "Flask",
    "SQL Server",
    "Computer Vision",
    "OCR Developer",
    "real-time systems",
    "scalable backend architecture",
    "enterprise software developer",
    "hire software developer India",
    "best developer portfolio",
  ],
  authors: [{ name: "Lakshya Purohit", url: "https://lakshyapurohit.dev" }],
  creator: "Lakshya Purohit",
  publisher: "Lakshya Purohit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lakshya Purohit — Portfolio",
    title: "Lakshya Purohit | Software Developer & System Architect",
    description:
      "Software Developer engineering scalable backend systems, real-time video, and enterprise solutions. Expert in ASP.NET Core, Angular, WebRTC, PostgreSQL, Python, Docker. Explore projects, experience, and certifications.",
    url: "https://lakshyapurohit.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakshya Purohit | Software Developer & System Architect",
    description:
      "Software Developer engineering scalable backend systems, real-time video, and enterprise solutions. ASP.NET Core, Angular, WebRTC, Python.",
    creator: "@lakshyapurohit",
  },
  alternates: {
    canonical: "https://lakshyapurohit.dev",
  },
  category: "technology",
  other: {
    "google-site-verification": "",
  },
};

// JSON-LD Structured Data — Person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://lakshyapurohit.dev/#person",
  name: "Lakshya Purohit",
  url: "https://lakshyapurohit.dev",
  jobTitle: "Software Developer & System Architect",
  description:
    "Lakshya Purohit is a Software Developer and System Architect from Jaipur, India, specializing in scalable backend systems, real-time communication (WebRTC), enterprise solutions, and full-stack development with ASP.NET Core, Angular, Python, PostgreSQL, and Docker.",
  image: "https://lakshyapurohit.dev/profile.jpg",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  email: "lakshya.purohit.2105@gmail.com",
  knowsAbout: [
    "ASP.NET Core",
    "Angular",
    "WebRTC",
    "PostgreSQL",
    "Python",
    "Docker",
    "Microservices",
    "TypeScript",
    "Node.js",
    "Computer Vision",
    "OCR",
    "Flask",
    "SQL Server",
    "React",
    "Next.js",
    "C#",
    "Redis",
    "MongoDB",
    "Git",
    "Backend Architecture",
    "Real-time Systems",
    "Database Optimization",
  ],
  sameAs: [
    "https://github.com/lakshyapurohit",
    "https://linkedin.com/in/lakshyapurohit",
  ],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://lakshyapurohit.dev",
  },
};

// JSON-LD Structured Data — WebSite (helps AI search discover the site)
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://lakshyapurohit.dev/#website",
  url: "https://lakshyapurohit.dev",
  name: "Lakshya Purohit — Software Developer Portfolio",
  description:
    "Portfolio website of Lakshya Purohit, showcasing projects, experience, technical skills, and certifications in software development and system architecture.",
  publisher: {
    "@id": "https://lakshyapurohit.dev/#person",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#0071e3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
