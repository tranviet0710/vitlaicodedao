import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { createClient } from "@/integrations/supabase/server";
import Image from "next/image";

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
  published: boolean;
}

async function getBlog(slug: string): Promise<Blog | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
      type: "article",
      publishedTime: blog.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [blog.cover_image] : [],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
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

  const readTime = Math.ceil(blog.content.split(" ").length / 200);

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.cover_image || "https://vitlaicodedao.tech/og-image.jpg",
    datePublished: blog.created_at,
    dateModified: blog.created_at,
    author: {
      "@type": "Person",
      name: "Viet Dev",
      url: "https://vitlaicodedao.tech",
    },
    publisher: {
      "@type": "Organization",
      name: "VietDev",
      logo: {
        "@type": "ImageObject",
        url: "https://vitlaicodedao.tech/logo.png",
      },
    },
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vitlaicodedao.tech",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://vitlaicodedao.tech/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `https://vitlaicodedao.tech/blog/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <Navigation />
      <main className="container mx-auto px-4 py-32">
        <Link href="/#blog">
          <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 group">
            <span className="flex items-center gap-2 border-2 border-border bg-card px-4 py-2 neo-shadow group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </span>
          </Button>
        </Link>

        {blog.cover_image && (
          <div className="mb-8 border-2 border-border neo-shadow bg-card p-2">
            <div className="relative h-[400px] w-full overflow-hidden border border-border/50">
              <Image
                src={blog.cover_image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-foreground font-heading">{blog.title}</h1>

          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString()}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-foreground prose-headings:font-bold
            prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:leading-tight
            prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:text-primary prose-h2:border-b-2 prose-h2:border-border prose-h2:pb-3
            prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-5 prose-h3:mt-8
            prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6
            prose-li:text-foreground/90 prose-li:my-2
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-accent/20 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-foreground/90
            prose-img:rounded-none prose-img:border-2 prose-img:border-border prose-img:neo-shadow prose-img:my-8
            prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono
            prose-pre:bg-card prose-pre:border-2 prose-pre:border-border prose-pre:neo-shadow prose-pre:text-card-foreground
            "
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                code: ({
                  inline,
                  className,
                  children,
                  ...props
                }: {
                  inline?: boolean;
                  className?: string;
                  children?: React.ReactNode;
                }) => {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match) {
                    return (
                      <div className="relative group my-6">
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded font-medium">
                          {match[1]}
                        </div>
                        <pre className="bg-card border-2 border-border p-4 overflow-x-auto neo-shadow text-card-foreground">
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </div>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
                img: ({ node, ...props }) => {
                  // Ensure we have a valid src string for Next.js Image
                  const src = props.src || "";
                  const alt = props.alt || "";
                  
                  // Use standard img tag if src is not valid or empty
                  if (!src) return <img {...props} className="w-full border-2 border-border neo-shadow" />;

                  return (
                    <figure className="my-8">
                      <div className="relative w-full h-auto min-h-[300px] border-2 border-border neo-shadow bg-card p-2">
                        <Image
                          src={src}
                          alt={alt}
                          width={800}
                          height={500}
                          className="w-full h-auto"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      {alt && (
                        <figcaption className="text-center text-sm text-muted-foreground italic mt-3">
                          {alt}
                        </figcaption>
                      )}
                    </figure>
                  );
                },
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary bg-accent/20 pl-6 pr-4 py-4 italic my-6 rounded-r-lg text-foreground/90"
                    {...props}
                  >
                    {props.children}
                  </blockquote>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6 border-2 border-border neo-shadow">
                    <table
                      className="min-w-full bg-card"
                      {...props}
                    />
                  </div>
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
