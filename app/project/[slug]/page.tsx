import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import DOMPurify from 'dompurify'
import { createClient } from '@/integrations/supabase/server'

interface Project {
  id: string
  title: string
  description: string
  content: string | null
  thumbnail: string | null
  category: string
  demo_url: string | null
  github_url: string | null
  tech_stack: string[] | null
  slug: string
}

async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null
  return data
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug)

  if (!project) {
    notFound()
  }

  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: project.thumbnail,
    author: {
      "@type": "Person",
      name: "Viet Dev",
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData) }}
      />
      <Navigation />
      <main className="container mx-auto px-4 py-32">
        <Link href="/#projects">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          {project.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-[400px] object-cover"
              />
            </div>
          )}

          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.description}</p>
          </div>

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 mb-8">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Demo
                </Button>
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </Button>
              </a>
            )}
          </div>

          {project.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(project.content),
                }}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
