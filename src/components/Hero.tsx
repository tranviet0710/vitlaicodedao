import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95" />
      </div>

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />

        {/* Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-foreground/80">
              {/* {t('hero.available')} */}
            </span>
          </div>

          <h1 className="mb-6 leading-tight animate-slide-up">
            {t("hero.greeting")}{" "}
            <span className="gradient-text animate-gradient">Viet Dev</span>
          </h1>

          <h2
            className="text-2xl md:text-3xl font-bold mb-6 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            {t("hero.title")}
          </h2>

          <p
            className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {t("hero.description")}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button
              size="lg"
              className="bg-gradient-primary text-lg px-8 py-6 group shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
              className="text-lg px-8 py-6 border-2 border-primary hover:bg-primary/10 backdrop-blur-sm transition-all hover:scale-105"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {t("hero.contactMe")}
            </Button>
          </div>

          <div
            className="flex items-center justify-center gap-6 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="https://github.com/tranviet0710"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/60 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/tranviet0710"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/60 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:tranviet0710@gmail.com"
              className="p-3 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 text-foreground/60 hover:text-primary hover:border-primary/50 hover:scale-110 transition-all duration-300"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
