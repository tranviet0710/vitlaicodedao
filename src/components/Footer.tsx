'use client'

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
    { href: "mailto:vitlaicodedao@gmail.com", icon: Mail },
  ];

  return (
    <footer className="py-12 border-t-2 border-border bg-background relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3
              className="text-3xl font-black font-heading mb-2 uppercase tracking-tighter"
            >
              Viet Dev
            </h3>
            <p className="text-foreground font-medium max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative text-foreground border-2 border-border p-3 bg-primary hover:bg-accent transition-all duration-200 neo-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
                >
                  <Icon size={24} className="stroke-[2.5px]" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t-2 border-border text-center">
          <p className="text-foreground font-bold flex items-center justify-center gap-2">
            {t("footer.madeWith")}{" "}
            <Heart
              className="w-5 h-5 text-destructive fill-destructive"
            />
            {t("footer.copyright")} {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
