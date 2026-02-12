import type { Metadata } from "next";
import Script from "next/script";
import {
  Space_Grotesk,
  JetBrains_Mono,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
  metadataBase: new URL("https://vitlaicodedao.tech"),
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
  authors: [{ name: "VietDev", url: "https://vitlaicodedao.tech" }],
  creator: "VietDev",
  publisher: "Vịt Lại Code Dạo",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://vitlaicodedao.tech",
    title: "Vịt Lại Code Dạo | VietDev - Fullstack Developer",
    description:
      "Hey, Mình là VietDev, Fullstack Developer với hơn 5 năm kinh nghiệm. Chuyên cung cấp các dịch vụ về website, application. Dạy lập trình web.",
    siteName: "Vịt Lại Code Dạo",
    images: [
      {
        url: "https://vitlaicodedao.tech/preview.png",
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
    images: ["https://vitlaicodedao.tech/preview.png"],
    creator: "@vitlaicodedao",
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
    canonical: "https://vitlaicodedao.tech",
    languages: {
      'vi-VN': 'https://vitlaicodedao.tech',
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
