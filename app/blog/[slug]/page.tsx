import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { createClient } from '@/integrations/supabase/server'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  created_at: string
  published: boolean
}

async function getBlog(slug: string): Promise<Blog | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) return null
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
      type: 'article',
      publishedTime: blog.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [blog.cover_image] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const readTime = Math.ceil(blog.content.split(" ").length / 200)

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
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
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
              className="w-full h-[400px] object-cover"
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

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
