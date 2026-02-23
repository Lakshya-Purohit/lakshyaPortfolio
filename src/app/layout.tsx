import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lakshya Purohit | Software Developer & System Architect — Portfolio",
  description:
    "Lakshya Purohit is a Software Developer and System Architect from Jaipur, India. Expert in ASP.NET Core, Angular, WebRTC, PostgreSQL, Python, and enterprise backend systems. View projects, experience, and certifications.",
  keywords: [
    "Lakshya Purohit",
    "Lakshya",
    "Purohit",
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
    "India",
    "Next.js",
    "React",
    "PostgreSQL",
    "Docker",
    "Microservices",
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
      "Software Developer engineering scalable backend systems, real-time video, and enterprise solutions. Explore projects, experience, and certifications.",
    url: "https://lakshyapurohit.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lakshya Purohit | Software Developer & System Architect",
    description:
      "Software Developer engineering scalable backend systems, real-time video, and enterprise solutions.",
    creator: "@lakshyapurohit",
  },
  alternates: {
    canonical: "https://lakshyapurohit.dev",
  },
  category: "technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lakshya Purohit",
  url: "https://lakshyapurohit.dev",
  jobTitle: "Software Developer & System Architect",
  description:
    "Software Developer engineering scalable backend systems, real-time video streaming, and enterprise solutions.",
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
  ],
  sameAs: [
    "https://github.com/lakshyapurohit",
    "https://linkedin.com/in/lakshyapurohit",
  ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
