import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.skills': 'Skills',
    'nav.projects': 'Projects',
    'nav.testimonials': 'Testimonials',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.hireMe': 'Hire Me',
    
    // Hero
    'hero.greeting': 'Hi, I\'m',
    'hero.title': 'Full-Stack Developer & AI Enthusiast',
    'hero.description': 'Passionate about creating innovative web applications and AI-powered solutions. Specialized in React, Node.js, and modern AI technologies.',
    'hero.viewProjects': 'View Projects',
    'hero.contactMe': 'Contact Me',
    'hero.scrollDown': 'Scroll Down',
    
    // Skills
    'skills.title': 'Technical',
    'skills.titleHighlight': 'Skills',
    'skills.description': 'Broad expertise with years of experience in full-stack development and AI',
    'skills.frontend': 'Frontend Development',
    'skills.backend': 'Backend Development',
    'skills.cloud': 'Cloud & DevOps',
    'skills.mobile': 'Mobile Development',
    'skills.web': 'Web Technologies',
    'skills.ai': 'AI & Machine Learning',
    
    // Projects
    'projects.title': 'Featured',
    'projects.titleHighlight': 'Projects',
    'projects.description': 'Showcase of my recent work and successful projects',
    'projects.viewDemo': 'View Demo',
    'projects.viewCode': 'View Code',
    'projects.viewAll': 'View All Projects',
    
    // Testimonials
    'testimonials.title': 'Client',
    'testimonials.titleHighlight': 'Testimonials',
    'testimonials.description': 'What clients say about working with me',
    
    // Blog
    'blog.title': 'Latest',
    'blog.titleHighlight': 'Blog Posts',
    'blog.description': 'Thoughts, tutorials, and insights about web development and AI',
    'blog.readMore': 'Read More',
    'blog.viewAll': 'View All Posts',
    'blog.readTime': 'min read',
    'blog.backToBlog': 'Back to Blog',
    
    // Contact
    'contact.title': 'Get In',
    'contact.titleHighlight': 'Touch',
    'contact.description': 'Have a project in mind? Need help with web development, design, or app development? Let\'s discuss!',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone (optional)',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Message sent successfully! I\'ll get back to you soon.',
    'contact.error': 'Failed to send message. Please try again.',
    
    // Footer
    'footer.description': 'Full-Stack Developer specializing in modern web technologies and AI solutions',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
  },
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.skills': 'Kỹ năng',
    'nav.projects': 'Dự án',
    'nav.testimonials': 'Đánh giá',
    'nav.blog': 'Blog',
    'nav.contact': 'Liên hệ',
    'nav.hireMe': 'Thuê tôi',
    
    // Hero
    'hero.greeting': 'Xin chào, tôi là',
    'hero.title': 'Full-Stack Developer & Chuyên gia AI',
    'hero.description': 'Đam mê tạo ra các ứng dụng web sáng tạo và giải pháp AI. Chuyên về React, Node.js và công nghệ AI hiện đại.',
    'hero.viewProjects': 'Xem dự án',
    'hero.contactMe': 'Liên hệ',
    'hero.scrollDown': 'Cuộn xuống',
    
    // Skills
    'skills.title': 'Kỹ năng',
    'skills.titleHighlight': 'Chuyên môn',
    'skills.description': 'Chuyên môn rộng với nhiều năm kinh nghiệm trong phát triển full-stack và AI',
    'skills.frontend': 'Phát triển Frontend',
    'skills.backend': 'Phát triển Backend',
    'skills.cloud': 'Cloud & DevOps',
    'skills.mobile': 'Phát triển Mobile',
    'skills.web': 'Công nghệ Web',
    'skills.ai': 'AI & Học máy',
    
    // Projects
    'projects.title': 'Dự án',
    'projects.titleHighlight': 'Nổi bật',
    'projects.description': 'Tổng hợp các dự án gần đây và thành công',
    'projects.viewDemo': 'Xem demo',
    'projects.viewCode': 'Xem code',
    'projects.viewAll': 'Xem tất cả dự án',
    
    // Testimonials
    'testimonials.title': 'Đánh giá',
    'testimonials.titleHighlight': 'Khách hàng',
    'testimonials.description': 'Khách hàng nói gì về việc làm việc với tôi',
    
    // Blog
    'blog.title': 'Blog',
    'blog.titleHighlight': 'Mới nhất',
    'blog.description': 'Suy nghĩ, hướng dẫn và kiến thức về phát triển web và AI',
    'blog.readMore': 'Đọc thêm',
    'blog.viewAll': 'Xem tất cả bài viết',
    'blog.readTime': 'phút đọc',
    'blog.backToBlog': 'Quay lại Blog',
    
    // Contact
    'contact.title': 'Liên hệ',
    'contact.titleHighlight': 'với tôi',
    'contact.description': 'Có dự án trong đầu? Cần trợ giúp về lập trình web, thiết kế hoặc phát triển ứng dụng? Hãy thảo luận!',
    'contact.name': 'Họ tên',
    'contact.email': 'Email',
    'contact.phone': 'Số điện thoại (tùy chọn)',
    'contact.message': 'Nội dung',
    'contact.send': 'Gửi tin nhắn',
    'contact.sending': 'Đang gửi...',
    'contact.success': 'Gửi tin nhắn thành công! Tôi sẽ phản hồi sớm.',
    'contact.error': 'Gửi tin nhắn thất bại. Vui lòng thử lại.',
    
    // Footer
    'footer.description': 'Full-Stack Developer chuyên về công nghệ web hiện đại và giải pháp AI',
    'footer.quickLinks': 'Liên kết nhanh',
    'footer.contact': 'Liên hệ',
    'footer.rights': 'Tất cả quyền được bảo lưu.',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'vi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
