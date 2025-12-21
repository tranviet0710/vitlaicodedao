import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Vịt Lại Code Dạo - Chia sẻ kiến thức lập trình",
  description:
    "Đọc các bài viết về lập trình web, React, Next.js, TypeScript, và nhiều công nghệ khác. Chia sẻ kinh nghiệm và kiến thức từ VietDev.",
  keywords: [
    "blog lập trình",
    "vitlaicodedao blog",
    "học lập trình",
    "React tutorial",
    "Next.js hướng dẫn",
    "TypeScript",
    "web development Vietnam",
  ],
  openGraph: {
    title: "Blog | Vịt Lại Code Dạo",
    description:
      "Đọc các bài viết về lập trình web, React, Next.js, TypeScript từ VietDev",
    url: "https://vitlaicodedao.tech/blogs",
    type: "website",
    images: [
      {
        url: "https://vitlaicodedao.tech/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vịt Lại Code Dạo - Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Vịt Lại Code Dạo",
    description:
      "Đọc các bài viết về lập trình web, React, Next.js, TypeScript từ VietDev",
    images: ["https://vitlaicodedao.tech/og-image.png"],
  },
  alternates: {
    canonical: "https://vitlaicodedao.tech/blogs",
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
