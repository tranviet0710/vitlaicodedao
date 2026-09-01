import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { createPublicClient } from "@/integrations/supabase/public";
import { CoverImage } from "@/components/CoverImage";
import { MarkdownContent } from "@/components/markdown/MarkdownContent";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";

interface Project {
  id: string;
  title: string;
  description: string;
  content: string | null;
  thumbnail: string | null;
  category: string;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
  slug: string;
}

/** Project pages are public and identical for everyone; cache and revalidate. */
export const revalidate = 300;

/** Prerender known projects; new ones are cached on first request. */
export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase.from("projects").select("slug");

  return (data || []).map(({ slug }) => ({ slug }));
}

async function getProject(slug: string): Promise<Project | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [{ url: project.thumbnail }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: project.thumbnail ? [project.thumbnail] : [],
    },
    alternates: {
      canonical: `/project/${slug}`,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.description,
    image: project.thumbnail,
    codeRepository: project.github_url,
    author: {
      "@type": "Person",
      name: "Viet Dev",
    },
    programmingLanguage: project.tech_stack,
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.vitlaicodedao.tech",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://www.vitlaicodedao.tech/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://www.vitlaicodedao.tech/project/${slug}`,
      },
    ],
  };

  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
  const hasLinks = Boolean(project.demo_url || project.github_url);

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <ReadingProgress />
      <Navigation />

      <main className="container mx-auto px-4 py-28 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/#projects"
            className="neo-shadow mb-8 inline-flex items-center gap-2 border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Case Studies
          </Link>

          {/* Cover and title overlap into one poster block. */}
          <header className="mb-14">
            {project.thumbnail && (
              <div className="neo-shadow border-2 border-border bg-card p-2">
                <div className="relative aspect-video w-full overflow-hidden border-2 border-border">
                  <CoverImage
                    src={project.thumbnail}
                    alt={project.title}
                    sizes="(max-width: 1024px) 100vw, 1152px"
                    priority
                  />
                </div>
              </div>
            )}

            <div
              className={`neo-shadow relative z-10 mx-auto max-w-4xl border-2 border-border bg-card px-6 py-8 text-center md:px-10 md:py-10 ${
                project.thumbnail ? "-mt-10 md:-mt-16" : ""
              }`}
            >
              <span className="neo-shadow-sm mb-5 inline-block border-2 border-border bg-primary px-4 py-1 font-bold uppercase tracking-wider text-primary-foreground">
                {project.category}
              </span>
              <h1 className="mb-5 font-heading text-3xl font-black uppercase leading-tight text-foreground md:text-5xl">
                {project.title}
              </h1>
              <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
                {project.description}
              </p>

              {hasLinks && (
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-shadow inline-flex items-center gap-2 border-2 border-border bg-primary px-5 py-3 font-bold uppercase text-primary-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neo-shadow inline-flex items-center gap-2 border-2 border-border bg-card px-5 py-3 font-bold uppercase text-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                    >
                      <Github className="h-4 w-4" />
                      Source
                    </a>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* `minmax(0, 1fr)` keeps wide content (code blocks, tables, pasted
              rules) inside the column instead of stretching the track. */}
          <div className="mb-20 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0">
              {project.content ? (
                <article className="neo-shadow border-2 border-border bg-card">
                  <h2 className="flex items-center gap-2 border-b-2 border-border bg-primary px-6 py-4 font-heading text-lg font-black uppercase tracking-wide text-primary-foreground md:text-xl">
                    <span aria-hidden="true">#</span> Case Study Analysis
                  </h2>
                  <div className="overflow-x-hidden px-6 py-8 md:px-8">
                    <TableOfContents content={project.content} />
                    <MarkdownContent content={project.content} />
                  </div>
                </article>
              ) : (
                <div className="neo-shadow border-2 border-border bg-card p-8 text-muted-foreground">
                  The full case study for this project is still being written.
                </div>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {techStack.length > 0 && (
                <section className="neo-shadow-sm border-2 border-border bg-accent/20 p-6">
                  <h2 className="mb-4 flex items-center gap-2 border-b-2 border-border pb-2 font-heading text-lg font-black uppercase text-foreground">
                    <Layers className="h-5 w-5" />
                    Tech Stack
                  </h2>
                  <ul className="flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                      <li
                        key={tech}
                        className="border-2 border-border bg-card px-3 py-1 font-mono text-sm font-bold text-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {hasLinks && (
                <section className="neo-shadow-sm border-2 border-border bg-card p-6">
                  <h2 className="mb-4 border-b-2 border-border pb-2 font-heading text-lg font-black uppercase text-foreground">
                    Links
                  </h2>
                  <div className="flex flex-col gap-3">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-shadow flex items-center justify-center gap-2 border-2 border-border bg-primary px-4 py-3 font-bold uppercase text-primary-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      >
                        <ExternalLink className="h-5 w-5" />
                        View Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neo-shadow flex items-center justify-center gap-2 border-2 border-border bg-card px-4 py-3 font-bold uppercase text-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                      >
                        <Github className="h-5 w-5" />
                        View Source
                      </a>
                    )}
                  </div>
                </section>
              )}
            </aside>
          </div>

          {/* CTA Section */}
          <div className="neo-shadow relative overflow-hidden border-2 border-border bg-primary p-8 text-center text-primary-foreground md:p-12">
            <div className="relative z-10">
              <h2 className="mb-6 font-heading text-2xl font-black uppercase md:text-4xl">
                Need a similar solution?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg font-medium opacity-90 md:text-xl">
                Let&apos;s discuss how we can engineer a robust architecture for
                your business needs.
              </p>
              <a href="/#contact">
                <Button
                  size="lg"
                  className="neo-shadow border-2 border-border bg-card px-8 py-6 text-lg font-black uppercase text-foreground transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none md:text-xl"
                >
                  Book a Strategy Call
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </a>
            </div>

            {/* Decorative background pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, currentColor 2px, transparent 2.5px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
