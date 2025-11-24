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

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      <Navigation />
      <main className="container mx-auto px-4 py-32">
        <Link href="/#blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {blog.cover_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={blog.cover_image}
              alt={blog.title}
              className="w-full h-[400px] object-inherit"
            />
          </div>
        )}

        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>

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
            prose-headings:scroll-mt-20
            prose-h1:text-4xl prose-h1:md:text-5xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-10 prose-h1:text-foreground
            prose-h2:text-3xl prose-h2:md:text-4xl prose-h2:font-bold prose-h2:mb-5 prose-h2:mt-12 prose-h2:text-primary prose-h2:border-b prose-h2:border-border prose-h2:pb-3
            prose-h3:text-2xl prose-h3:md:text-3xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-foreground
            prose-h4:text-xl prose-h4:md:text-2xl prose-h4:font-semibold prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-foreground
            prose-p:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-p:mb-5 prose-p:text-foreground/85
            prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary prose-a:transition-colors
            prose-strong:text-foreground prose-strong:font-semibold
            prose-em:text-foreground/80
            prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:my-6
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-foreground/90
            prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6
            prose-li:my-2 prose-li:text-foreground/85 prose-li:leading-relaxed
            prose-li::marker:text-primary
            prose-img:rounded-lg prose-img:my-8 prose-img:shadow-lg
            prose-hr:border-border prose-hr:my-10
            prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden prose-table:my-6
            prose-thead:bg-muted
            prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:border-b prose-th:border-border
            prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-border
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
                        <pre className="bg-muted border border-border rounded-lg p-4 overflow-x-auto">
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
                img: ({ node, ...props }) => (
                  <figure className="my-8">
                    <img {...props} className="w-full rounded-lg shadow-lg" />
                    {props.alt && props.alt !== "" && (
                      <figcaption className="text-center text-sm text-muted-foreground italic mt-3">
                        {props.alt}
                      </figcaption>
                    )}
                  </figure>
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary bg-muted/50 pl-6 pr-4 py-4 italic my-6 rounded-r"
                    {...props}
                  >
                    {props.children}
                  </blockquote>
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6">
                    <table
                      className="min-w-full border border-border rounded-lg"
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
