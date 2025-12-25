'use client'

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "vi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.notFound": "Page Not Found",
    "common.backToHome": "Back to Home",
    "common.backToProjects": "Back to Projects",

    // Navigation
    "nav.home": "Home",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.testimonials": "Testimonials",
    "nav.blog": "Blog",
    "nav.contact": "Contact",
    // 'nav.hireMe': 'Hire Me',

    // Hero
    "hero.greeting": "Hi, I'm",
    "hero.name": "Viet Dev",
    "hero.title": "Architecting Scalable Solutions",
    "hero.description":
      "Solving complex business problems with robust architecture and modern technologies",
    "hero.viewProjects": "View Case Studies",
    "hero.contactMe": "Book a Strategy Call",
    // 'hero.available': 'Available for freelance work',

    // Skills
    "skills.title": "Technical",
    "skills.titleHighlight": "Skills",
    "skills.description": "Technologies and tools I work with",
    "skills.frontend": "Frontend Development",
    "skills.backend": "Backend Development",
    "skills.cloud": "Cloud & DevOps",
    "skills.mobile": "Mobile Development",
    "skills.web": "Web Technologies",
    "skills.ai": "AI & Machine Learning",

    // Projects
    "projects.title": "My Recent",
    "projects.titleHighlight": "Projects",
    "projects.description":
      "Here are some of my featured projects showcasing my skills and expertise.",
    "projects.viewDemo": "View Demo",
    "projects.viewCode": "View Code",
    "projects.viewAll": "View All Projects",
    "projects.techStack": "Tech Stack",
    "projects.notFoundDescription":
      "The project you are looking for does not exist.",

    // Testimonials
    "testimonials.title": "Client",
    "testimonials.titleHighlight": "Testimonials",
    "testimonials.description": "What my clients say about working with me",

    // Blog
    "blog.title": "Latest",
    "blog.titleHighlight": "Blog Posts",
    "blog.description": "My thoughts and insights on web development",
    "blog.readMore": "Read More",
    "blog.viewAll": "View All Posts",
    "blog.readTime": "min read",
    "blog.backToBlog": "Back to Blog",

    // Contact
    "contact.title": "Need Programming",
    "contact.titleHighlight": "Support?",
    "contact.description":
      "Do you need help with website development, app development, or technical consulting? Contact me now!",
    "contact.info": "Contact Information",
    "contact.social": "Connect with me",
    "contact.formTitle": "Send a Request",
    "contact.name": "Full Name",
    "contact.email": "Email",
    "contact.phone": "Phone Number",
    "contact.message": "Request Details",
    "contact.send": "Send Request",
    "contact.sending": "Sending...",
    "contact.successTitle": "Success!",
    "contact.successMessage":
      "Thank you for contacting me. I will respond as soon as possible.",
    "contact.errorTitle": "Error",
    "contact.errorMessage": "Unable to send request. Please try again later.",
    "contact.validationError": "Please check your input and try again.",
    "contact.namePlaceholder": "Enter your full name",
    "contact.emailPlaceholder": "Enter your email address",
    "contact.phonePlaceholder": "Enter your phone number (optional)",
    "contact.messagePlaceholder": "Describe your project or request...",
    "contact.characters": "characters",
    "contact.infoTitle": "Information",
    "contact.socialTitle": "Contact",

    // Footer
    "footer.description": "Full-Stack Developer & AI Enthusiast",
    "footer.quickLinks": "Quick Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
  },
  vi: {
    // Common
    "common.loading": "Đang tải...",
    "common.notFound": "Không Tìm Thấy Trang",
    "common.backToHome": "Về Trang Chủ",
    "common.backToProjects": "Quay Lại Dự Án",

    // Navigation
    "nav.home": "Trang chủ",
    "nav.skills": "Kỹ năng",
    "nav.projects": "Dự án",
    "nav.testimonials": "Đánh giá",
    "nav.blog": "Blog",
    "nav.contact": "Liên hệ",
    // 'nav.hireMe': 'Thuê tôi',

    // Hero
    "hero.greeting": "Xin chào, tôi là",
    "hero.name": "Viet Dev",
    "hero.title": "Kiến Trúc Sư Giải Pháp Phần Mềm",
    "hero.description":
      "Giải quyết các bài toán doanh nghiệp phức tạp với kiến trúc vững chắc và công nghệ hiện đại",
    "hero.viewProjects": "Xem Case Studies",
    "hero.contactMe": "Đặt Lịch Tư Vấn",
    // "hero.available": "Sẵn sàng nhận dự án freelance",

    // Skills
    "skills.title": "Kỹ năng",
    "skills.titleHighlight": "Chuyên môn",
    "skills.description": "Các công nghệ và công cụ tôi sử dụng",
    "skills.frontend": "Phát triển Frontend",
    "skills.backend": "Phát triển Backend",
    "skills.cloud": "Cloud & DevOps",
    "skills.mobile": "Phát triển Mobile",
    "skills.web": "Công nghệ Web",
    "skills.ai": "AI & Học máy",

    // Projects
    "projects.title": "Dự Án",
    "projects.titleHighlight": "Gần Đây",
    "projects.description":
      "Đây là một số dự án nổi bật của tôi, thể hiện kỹ năng và chuyên môn.",
    "projects.viewDemo": "Xem Demo",
    "projects.viewCode": "Xem Code",
    "projects.viewAll": "Xem Tất Cả Dự Án",
    "projects.techStack": "Công Nghệ Sử Dụng",
    "projects.notFoundDescription": "Dự án bạn đang tìm kiếm không tồn tại.",

    // Testimonials
    "testimonials.title": "Đánh giá",
    "testimonials.titleHighlight": "Khách hàng",
    "testimonials.description": "Khách hàng nói gì về việc làm việc với tôi",

    // Blog
    "blog.title": "Bài viết",
    "blog.titleHighlight": "Mới nhất",
    "blog.description": "Suy nghĩ và góc nhìn của tôi về phát triển web",
    "blog.readMore": "Đọc thêm",
    "blog.viewAll": "Xem tất cả bài viết",
    "blog.readTime": "phút đọc",
    "blog.backToBlog": "Quay lại Blog",

    // Contact
    "contact.title": "Cần Hỗ Trợ",
    "contact.titleHighlight": "Lập Trình?",
    "contact.description":
      "Bạn cần hỗ trợ phát triển website, app, hoặc tư vấn kỹ thuật? Hãy liên hệ ngay!",
    "contact.info": "Thông tin liên hệ",
    "contact.social": "Kết nối với tôi",
    "contact.formTitle": "Gửi yêu cầu",
    "contact.name": "Họ tên",
    "contact.email": "Email",
    "contact.phone": "Số điện thoại",
    "contact.message": "Nội dung yêu cầu",
    "contact.send": "Gửi yêu cầu",
    "contact.sending": "Đang gửi...",
    "contact.successTitle": "Thành công!",
    "contact.successMessage":
      "Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.",
    "contact.errorTitle": "Lỗi",
    "contact.errorMessage": "Không thể gửi yêu cầu. Vui lòng thử lại sau.",
    "contact.validationError": "Vui lòng kiểm tra lại thông tin và thử lại.",
    "contact.namePlaceholder": "Nhập họ tên của bạn",
    "contact.emailPlaceholder": "Nhập địa chỉ email",
    "contact.phonePlaceholder": "Nhập số điện thoại (không bắt buộc)",
    "contact.messagePlaceholder": "Mô tả dự án hoặc yêu cầu của bạn...",
    "contact.characters": "ký tự",
    "contact.infoTitle": "Thông tin liên hệ",
    "contact.socialTitle": "Kết nối với tôi",

    // Footer
    "footer.description": "Full-Stack Developer & Chuyên gia AI",
    "footer.quickLinks": "Liên kết",
    "footer.contact": "Liên hệ",
    "footer.rights": "Bảo lưu mọi quyền.",
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // SSR-safe: only access localStorage in browser
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("language");
      return saved === "vi" || saved === "en" ? saved : "en";
    }
    return "en";
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", language);
    }
  }, [language]);

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
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
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
