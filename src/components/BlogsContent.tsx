"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
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

const BlogCard = ({ post, index }: { post: Blog; index: number }) => {
  const { t } = useLanguage();
  
  const getReadTime = (content: string) => {
    return Math.ceil(content.split(" ").length / 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group h-full flex flex-col bg-card border-2 border-border neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
    >
      {/* Image container */}
      <Link
        href={`/blog/${post.slug}`}
        className="block relative border-b-2 border-border overflow-hidden bg-muted"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={
              post.cover_image ||
              "https://placehold.co/800x600/0D0D0D/FFF?text=Blog+Post"
            }
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Date badge */}
        <div className="absolute top-4 left-4 bg-background border-2 border-border px-3 py-1 text-sm font-bold shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Meta info */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-1 border border-primary/20">
            <Clock size={12} />
            <span>{getReadTime(post.content)} {t("blog.readTime")}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-accent/20 text-accent px-2 py-1 border border-accent/20">
            <TrendingUp size={12} />
            <span>Trending</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`} className="mb-3 block">
          <h3 className="text-2xl font-bold font-heading leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-muted-foreground line-clamp-3 mb-6 flex-grow">
          {post.excerpt}
        </p>

        {/* Action button */}
        <div className="pt-4 border-t-2 border-border mt-auto">
          <Link href={`/blog/${post.slug}`}>
            <Button 
              className="w-full border-2 border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              {t("blog.readMore")}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
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
                <Sparkles className="w-4 h-4" />
                {t("blog.badge")}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-foreground">
              {t("blog.heroTitle")}{" "}
              <span className="text-primary bg-primary/10 px-2 decoration-4 decoration-primary underline underline-offset-4">
                {t("blog.heroTitleHighlight")}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              {t("blog.heroDesc")}
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-foreground/50" />
                <Input
                  type="text"
                  placeholder={t("blog.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-6 bg-background border-2 border-border text-lg neo-shadow focus-visible:ring-0 focus-visible:ring-offset-0 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all placeholder:text-muted-foreground/70"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t-2 border-dashed border-border/50 mt-12 w-fit mx-auto px-8">
              <div className="text-center">
                <div className="text-4xl font-black text-primary">
                  {blogs.length}+
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("stats.articles")}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent">50K+</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("stats.readers")}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary">10+</div>
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("stats.topics")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-20 relative bg-muted/30">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-background border-2 border-border h-[450px] animate-pulse neo-shadow"
                />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-background border-2 border-border neo-shadow max-w-2xl mx-auto p-8">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-2xl font-bold mb-3 font-heading">{t("section.noArticles")}</h3>
              <p className="text-muted-foreground text-lg">
                {searchQuery
                  ? t("blog.tryAdjusting")
                  : t("blog.noArticlesDesc")}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between border-b-2 border-border pb-4">
                <p className="text-lg font-bold">
                  {t("blog.showing")}{" "}
                  <span className="text-primary text-xl">
                    {filteredBlogs.length}
                  </span>{" "}
                  {filteredBlogs.length !== 1 ? t("blog.articles") : t("blog.article")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 relative bg-primary text-primary-foreground border-t-2 border-border">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-black font-heading leading-tight">
              {t("section.stayUpdated")}
            </h2>
            <p className="text-xl text-primary-foreground/90 font-medium">
              {t("section.stayUpdatedDesc")}
            </p>
            <Link href="/#contact">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-background text-foreground hover:bg-accent hover:text-accent-foreground border-2 border-black neo-shadow-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                {t("blog.getInTouch")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogsContent;
