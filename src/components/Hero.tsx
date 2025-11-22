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
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const GlowingIcon = ({
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
      className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-primary/20 text-foreground/60 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all duration-300 relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
      <div className="relative">{children}</div>
    </a>
  );

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "2rem 2rem",
            animation: "zoom 20s infinite linear",
          }}
        />
      </div>
      <style>
        {`
          @keyframes zoom {
            0% { background-size: 2rem 2rem; }
            50% { background-size: 2.5rem 2.5rem; }
            100% { background-size: 2rem 2rem; }
          }
        `}
      </style>

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 py-32 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">
              {t('hero.available')}
            </span>
          </motion.div> */}

          <motion.h1
            variants={itemVariants}
            className="mb-6 leading-tight font-heading"
            style={{
              textShadow:
                "0 0 15px hsla(var(--primary), 0.5), 0 0 30px hsla(var(--primary), 0.3)",
            }}
          >
            {t("hero.greeting")}{" "}
            <span className="text-primary">{t("hero.name")}</span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ textShadow: "0 0 10px hsla(var(--primary), 0.3)" }}
          >
            {t("hero.title")}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground text-lg px-8 py-6 group shadow-[0_0_20px_hsla(var(--primary),0.4)] hover:shadow-[0_0_30px_hsla(var(--primary),0.6)] transition-all hover:scale-105"
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("hero.viewProjects")}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary/10 transition-all hover:scale-105"
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
            <GlowingIcon href="https://github.com/tranviet0710">
              <Github size={24} />
            </GlowingIcon>
            <GlowingIcon href="https://linkedin.com/in/tranviet0710">
              <Linkedin size={24} />
            </GlowingIcon>
            <GlowingIcon href="mailto:tranviet0710@gmail.com">
              <Mail size={24} />
            </GlowingIcon>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-primary rounded-full"
            animate={{
              y: [0, 10, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
