"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  category: string;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
  content: string | null;
}

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const { t } = useLanguage();
  
  // Extract impact/metrics from content if available
  const getImpactPreview = (content: string) => {
    const impactMatch = content.match(/### The Impact\n([\s\S]*?)(?:$|###)/);
    if (impactMatch) {
      const impacts = impactMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .slice(0, 2)
        .map(line => line.replace(/^-\s*(\*\*.*?\*\*:)?\s*/, ''));
      return impacts;
    }
    return [];
  };

  const impacts = project.content ? getImpactPreview(project.content) : [];

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: index * 0.15,
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.a
      href={`/project/${project.slug}`}
      variants={cardVariants}
      className="relative block bg-white border-2 border-black neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-200 group h-full flex flex-col"
    >
      <div className="relative">
        <div className="aspect-video relative overflow-hidden border-b-2 border-black">
          <img
            src={
              project.thumbnail ||
              "https://placehold.co/800x600/0D0D0D/00BFFF?text=Case+Study"
            }
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
             <span className="inline-block px-3 py-1 bg-white border-2 border-black text-black text-xs font-bold uppercase tracking-wider neo-shadow-sm">
                {project.category}
             </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-2xl font-black mb-3 font-heading leading-tight uppercase">
            {project.title}
          </h3>
          
          <p className="text-black/80 mb-6 line-clamp-2 font-medium">
            {project.description}
          </p>

          {impacts.length > 0 && (
            <div className="mb-6 bg-accent/20 p-4 border-2 border-black border-dashed">
              <p className="text-xs font-bold uppercase mb-2 text-black/60">Key Impact</p>
              <ul className="space-y-1">
                {impacts.map((impact, i) => (
                  <li key={i} className="text-sm font-bold flex items-start gap-2">
                    <span className="text-primary">→</span>
                    {impact}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto">
            {project.tech_stack && (
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-2 py-1 bg-gray-100 border border-black text-black text-xs font-bold font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4">
               <span className="text-primary font-bold uppercase text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Case Study <ArrowRight className="w-4 h-4" />
               </span>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-heading">
            {t("projects.title")}{" "}
            <span className="text-primary">{t("projects.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t("projects.description")}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-background/50 border border-primary/20 rounded-xl p-6 h-96 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </motion.div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a href="/projects">
            <Button
              size="lg"
              className="bg-primary text-primary-foreground text-xl font-black px-10 py-8 border-2 border-black neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-wide"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("projects.viewAll")}
                <ArrowRight className="w-6 h-6 stroke-[3px]" />
              </span>
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
