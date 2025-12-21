import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Vịt Lại Code Dạo - Dự án đã thực hiện",
  description:
    "Xem các dự án web và mobile app đã được VietDev thực hiện. Portfolio với React, Next.js, Node.js và nhiều công nghệ hiện đại khác.",
  keywords: [
    "portfolio",
    "vitlaicodedao projects",
    "web projects",
    "React projects",
    "Next.js portfolio",
    "fullstack developer Vietnam",
    "dự án lập trình",
  ],
  openGraph: {
    title: "Projects | Vịt Lại Code Dạo",
    description:
      "Xem các dự án web và mobile app đã được VietDev thực hiện với React, Next.js, Node.js",
    url: "https://vitlaicodedao.tech/projects",
    type: "website",
    images: [
      {
        url: "https://vitlaicodedao.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vịt Lại Code Dạo - Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Vịt Lại Code Dạo",
    description:
      "Xem các dự án web và mobile app đã được VietDev thực hiện với React, Next.js, Node.js",
    images: ["https://vitlaicodedao.tech/og-image.png"],
  },
  alternates: {
    canonical: "https://vitlaicodedao.tech/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
