"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Tag,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

const FancyBlogCard = ({ post, index }: { post: Blog; index: number }) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getReadTime = (content: string) => {
    return Math.ceil(content.split(" ").length / 200);
  };

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
        type: "spring" as const,
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
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 rounded-2xl group-hover:animate-pulse"></div>

      {/* Card container */}
      <div className="relative h-full bg-background/80 backdrop-blur-xl border border-primary/20 rounded-2xl overflow-hidden">
        {/* Sparkle effect on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute top-4 right-4 z-10"
            >
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image container with overlay */}
        <Link
          href={`/blog/${post.slug}`}
          className="block relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src={
                post.cover_image ||
                "https://placehold.co/800x600/0D0D0D/00BFFF?text=Blog+Post"
              }
              alt={post.title}
              className="w-full h-64 object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
          </motion.div>

          {/* Floating date badge */}
          <motion.div
            animate={{
              y: isHovered ? -5 : 0,
              scale: isHovered ? 1.05 : 1,
            }}
            className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
          >
            <Calendar className="inline w-4 h-4 mr-2" />
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </motion.div>
        </Link>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Read time badge */}
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                boxShadow: isHovered
                  ? "0 0 20px rgba(var(--primary-rgb), 0.5)"
                  : "0 0 0px rgba(var(--primary-rgb), 0)",
              }}
              className="inline-flex items-center gap-1 text-sm text-primary/90 bg-primary/10 px-3 py-1 rounded-full"
            >
              <Clock size={14} />
              <span>{getReadTime(post.content)} min read</span>
            </motion.div>
            <motion.div
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1 text-sm text-accent/90 bg-accent/10 px-3 py-1 rounded-full"
            >
              <TrendingUp size={14} />
              <span>Trending</span>
            </motion.div>
          </div>

          {/* Title with hover effect */}
          <Link href={`/blog/${post.slug}`}>
            <motion.h3
              animate={{
                color: isHovered
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground))",
              }}
              className="text-2xl font-bold font-heading line-clamp-2 min-h-[3.5rem]"
            >
              {post.title}
            </motion.h3>
          </Link>

          {/* Excerpt */}
          <p className="text-foreground/70 line-clamp-3 min-h-[4.5rem]">
            {post.excerpt}
          </p>

          {/* Action button with animated arrow */}
          <Link href={`/blog/${post.slug}`}>
            <motion.div
              whileHover={{ x: 5 }}
              className="inline-flex items-center text-primary font-semibold group/btn"
            >
              <span className="relative">
                Read Full Article
                <motion.span
                  animate={{
                    width: isHovered ? "100%" : "0%",
                  }}
                  className="absolute bottom-0 left-0 h-0.5 bg-primary"
                />
              </span>
              <motion.div
                animate={{
                  x: isHovered ? 5 : 0,
                  rotate: isHovered ? -45 : 0,
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.div>
            </motion.div>
          </Link>
        </div>

        {/* Bottom gradient line */}
        <motion.div
          animate={{
            scaleX: isHovered ? 1 : 0,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary origin-left"
        />
      </div>
    </motion.div>
  );
};

const BlogsContent = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data || []);
        setFilteredBlogs(data || []);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, blogs]);

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
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
      <Navigation />

      {/* Hero Section with animated background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background elements */}
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
                <Sparkles className="w-4 h-4" />
                Latest Articles & Insights
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading"
            >
              Explore Our{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Blog Posts
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-foreground/70 max-w-2xl mx-auto"
            >
              Dive into articles about web development, programming best
              practices, and cutting-edge technologies. Learn, grow, and stay
              updated.
            </motion.p>

            {/* Search bar with animations */}
            <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-primary/20 rounded-xl overflow-hidden">
                  <Search className="absolute left-4 w-5 h-5 text-primary/60" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
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

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {blogs.length}+
                </div>
                <div className="text-sm text-foreground/60">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">50K+</div>
                <div className="text-sm text-foreground/60">Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10+</div>
                <div className="text-sm text-foreground/60">Topics</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background/50 border border-primary/20 rounded-2xl h-[500px] animate-pulse"
                />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2">No articles found</h3>
              <p className="text-foreground/60">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Check back soon for new content!"}
              </p>
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
                    {filteredBlogs.length}
                  </span>{" "}
                  article{filteredBlogs.length !== 1 ? "s" : ""}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((post, index) => (
                  <FancyBlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to action section */}
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
              Want to Stay <span className="text-primary">Updated?</span>
            </h2>
            <p className="text-xl text-foreground/70 mb-8">
              Get the latest articles and insights delivered straight to your
              inbox. Join our community of developers!
            </p>
            <Link href="/#contact">
              <Button
                size="lg"
                className="text-lg px-8 py-6 relative group overflow-hidden"
              >
                <span className="relative z-10">Get In Touch</span>
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

export default BlogsContent;
