'use client'

import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const Hero = () => {
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "tween" as const, ease: "easeOut" as const, duration: 0.3 },
    },
  };

  const NeoIcon = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-white border-2 border-black text-black hover:bg-accent transition-all duration-200 neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
    >
      <div className="relative">{children}</div>
    </a>
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background border-b-2 border-black"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
         <div 
            className="w-full h-full"
            style={{
                backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                backgroundSize: "40px 40px"
            }}
         />
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 py-32 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div variants={itemVariants} className="text-black inline-block mb-6 border-2 border-black bg-white px-4 py-1 neo-shadow">
             <span className="text-sm font-bold uppercase tracking-wider">Software Engineer</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-6 leading-none font-black font-heading text-6xl md:text-8xl lg:text-9xl tracking-tighter uppercase"
            style={{
                textShadow: "4px 4px 0px #000"
            }}
          >
            {t("hero.greeting")}{" "}
            <span className="text-primary">{t("hero.name")}</span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-black text-2xl md:text-4xl lg:text-5xl font-bold mb-8 font-mono bg-white border-2 border-black inline-block px-4 py-2 neo-shadow -rotate-1"
          >
            {t("hero.title")}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-black text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed border-2 border-black p-6 bg-white neo-shadow"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground text-xl font-black px-10 py-8 border-2 border-black neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-wide"
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("hero.viewProjects")}
              <ArrowRight className="ml-2 w-6 h-6 stroke-[3px]" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl font-black px-10 py-8 border-2 border-black bg-white text-black neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-wide"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("hero.contactMe")}
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-6"
          >
            <NeoIcon href="https://github.com/tranviet0710">
              <Github size={28} className="stroke-[2.5px]" />
            </NeoIcon>
            <NeoIcon href="https://linkedin.com/in/tranviet0710">
              <Linkedin size={28} className="stroke-[2.5px]" />
            </NeoIcon>
            <NeoIcon href="mailto:vitlaicodedao@gmail.com">
              <Mail size={28} className="stroke-[2.5px]" />
            </NeoIcon>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
