import { useState, useEffect } from "react";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="relative text-foreground/80 hover:text-primary transition-colors duration-300 font-medium group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
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
    className="relative text-foreground/80 hover:text-primary transition-colors duration-300 p-2 rounded-full hover:bg-primary/10"
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
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_0_20px_hsla(198,93%,60%,0.1)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a
            href="#home"
            className="text-3xl font-bold font-heading tracking-wider"
            style={{ textShadow: "0 0 10px hsla(198, 93%, 60%, 0.7)" }}
          >
            Viet Dev
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <IconButton
              onClick={() => setLanguage(language === "en" ? "vi" : "en")}
              title={
                language === "en"
                  ? "Switch to Vietnamese"
                  : "Chuyển sang tiếng Anh"
              }
            >
              <Globe size={20} />
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
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            )}
            {/* <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary animate-pulse hover:animate-none"
            >
              {t("nav.hireMe")}
            </Button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-0 left-0 w-full h-screen bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <nav className="flex flex-col gap-8 text-center">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-2xl text-foreground/80 hover:text-primary transition-colors duration-300 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-4 mt-8">
                <IconButton
                  onClick={() => setLanguage(language === "en" ? "vi" : "en")}
                  title={
                    language === "en"
                      ? "Switch to Vietnamese"
                      : "Chuyển sang tiếng Anh"
                  }
                >
                  <Globe size={24} />
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
                    {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                  </IconButton>
                )}
              </div>
              {/* <Button variant="outline" className="mt-8 border-primary text-primary hover:bg-primary/10 hover:text-primary">
              {t('nav.hireMe')}
            </Button> */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navigation;
