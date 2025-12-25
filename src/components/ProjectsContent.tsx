"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Search,
  Rocket,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  image?: string | null;
  category: string;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
  created_at: string;
}

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group h-full flex flex-col bg-card border-2 border-border neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
    >
      {/* Image container */}
      <Link
        href={`/project/${project.slug}`}
        className="block relative border-b-2 border-border overflow-hidden bg-muted"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={
              project.thumbnail ||
              project.image ||
              "https://placehold.co/800x600/0D0D0D/FFF?text=Project"
            }
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Category badge */}
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground border-2 border-black px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            {project.category}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <Link href={`/project/${project.slug}`} className="mb-3 block">
          <h3 className="text-2xl font-bold font-heading leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
          {project.description}
        </p>

        {/* Tech stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
              <span
                key={techIndex}
                className="px-2 py-1 bg-accent/10 text-accent-foreground border-2 border-border text-xs font-bold"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="px-2 py-1 bg-muted text-muted-foreground border-2 border-border text-xs font-bold">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-border mt-auto">
          {project.demo_url ? (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                size="sm"
                className="w-full bg-primary text-primary-foreground border-2 border-black neo-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("projects.viewDemo")}
              </Button>
            </a>
          ) : (
             <div className="w-full"></div>
          )}
          
          {project.github_url ? (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button
                size="sm"
                variant="outline"
                className="w-full bg-background border-2 border-border neo-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
              >
                <Github className="w-4 h-4 mr-2" />
                {t("projects.viewCode")}
              </Button>
            </a>
          ) : (
            <div className="w-full"></div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsContent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
        setFilteredProjects(data || []);

        // Extract unique categories
        const uniqueCategories = [
          "All",
          ...new Set((data || []).map((p) => p.category).filter(Boolean)),
        ];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = projects;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.tech_stack?.some((tech) =>
            tech.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedCategory, projects]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b-2 border-border bg-background">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground border-2 border-border px-4 py-2 text-sm font-bold neo-shadow">
                <Rocket className="w-4 h-4" />
                {t("projectsPage.badge")}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-foreground">
              {t("projectsPage.heroTitle")}{" "}
              <span className="text-primary bg-primary/10 px-2 decoration-4 decoration-primary underline underline-offset-4">
                {t("projectsPage.heroTitleHighlight")}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {t("projectsPage.heroDesc")}
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-foreground/50" />
                <Input
                  type="text"
                  placeholder={t("projectsPage.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-background border-2 border-border text-lg neo-shadow focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 text-sm font-bold border-2 transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground border-black neo-shadow translate-x-[-2px] translate-y-[-2px]"
                      : "bg-background text-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  {category === "All" ? t("projectsPage.all") : category}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t-2 border-dashed border-border/50 mt-12 w-fit mx-auto px-8">
              <div className="text-center">
                <div className="text-4xl font-black text-primary">
                  {projects.length}+
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("stats.projects")}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent">
                  {categories.length - 1}+
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("stats.categories")}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary">100K+</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("stats.linesOfCode")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 relative bg-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background border-2 border-border h-[550px] animate-pulse neo-shadow"
                />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-background border-2 border-border neo-shadow max-w-2xl mx-auto p-8">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold mb-3 font-heading">{t("section.noProjects")}</h3>
              <p className="text-muted-foreground text-lg mb-6">
                {searchQuery || selectedCategory !== "All"
                  ? t("projectsPage.tryAdjusting")
                  : t("projectsPage.checkBack")}
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  variant="outline"
                  className="border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  {t("projectsPage.clearFilters")}
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between border-b-2 border-border pb-4">
                <p className="text-lg font-bold">
                  {t("projectsPage.showing")}{" "}
                  <span className="text-primary text-xl">
                    {filteredProjects.length}
                  </span>{" "}
                  {filteredProjects.length !== 1 ? t("projectsPage.projects") : t("projectsPage.project")}
                  {selectedCategory !== "All" && (
                    <span>
                      {" "}
                      {t("projectsPage.in")}{" "}
                      <span className="text-accent">
                        {selectedCategory}
                      </span>
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative bg-primary text-primary-foreground border-t-2 border-border">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight">
              {t("section.haveProject")}
            </h2>
            <p className="text-xl text-primary-foreground/90 font-medium">
              {t("section.haveProjectDesc")}
            </p>
            <Link href="/#contact">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-2 border-black neo-shadow-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                {t("projectsPage.startProject")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsContent;
