"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe, Moon, Sun, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="relative text-black font-bold hover:text-primary transition-colors duration-200 text-lg uppercase tracking-tight"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
  </a>
);

const IconButton = ({
  onClick,
  children,
  title,
}: {
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    onClick={onClick}
    className="relative text-black border-2 border-border p-2 bg-white hover:bg-accent transition-all duration-200 neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
    title={title}
  >
    {children}
  </button>
);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: t("nav.home") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#testimonials", label: t("nav.testimonials") },
    { href: "#blog", label: t("nav.blog") },
    { href: "#contact", label: t("nav.contact") },
  ];

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "linear" as const },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2, ease: "linear" as const },
    },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-background border-b-2 border-border py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-3xl font-black font-heading tracking-tighter uppercase border-2 border-border bg-primary text-white px-2 py-1 transform -rotate-2 hover:rotate-0 transition-transform duration-200 neo-shadow"
          >
            Viet Dev
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 bg-white border-2 border-border px-6 py-2 neo-shadow">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <IconButton
              onClick={() => setLanguage(language === "en" ? "vi" : "en")}
              title={
                language === "en"
                  ? "Switch to Vietnamese"
                  : "Chuyển sang tiếng Anh"
              }
            >
              <Globe size={20} className="stroke-[2.5px]" />
            </IconButton>
            {mounted && (
              <IconButton
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
              >
                {theme === "dark" ? <Sun size={20} className="stroke-[2.5px]" /> : <Moon size={20} className="stroke-[2.5px]" />}
              </IconButton>
            )}
            {/* <a
               href="/CV_VietDev.pdf"
               download
               className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground font-bold px-4 py-2 border-2 border-border neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase text-sm ml-2"
             >
               <Download size={18} className="stroke-[3px]" />
               Resume
             </a> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black border-2 border-border p-2 bg-white neo-shadow active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} className="stroke-[3px]" /> : <Menu size={28} className="stroke-[3px]" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-[100%] left-0 w-full h-[calc(100vh-80px)] bg-background border-t-2 border-border flex flex-col items-center justify-start pt-12"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="flex flex-col gap-6 text-center w-full px-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-3xl font-black uppercase text-black hover:text-primary transition-colors duration-200 border-2 border-border bg-white p-4 neo-shadow w-full active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-6 mt-12">
                <IconButton
                  onClick={() => setLanguage(language === "en" ? "vi" : "en")}
                  title={
                    language === "en"
                      ? "Switch to Vietnamese"
                      : "Chuyển sang tiếng Anh"
                  }
                >
                  <Globe size={32} className="stroke-[2.5px]" />
                </IconButton>
                {mounted && (
                  <IconButton
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                    title={
                      theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    {theme === "dark" ? <Sun size={32} className="stroke-[2.5px]" /> : <Moon size={32} className="stroke-[2.5px]" />}
                  </IconButton>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navigation;
