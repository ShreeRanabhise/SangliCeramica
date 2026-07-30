import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sangliceramica.com";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Sangli Ceramica | Premium Tiles, Sanitaryware & Doors",
    template: "%s | Sangli Ceramica",
  },
  description: "Discover Sangli's most exclusive collection of luxury tiles, elegant sanitaryware, and premium designer doors. Transform your living & architectural spaces with Sangli Ceramica.",
  keywords: [
    "Sangli Ceramica",
    "Tiles showroom Sangli",
    "Sanitaryware Sangli",
    "Luxury tiles Maharashtra",
    "Bath fittings Sangli",
    "Designer doors Sangli",
    "Kajaria tiles Sangli",
    "Ceramic tiles India",
  ],
  authors: [{ name: "Sangli Ceramica" }],
  creator: "Sangli Ceramica",
  publisher: "Sangli Ceramica",
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
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Sangli Ceramica",
    title: "Sangli Ceramica | Premium Tiles, Sanitaryware & Doors",
    description: "Discover Sangli's premier showroom for luxury tiles, bath fittings, and designer doors.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Sangli Ceramica Showroom",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sangli Ceramica | Premium Tiles, Sanitaryware & Doors",
    description: "Discover Sangli's premier showroom for luxury tiles, bath fittings, and designer doors.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "name": "Sangli Ceramica",
    "image": `${baseUrl}/icon-512x512.png`,
    "url": baseUrl,
    "telephone": "+919876543210",
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sangli",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "description": "Premier destination for luxury tiles, elegant sanitaryware, and premium doors in Sangli, Maharashtra."
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon-48x48.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
