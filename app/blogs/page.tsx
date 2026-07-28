import { Metadata } from "next";
import BlogsContent from "@/components/BlogsContent";
import { JsonLd } from "@/components/JsonLd";
import { createPublicClient } from "@/integrations/supabase/public";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const revalidate = 300;

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
    url: absoluteUrl("/blogs"),
    siteName: SITE_NAME,
  },
  alternates: {
    canonical: absoluteUrl("/blogs"),
    types: {
      "application/rss+xml": absoluteUrl("/feed.xml"),
    },
  },
};

export default async function BlogsPage() {
  const supabase = createPublicClient();
  const { data: blogs } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const posts = blogs || [];

  /** Tells search engines this page is a list of articles, not one article. */
  const listStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${SITE_NAME} — Blog`,
    url: absoluteUrl("/blogs"),
    inLanguage: "vi-VN",
    blogPost: posts.slice(0, 20).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.created_at,
      dateModified: post.updated_at || post.created_at,
    })),
  };

  return (
    <>
      <JsonLd data={listStructuredData} />
      <BlogsContent initialBlogs={posts} />
    </>
  );
}
