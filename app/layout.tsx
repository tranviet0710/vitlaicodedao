import type { Metadata } from "next";
import Script from "next/script";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";

// Modern sans-serif for body text
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Monospace for code and technical elements
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Elegant serif for headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vịt Lại Code Dạo | VietDev - Fullstack Developer",
    template: "%s | Vịt Lại Code Dạo",
  },
  description:
    "Hey, Mình là VietDev, Fullstack Developer với hơn 5 năm kinh nghiệm. Chuyên cung cấp các dịch vụ về website, application. Dạy lập trình web, chia sẻ kiến thức IT.",
  keywords: [
    "vitlaicodedao",
    "vit lai code dao",
    "vịt lại code dạo",
    "VietDev",
    "Fullstack Developer",
    "lập trình web",
    "Web Development",
    "React",
    "Next.js",
    "TypeScript",
    "dạy lập trình",
    "học lập trình online",
    "freelance developer Vietnam",
    "thuê lập trình viên",
    "làm website",
  ],
  authors: [{ name: "VietDev", url: SITE_URL }],
  creator: "VietDev",
  publisher: SITE_NAME,
  icons: {
    // Only reference files that exist in /public — the previous 16x16/32x32
    // entries pointed at missing files and 404'd on every page load.
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    title: "Vịt Lại Code Dạo | VietDev - Fullstack Developer",
    description:
      "Hey, Mình là VietDev, Fullstack Developer với hơn 5 năm kinh nghiệm. Chuyên cung cấp các dịch vụ về website, application. Dạy lập trình web.",
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Vịt Lại Code Dạo - VietDev Fullstack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vịt Lại Code Dạo | VietDev - Fullstack Developer",
    description:
      "Hey, Mình là VietDev, Fullstack Developer với hơn 5 năm kinh nghiệm. Chuyên cung cấp các dịch vụ về website, application.",
    images: [DEFAULT_OG_IMAGE],
    creator: "@vitlaicodedao",
  },
  other: {
    "fb:app_id": "1500482207749462",
  },
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
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'vi-VN': SITE_URL,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* og:url, og:image and fb:app_id come from the metadata export above.
            Repeating them here produced duplicate tags that scrapers pick over
            the per-page values on blog and project pages. */}
        <link rel="preconnect" href="https://zdsmholjkxttwtuirakc.supabase.co" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Vịt Lại Code Dạo — Blog"
          href="/feed.xml"
        />
        {/* Framer Motion renders its `initial` state into the HTML, so entrance
            animations ship as opacity:0 and only become visible once the client
            bundle runs. If it never does, the page would look empty. */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1 !important}`}</style>
        </noscript>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D33K2DPTHT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D33K2DPTHT');
          `}
        </Script>
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
