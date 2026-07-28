import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { CoverImage } from "@/components/CoverImage";
import { JsonLd } from "@/components/JsonLd";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MarkdownContent } from "@/components/markdown/MarkdownContent";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { createPublicClient } from "@/integrations/supabase/public";
import {
  SITE_URL,
  SITE_NAME,
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "@/lib/site";

/** Blog content changes rarely; serve it from cache and refresh in the background. */
export const revalidate = 300;

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
  updated_at: string | null;
  published: boolean;
}

/**
 * Prerender every published post at build time. Posts published later are still
 * served (and then cached) on first request, since `dynamicParams` defaults to
 * true.
 */
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("published", true);

  return (data || []).map(({ slug }) => ({ slug }));
}

async function getBlog(slug: string): Promise<Blog | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data as Blog;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return { title: "Blog Not Found", robots: { index: false, follow: false } };
  }

  const image = blog.cover_image || DEFAULT_OG_IMAGE;

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      url: absoluteUrl(`/blog/${slug}`),
      siteName: SITE_NAME,
      images: [{ url: image, width: 1200, height: 630, alt: blog.title }],
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at || blog.created_at,
      authors: [AUTHOR_NAME],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [image],
    },
    alternates: {
      canonical: absoluteUrl(`/blog/${slug}`),
    },
  };
}

/** Rough reading time; Vietnamese and English both land near 200 wpm. */
function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.ceil(words / 200)) };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const { words, minutes } = readingTime(blog.content);
  const url = absoluteUrl(`/blog/${slug}`);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: blog.title.slice(0, 110),
    description: blog.excerpt,
    image: blog.cover_image || DEFAULT_OG_IMAGE,
    datePublished: blog.created_at,
    dateModified: blog.updated_at || blog.created_at,
    wordCount: words,
    timeRequired: `PT${minutes}M`,
    inLanguage: "vi-VN",
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
      sameAs: SOCIAL_PROFILES,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/web-app-manifest-512x512.png"),
      },
    },
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blogs"),
      },
      { "@type": "ListItem", position: 3, name: blog.title, item: url },
    ],
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={articleStructuredData} />
      <JsonLd data={breadcrumbStructuredData} />
      <ReadingProgress />
      <Navigation />

      <main className="container mx-auto px-4 py-28 md:py-32">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/blogs"
            className="neo-shadow mb-8 inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 text-sm font-bold transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>

        {blog.cover_image && (
          <div className="neo-shadow mx-auto mb-10 max-w-4xl border-2 border-border bg-card p-2">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-border/50">
              <CoverImage
                src={blog.cover_image}
                alt={blog.title}
                sizes="(max-width: 896px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        )}

        <article className="mx-auto max-w-4xl">
          <h1 className="mb-6 font-heading text-4xl font-black text-foreground md:text-5xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mb-8 border-l-4 border-primary pl-4 text-lg text-foreground/70 md:text-xl">
              {blog.excerpt}
            </p>
          )}

          <div className="mb-10 flex flex-wrap items-center gap-6 border-y-2 border-border py-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{minutes} phút đọc</span>
            </div>
          </div>

          <TableOfContents content={blog.content} />

          <MarkdownContent content={blog.content} />
        </article>
      </main>
      <Footer />
    </div>
  );
}
