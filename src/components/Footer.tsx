import { Github, Linkedin, Mail, Heart, Facebook } from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const socialLinks = [
    { href: "https://github.com/tranviet0710", icon: Github },
    { href: "https://linkedin.com/in/tranviet0710", icon: Linkedin },
    { href: "https://facebook.com/tranviet0710", icon: Facebook },
    { href: "https://t.me/pikapika2101", icon: FaTelegram },
    { href: "mailto:tranviet0710@gmail.com", icon: Mail },
  ];

  return (
    <footer className="py-12 border-t border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
            backgroundSize: "4rem 4rem",
          }}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3
              className="text-3xl font-bold font-heading mb-2"
              style={{ textShadow: "0 0 10px hsla(var(--primary), 0.7)" }}
            >
              Viet Dev
            </h3>
            <p className="text-foreground/60 max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          <div className="flex items-center gap-5">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-foreground/60 hover:text-primary transition-colors duration-300 group"
                >
                  <Icon size={24} />
                  <div className="absolute -inset-2 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary/20 text-center">
          <p className="text-foreground/60 flex items-center justify-center gap-2">
            Made with{" "}
            <Heart
              className="w-5 h-5 text-primary"
              style={{ filter: `drop-shadow(0 0 5px hsla(var(--primary), 1))` }}
            />{" "}
            by Viet Dev © 2025. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
