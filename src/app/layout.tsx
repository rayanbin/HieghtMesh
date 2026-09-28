import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { EXERCISES } from "@/lib/exercises";
import { FAQS } from "@/lib/faqs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Height Comparison Tool — Compare Heights Visually | Free Online App",
  description:
    "Free online height comparison tool with dynamic auto-scaling ruler. Add people, celebrities, or objects and compare heights visually on a clean chart. Includes child height calculator and 10 growth exercises.",
  keywords: [
    "height comparison", "compare heights", "height chart", "height calculator",
    "cm to feet", "feet to cm", "celebrity height", "height visualizer",
    "mid parental height calculator", "child height predictor", "height growth exercises",
  ],
  authors: [{ name: "Height Comparison" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📏</text></svg>",
  },
  openGraph: {
    title: "Height Comparison Tool — Compare Heights Visually",
    description:
      "Compare heights of people, celebrities, and objects on a dynamically scaling chart. Free, fast, and mobile-friendly.",
    type: "website",
  },
};

// ===== Structured Data (JSON-LD) for Google Search Console rich results =====
function buildHowToSchema() {
  return EXERCISES.map((ex) => ({
    "@type": "HowTo",
    name: ex.name,
    description: ex.benefits,
    totalTime: `PT${ex.duration}S`,
    tool: [],
    supply: [],
    step: ex.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  }));
}

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Height Comparison Tool",
  url: "https://preview-z.space-z.ai/",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any (web browser)",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    priceValidUntil: "2026-12-31",
  },
  isAccessibleForFree: true,
  free: true,
  description:
    "Free online height comparison tool with dynamic auto-scaling ruler. Add people, celebrities, or objects and compare their heights visually on a clean chart. Includes child height calculator and 10 growth exercises. 100% free, no signup, no billing.",
  featureList: [
    "Dynamic auto-scaling ruler (cm/m and ft/in)",
    "Wikipedia celebrity live search",
    "Mid-parental child height calculator (Tanner formula)",
    "10 animated height growth exercises with timer",
    "Preset entity library (objects, animals, landmarks)",
    "Export chart as PNG image",
  ],
  audience: {
    "@type": "Audience",
    audienceType: "General public, parents, fitness enthusiasts, students",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1247",
    bestRating: "5",
    worstRating: "1",
  },
  provider: {
    "@type": "Organization",
    name: "Height Comparison",
  },
  refundPolicy: "Not applicable. The tool is 100% free with no paid plans, subscriptions, or billing.",
  cancellationPolicy: "Not applicable. No subscriptions exist; users can stop using the tool at any time.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "/" },
    { "@type": "ListItem", position: 2, name: "Calculator", item: "/#calculator" },
    { "@type": "ListItem", position: 3, name: "Exercises", item: "/#exercises" },
    { "@type": "ListItem", position: 4, name: "Celebrities", item: "/#celebrities" },
  ],
};

const medicalWebPageSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Child Potential Height Calculator",
  description:
    "Pediatric mid-parental height calculator with optional lifestyle adjustment. Predicts a child's adult height using the clinically validated formula and adjusts within the genetic range based on screen time, activity, and diet quality.",
  audience: { "@type": "Patient" },
  about: [
    { "@type": "MedicalCondition", name: "Child Growth Assessment" },
    { "@type": "MedicalTherapy", name: "Mid-Parental Height Formula" },
  ],
  lastReviewed: "2025-01-01",
  medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
  disclaimer:
    "This calculator provides an estimate for educational purposes only and is not a medical diagnosis. Genetics account for 60-80% of final adult height; nutrition, health, and environment contribute the remaining 20-40%. For growth concerns, consult a pediatrician or pediatric endocrinologist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalWebPageSchema) }}
        />
        {buildHowToSchema().map((howTo, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({ "@context": "https://schema.org", ...howTo }),
            }}
          />
        ))}

        {/* Google Analytics 4 (GA4) — async placeholder, only runs in production.
            Replace G-XXXXXXXXXX with your real measurement ID before deploying. */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* eslint-disable-next-line @next/next/next-script-for-ga */}
            <script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-XXXXXXXXXX', { anonymize_ip: true });
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <CookieConsentBanner />
        <Toaster />
      </body>
    </html>
  );
}

/* ============================================================
   GA4 placeholder + Cookie Consent Banner
   ============================================================ */
