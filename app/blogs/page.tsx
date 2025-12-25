
import { Metadata } from "next";
import BlogsContent from "@/components/BlogsContent";

export const metadata: Metadata = {
  title: "Blog - VietDev | Web Development Insights & Tutorials",
  description:
    "Explore in-depth articles, tutorials, and insights on web development, React, Node.js, TypeScript, and modern software engineering practices.",
  keywords:
    "web development blog, React tutorials, Node.js guides, TypeScript tips, programming articles, software engineering",
  openGraph: {
    title: "Blog - VietDev | Web Development Insights & Tutorials",
    description:
      "Explore in-depth articles, tutorials, and insights on web development, React, Node.js, TypeScript, and modern software engineering practices.",
    type: "website",
    url: "https://vitlaicodedao.tech/blogs",
    siteName: "Viet Dev",
  },
  alternates: {
    canonical: "https://vitlaicodedao.tech/blogs",
  },
};

export default function BlogsPage() {
  return <BlogsContent />;
}
