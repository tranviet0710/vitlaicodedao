"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Search,
  Sparkles,
  Code,
  Rocket,
  Filter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Input } from "@/components/ui/input";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  image: string | null;
  category: string;
  demo_url: string | null;
  github_url: string | null;
  tech_stack: string[] | null;
  created_at: string;
}

const FancyProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group h-full"
    >
      {/* Animated gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 rounded-2xl"></div>

      {/* Card container */}
      <div className="relative h-full bg-background/80 backdrop-blur-xl border border-primary/20 rounded-2xl overflow-hidden flex flex-col">
        {/* Sparkle effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-4 right-4 z-10"
              >
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.1 }}
                className="absolute top-4 left-4 z-10"
              >
                <Code className="w-6 h-6 text-accent animate-pulse" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Image container with overlay */}
        <Link
          href={`/project/${project.slug}`}
          className="block relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={
                project.thumbnail ||
                project.image ||
                "https://placehold.co/800x600/0D0D0D/00BFFF?text=Project"
              }
              alt={project.title}
              className="w-full h-64 object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent opacity-80"></div>
          </motion.div>

          {/* Floating category badge */}
          <motion.div
            animate={{
              y: isHovered ? -5 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-20"
          >
            <Rocket className="inline w-4 h-4 mr-2" />
            {project.category}
          </motion.div>
        </Link>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col space-y-4">
          {/* Title with hover effect */}
          <Link href={`/project/${project.slug}`}>
            <motion.h3
              animate={{
                color: isHovered
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground))",
              }}
              className="text-2xl font-bold font-heading line-clamp-2"
            >
              {project.title}
            </motion.h3>
          </Link>

          {/* Description */}
          <p className="text-foreground/70 line-clamp-3 flex-1">
            {project.description}
          </p>

          {/* Tech stack badges */}
          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.slice(0, 4).map((tech, techIndex) => (
                <motion.span
                  key={techIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold border border-accent/20"
                >
                  {tech}
                </motion.span>
              ))}
              {project.tech_stack.length > 4 && (
                <span className="px-3 py-1 bg-secondary text-foreground/60 rounded-full text-xs font-semibold">
                  +{project.tech_stack.length - 4} more
                </span>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {project.demo_url && (
              <motion.a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="flex-1"
              >
                <Button
                  size="sm"
                  className="w-full bg-primary hover:bg-primary/90 group/btn"
                >
                  <ExternalLink className="w-4 h-4 mr-2 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  View Demo
                </Button>
              </motion.a>
            )}
            {project.github_url && (
              <motion.a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={project.demo_url ? "" : "flex-1"}
              >
                <Button
                  size="sm"
                  variant="outline"
                  className={`border-primary text-primary hover:bg-primary/10 group/btn ${
                    project.demo_url ? "" : "w-full"
                  }`}
                >
                  <Github className="w-4 h-4 mr-2 transition-transform group-hover/btn:rotate-12" />
                  Code
                </Button>
              </motion.a>
            )}
          </div>
        </div>

        {/* Bottom gradient line */}
        <motion.div
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="h-1 bg-gradient-to-r from-primary via-accent to-primary origin-left"
        />
      </div>
    </motion.div>
  );
};

const ProjectsPage = () => {
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

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Projects - VietDev | Full-Stack Development Portfolio"
        description="Explore my portfolio of web development projects featuring React, Node.js, TypeScript, and modern technologies. View live demos and source code."
        keywords="web development projects, React portfolio, Node.js projects, TypeScript apps, full-stack projects, developer portfolio"
        ogType="website"
        canonicalUrl="https://vitlaicodedao.tech/projects"
      />

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-primary/10 to-accent/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-accent/10 to-primary/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                <Rocket className="w-4 h-4" />
                Portfolio & Work Showcase
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading"
            >
              My{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Projects
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-foreground/70 max-w-2xl mx-auto"
            >
              Explore a collection of projects showcasing modern web
              development, innovative solutions, and cutting-edge technologies.
            </motion.p>

            {/* Search bar */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-primary/20 rounded-xl overflow-hidden">
                  <Search className="absolute left-4 w-5 h-5 text-primary/60" />
                  <Input
                    type="text"
                    placeholder="Search projects by name or technology..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 bg-transparent border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setSearchQuery("")}
                      className="mr-4 text-foreground/50 hover:text-foreground transition-colors"
                    >
                      ✕
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Category filter */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50"
                      : "bg-background/60 border border-primary/20 text-foreground/70 hover:border-primary/50"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {projects.length}+
                </div>
                <div className="text-sm text-foreground/60">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  {categories.length - 1}+
                </div>
                <div className="text-sm text-foreground/60">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100K+</div>
                <div className="text-sm text-foreground/60">Lines of Code</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background/50 border border-primary/20 rounded-2xl h-[550px] animate-pulse"
                />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No projects found</h3>
              <p className="text-foreground/60 mb-6">
                {searchQuery || selectedCategory !== "All"
                  ? "Try adjusting your filters or search query"
                  : "Check back soon for new projects!"}
              </p>
              {(searchQuery || selectedCategory !== "All") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  variant="outline"
                  className="border-primary text-primary"
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 text-center"
              >
                <p className="text-foreground/60">
                  Showing{" "}
                  <span className="text-primary font-semibold">
                    {filteredProjects.length}
                  </span>{" "}
                  project{filteredProjects.length !== 1 ? "s" : ""}
                  {selectedCategory !== "All" && (
                    <span>
                      {" "}
                      in{" "}
                      <span className="text-accent font-semibold">
                        {selectedCategory}
                      </span>
                    </span>
                  )}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                  <FancyProjectCard
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-heading">
              Have a Project <span className="text-primary">in Mind?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8">
              Let's collaborate and bring your ideas to life with modern,
              scalable, and innovative solutions.
            </p>
            <Link href="/#contact">
              <Button
                size="lg"
                className="text-lg px-8 py-6 relative group overflow-hidden"
              >
                <span className="relative z-10">Start a Project</span>
                <motion.div
                  className="absolute inset-0 bg-accent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
