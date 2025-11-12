import { Github, Linkedin, Mail, Heart, Facebook } from 'lucide-react';
import { FaTelegram } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text mb-2">Viet Dev</h3>
            <p className="text-foreground/60">
              {t('footer.description')}
            </p>
            <div className="text-sm text-foreground/50 mt-2">
              <p>Phone: 0935169835</p>
              <p>Telegram: @pikapika2101</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/tranviet0710"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/tranviet0710"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://facebook.com/tranviet0710"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://t.me/pikapika2101"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <FaTelegram size={24} />
            </a>
            <a
              href="mailto:tranviet0710@gmail.com"
              className="text-foreground/60 hover:text-primary transition-colors duration-300"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-foreground/60 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> by Viet Dev © 2024. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
