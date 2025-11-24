"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  created_at: string;
}

const BlogCard = ({ post, index }: { post: Blog; index: number }) => {
  const { t } = useLanguage();
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

  const getReadTime = (excerpt: string) => {
    return Math.ceil(excerpt.split(" ").length / 200);
  };

  return (
    <motion.div
      variants={cardVariants}
      className="relative bg-background/50 border border-primary/20 rounded-xl overflow-hidden group"
      style={{ backdropFilter: "blur(10px)" }}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-primary to-accent rounded-xl blur-sm opacity-0 group-hover:opacity-75 transition duration-300"></div>

      <div className="relative">
        <Link href={`/blog/${post.slug}`} className="block">
          <img
            src={
              post.cover_image ||
              "https://placehold.co/800x600/0D0D0D/00BFFF?text=Blog+Post"
            }
            alt={post.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="p-6">
          <div
            className="flex items-center gap-4 text-sm text-primary/80 mb-3"
            style={{ filter: `drop-shadow(0 0 2px hsla(var(--primary), 0.5))` }}
          >
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              {getReadTime(post.excerpt)} {t("blog.readTime")}
            </div>
          </div>
          <h3 className="text-xl font-bold mb-3 font-heading group-hover:text-primary transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-foreground/70 mb-4 line-clamp-3 h-20">
            {post.excerpt}
          </p>
          <Link href={`/blog/${post.slug}`}>
            <Button
              variant="link"
              className="p-0 h-auto text-primary group-hover:text-primary/80"
            >
              {t("blog.readMore")}
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, cover_image, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data || []);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <section id="blog" className="py-20 md:py-32 bg-background/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 font-heading">
            {t("blog.title")}{" "}
            <span className="text-primary">{t("blog.titleHighlight")}</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t("blog.description")}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-background/50 border border-primary/20 rounded-xl p-6 h-[450px] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {blogs.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
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
          <Link href="/blogs">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("blog.viewAll")}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <motion.div
                className="absolute inset-0 bg-primary/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
