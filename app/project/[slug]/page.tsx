import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DOMPurify from "dompurify";
import { createClient } from "@/integrations/supabase/server";
import Image from "next/image";
import { marked } from "marked";

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

async function getProject(slug: string): Promise<Project | null> {
  const supabase = await createClient();
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
        item: "https://vitlaicodedao.tech",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: "https://vitlaicodedao.tech/projects",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://vitlaicodedao.tech/project/${slug}`,
      },
    ],
  };

  // Convert markdown to HTML then sanitize
  const { JSDOM } = await import("jsdom");
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);
  
  const markdownContent = project.content || "";
  const htmlContent = marked.parse(markdownContent) as string;
  const sanitizedContent = purify.sanitize(htmlContent);

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
      <Navigation />
      <main className="container mx-auto px-4 py-32">
        <Link href="/#projects">
          <Button variant="ghost" className="mb-8 hover:bg-transparent p-0 group">
             <span className="flex items-center gap-2 border-2 border-border bg-card px-4 py-2 neo-shadow group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Case Studies
             </span>
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto">
          <div className="mb-12 border-2 border-border bg-card p-2 neo-shadow">
             {project.thumbnail && (
               <div className="relative aspect-video w-full overflow-hidden border-2 border-border">
                 <Image
                   src={project.thumbnail}
                   alt={project.title}
                   fill
                   className="object-cover"
                   priority
                 />
               </div>
             )}
          </div>

          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-1 bg-primary text-primary-foreground font-bold uppercase tracking-wider mb-6 border-2 border-border neo-shadow-sm">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase font-heading leading-tight text-foreground">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-3xl mx-auto">
              {project.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
             <div className="md:col-span-2 space-y-8">
                 <div className="border-2 border-border p-8 bg-card neo-shadow">
                    <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2 text-foreground">
                       <span className="text-primary">#</span> Case Study Analysis
                    </h3>
                    {sanitizedContent && (
                      <div className="prose prose-lg dark:prose-invert prose-headings:font-black prose-headings:uppercase prose-p:font-medium max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sanitizedContent,
                          }}
                        />
                      </div>
                    )}
                 </div>
             </div>

             <div className="space-y-8">
                <div className="border-2 border-border p-6 bg-accent/20 neo-shadow-sm sticky top-24">
                   <h3 className="text-xl font-black uppercase mb-4 border-b-2 border-border pb-2 text-foreground">
                      Tech Stack
                   </h3>
                   {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-8">
                       {project.tech_stack.map((tech, index) => (
                         <span
                           key={index}
                           className="px-3 py-1 bg-card border-2 border-border text-foreground text-sm font-bold font-mono"
                         >
                           {tech}
                         </span>
                       ))}
                     </div>
                   )}

                   <div className="flex flex-col gap-4">
                     {project.demo_url && (
                       <a
                         href={project.demo_url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full"
                       >
                         <Button className="w-full bg-primary text-primary-foreground border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold uppercase py-6 text-lg">
                           <ExternalLink className="mr-2 h-5 w-5" />
                           View Live Demo
                         </Button>
                       </a>
                     )}
                     {project.github_url && (
                       <a
                         href={project.github_url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="w-full"
                       >
                         <Button variant="outline" className="w-full bg-card text-foreground border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold uppercase py-6 text-lg">
                           <Github className="mr-2 h-5 w-5" />
                           View Source
                         </Button>
                       </a>
                     )}
                   </div>
                </div>
             </div>
          </div>
          
           {/* CTA Section */}
           <div className="mt-20 border-2 border-border bg-primary text-primary-foreground p-12 text-center neo-shadow relative overflow-hidden">
               <div className="relative z-10">
                   <h2 className="text-3xl md:text-4xl font-black uppercase mb-6">
                      Need a similar solution?
                   </h2>
                   <p className="text-xl font-medium mb-8 max-w-2xl mx-auto opacity-90">
                      Let's discuss how we can engineer a robust architecture for your business needs.
                   </p>
                   <a href="/#contact">
                       <Button size="lg" className="bg-card text-foreground border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-xl font-black uppercase px-8 py-6">
                           Book a Strategy Call
                           <ArrowRight className="ml-2 w-6 h-6" />
                       </Button>
                   </a>
               </div>
               
               {/* Decorative background pattern */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ backgroundImage: "radial-gradient(circle, currentColor 2px, transparent 2.5px)", backgroundSize: "20px 20px" }}>
               </div>
           </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
