import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.lakhsyapurohit.online'),
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
  authors: [{ name: "Lakshya Purohit", url: "https://www.lakhsyapurohit.online" }],
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
    url: "https://www.lakhsyapurohit.online",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakshya Purohit | Software Developer & System Architect",
    description:
      "Software Developer engineering scalable backend systems, real-time video, and enterprise solutions. ASP.NET Core, Angular, WebRTC, Python.",
    creator: "@lakshyapurohit",
  },
  alternates: {
    canonical: "https://www.lakhsyapurohit.online",
  },
  category: "technology",
  other: {
    "google-site-verification": "",
    "msvalidate.01": "F9CFDFBDB2B8E94DA2E3D833280C1D0E",
  },
};

// JSON-LD Structured Data — Person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.lakhsyapurohit.online/#person",
  name: "Lakshya Purohit",
  url: "https://www.lakhsyapurohit.online",
  jobTitle: "Software Developer & System Architect",
  description:
    "Lakshya Purohit is a Software Developer and System Architect from Jaipur, India, specializing in scalable backend systems, real-time communication (WebRTC), enterprise solutions, and full-stack development with ASP.NET Core, Angular, Python, PostgreSQL, and Docker.",
  image: "https://www.lakhsyapurohit.online/profile.jpg",
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
    "@id": "https://www.lakhsyapurohit.online",
  },
};

// JSON-LD Structured Data — WebSite (helps AI search discover the site)
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.lakhsyapurohit.online/#website",
  url: "https://www.lakhsyapurohit.online",
  name: "Lakshya Purohit — Software Developer Portfolio",
  description:
    "Portfolio website of Lakshya Purohit, showcasing projects, experience, technical skills, and certifications in software development and system architecture.",
  publisher: {
    "@id": "https://www.lakhsyapurohit.online/#person",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="theme-color" content="#0071e3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
