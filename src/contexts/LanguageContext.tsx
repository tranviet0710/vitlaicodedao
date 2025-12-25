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
    "skills.capabilities": "Capabilities",
    "skills.techRadar": "Tech Radar & Expertise",
    "skills.techRadarDesc": "My technology choices are driven by business requirements, not hype. I focus on stability, scalability, and maintainability.",
    "skills.cat.architecture": "Strategic Architecture",
    "skills.cat.backend": "Backend & Infrastructure",
    "skills.cat.frontend": "Frontend Ecosystem",
    "skills.cat.ai": "AI & Data Engineering",
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

    // Projects Page
    "projectsPage.badge": "Portfolio & Work Showcase",
    "projectsPage.heroTitle": "My",
    "projectsPage.heroTitleHighlight": "Projects",
    "projectsPage.heroDesc": "Explore a collection of projects showcasing modern web development, innovative solutions, and cutting-edge technologies.",
    "projectsPage.searchPlaceholder": "Search projects by name or technology...",
    "projectsPage.clearFilters": "Clear Filters",
    "projectsPage.tryAdjusting": "Try adjusting your filters or search query",
    "projectsPage.checkBack": "Check back soon for new projects!",
    "projectsPage.showing": "Showing",
    "projectsPage.project": "project",
    "projectsPage.projects": "projects",
    "projectsPage.in": "in",
    "projectsPage.startProject": "Start a Project",
    "projectsPage.all": "All",

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
    "blog.badge": "Latest Articles & Insights",
    "blog.heroTitle": "Explore Our",
    "blog.heroTitleHighlight": "Blog Posts",
    "blog.heroDesc": "Dive into articles about web development, programming best practices, and cutting-edge technologies. Learn, grow, and stay updated.",
    "blog.searchPlaceholder": "Search articles...",
    "blog.noArticlesDesc": "Check back soon for new content!",
    "blog.tryAdjusting": "Try adjusting your search query",
    "blog.showing": "Showing",
    "blog.article": "article",
    "blog.articles": "articles",
    "blog.getInTouch": "Get In Touch",

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

    // Services
    "services.title": "Services &",
    "services.titleHighlight": "Pricing",
    "services.popular": "Most Popular",
    "services.frontend.name": "Frontend Development",
    "services.frontend.description": "Beautiful, responsive websites with React/Next.js",
    "services.frontend.price": "$500+",
    "services.frontend.period": "project",
    "services.frontend.f1": "Responsive Design",
    "services.frontend.f2": "SEO Optimization",
    "services.frontend.f3": "Fast Performance",
    "services.backend.name": "Backend Systems",
    "services.backend.description": "Scalable APIs and database architecture",
    "services.backend.price": "$800+",
    "services.backend.period": "project",
    "services.backend.f1": "API Design",
    "services.backend.f2": "Database Design",
    "services.backend.f3": "Security Best Practices",
    "services.fullstack.name": "Full Stack Solution",
    "services.fullstack.description": "End-to-end application development",
    "services.fullstack.price": "$1200+",
    "services.fullstack.period": "project",
    "services.fullstack.f1": "Complete System",
    "services.fullstack.f2": "Admin Dashboard",
    "services.fullstack.f3": "Deployment & CI/CD",
    "services.getStarted": "Get Started",

    // Stats
    "stats.articles": "Articles",
    "stats.readers": "Readers",
    "stats.topics": "Topics",
    "stats.projects": "Projects",
    "stats.categories": "Categories",
    "stats.linesOfCode": "Lines of Code",

    // Section Headers & CTAs
    "section.noArticles": "No articles found",
    "section.stayUpdated": "Want to Stay",
    "section.stayUpdatedHighlight": "Updated?",
    "section.stayUpdatedDesc": "Subscribe to my newsletter for the latest tech trends and coding tips.",
    "section.noProjects": "No projects found",
    "section.haveProject": "Have a Project",
    "section.haveProjectHighlight": "in Mind?",
    "section.haveProjectDesc": "Let's turn your ideas into reality. Book a call to discuss your next big thing.",

    // Projects specific
    "project.keyImpact": "Key Impact",
    "project.readCaseStudy": "Read Case Study",
    "project.softwareEngineer": "Software Engineer",

    // Admin
    "admin.dashboard": "Dashboard",
    "admin.blogs": "Blogs",
    "admin.projects": "Projects",
    "admin.testimonials": "Testimonials",
    "admin.supportRequests": "Support Requests",
    "admin.auditLogs": "Audit Logs",
    "admin.notifications": "Notifications",
    "admin.seo": "SEO Settings",
    "admin.logout": "Logout",
    "admin.overview": "Content Management Overview",
    "admin.contentTrends": "Content Trends",
    "admin.contentDistribution": "Content Distribution",
    "admin.recentActivity": "Recent Activity",
    "admin.noActivity": "No recent activity",
    "admin.manageBlogs": "Manage Blogs",
    "admin.manageProjects": "Manage Projects",
    "admin.blogDesc": "Create and edit blog posts",
    "admin.projectDesc": "Add and edit projects",
    "admin.createBlog": "Create New Blog",
    "admin.editBlog": "Edit Blog",
    "admin.createProject": "Create New Project",
    "admin.editProject": "Edit Project",
    "admin.title": "Title",
    "admin.slug": "Slug",
    "admin.excerpt": "Excerpt",
    "admin.content": "Content",
    "admin.coverImage": "Cover Image URL",
    "admin.published": "Published",
    "admin.draft": "Draft",
    "admin.category": "Category",
    "admin.techStack": "Tech Stack",
    "admin.description": "Description",
    "admin.thumbnail": "Thumbnail URL",
    "admin.demoUrl": "Demo URL",
    "admin.githubUrl": "GitHub URL",
    "admin.create": "Create",
    "admin.update": "Update",
    "admin.cancel": "Cancel",
    "admin.delete": "Delete",
    "admin.confirmDelete": "Are you sure you want to delete this?",
    "admin.success": "Success",
    "admin.error": "Error",
    "admin.loading": "Loading...",

    // Admin - Testimonials
    "admin.testimonialsManagement": "Testimonials Management",
    "admin.testimonialsDesc": "Add and edit client reviews",
    "admin.editTestimonial": "Edit Testimonial",
    "admin.createTestimonial": "Create New Testimonial",
    "admin.clientName": "Client Name",
    "admin.clientRole": "Position/Role",
    "admin.clientAvatar": "Avatar URL",
    "admin.testimonialContent": "Review Content",
    "admin.rating": "Rating (Stars)",
    "admin.deleteTestimonialSuccess": "Testimonial deleted successfully!",
    "admin.deleteTestimonialConfirm": "Are you sure you want to delete this testimonial?",
    "admin.saveTestimonialSuccess": "Testimonial saved successfully!",
    "admin.updateTestimonialSuccess": "Testimonial updated successfully!",

    // Admin - Support Requests
    "admin.supportRequestsManagement": "Support Requests Management",
    "admin.supportRequestsDesc": "View and handle user requests",
    "admin.filterStatus": "Filter by status:",
    "admin.statusAll": "All",
    "admin.statusPending": "Pending",
    "admin.statusInProgress": "In Progress",
    "admin.statusCompleted": "Completed",
    "admin.statusCancelled": "Cancelled",
    "admin.noRequests": "No requests found",
    "admin.deleteRequestSuccess": "Request deleted successfully!",
    "admin.updateStatusSuccess": "Status updated successfully!",
    "admin.deleteRequestConfirm": "Are you sure you want to delete this request?",
    "admin.viewAndHandle": "View and handle",
    "admin.markAsProcessing": "Mark as Processing",
    "admin.markAsCompleted": "Mark as Completed",
    "admin.markAsCancelled": "Mark as Cancelled",
    "admin.deleteRequest": "Delete Request",

    // Footer
    "footer.description": "Full-Stack Developer & AI Specialist",
    "footer.quickLinks": "Links",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.copyright": "Copyright © 2025 Viet Dev.",
    "footer.madeWith": "Made with",
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
    "skills.capabilities": "Năng Lực",
    "skills.techRadar": "Bản Đồ Công Nghệ & Chuyên Môn",
    "skills.techRadarDesc": "Lựa chọn công nghệ của tôi dựa trên yêu cầu kinh doanh, không chạy theo trào lưu. Tôi tập trung vào sự ổn định, khả năng mở rộng và khả năng bảo trì.",
    "skills.cat.architecture": "Kiến Trúc Chiến Lược",
    "skills.cat.backend": "Backend & Hạ Tầng",
    "skills.cat.frontend": "Hệ Sinh Thái Frontend",
    "skills.cat.ai": "Kỹ Thuật AI & Dữ Liệu",
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

    // Projects Page
    "projectsPage.badge": "Portfolio & Các Dự Án",
    "projectsPage.heroTitle": "Dự Án",
    "projectsPage.heroTitleHighlight": "Của Tôi",
    "projectsPage.heroDesc": "Khám phá bộ sưu tập các dự án thể hiện sự phát triển web hiện đại, các giải pháp sáng tạo và công nghệ tiên tiến.",
    "projectsPage.searchPlaceholder": "Tìm kiếm dự án theo tên hoặc công nghệ...",
    "projectsPage.clearFilters": "Xóa bộ lọc",
    "projectsPage.tryAdjusting": "Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn",
    "projectsPage.checkBack": "Hãy quay lại sớm để xem các dự án mới!",
    "projectsPage.showing": "Đang hiển thị",
    "projectsPage.project": "dự án",
    "projectsPage.projects": "dự án",
    "projectsPage.in": "trong",
    "projectsPage.startProject": "Bắt đầu Dự Án",
    "projectsPage.all": "Tất cả",

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
    "blog.badge": "Bài Viết & Thông Tin Mới Nhất",
    "blog.heroTitle": "Khám Phá",
    "blog.heroTitleHighlight": "Bài Viết Của Chúng Tôi",
    "blog.heroDesc": "Đắm mình trong các bài viết về phát triển web, thực tiễn lập trình tốt nhất và công nghệ tiên tiến. Học hỏi, phát triển và cập nhật.",
    "blog.searchPlaceholder": "Tìm kiếm bài viết...",
    "blog.noArticlesDesc": "Hãy quay lại sớm để xem nội dung mới!",
    "blog.tryAdjusting": "Thử điều chỉnh truy vấn tìm kiếm của bạn",
    "blog.showing": "Đang hiển thị",
    "blog.article": "bài viết",
    "blog.articles": "bài viết",
    "blog.getInTouch": "Liên Hệ Ngay",

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

    // Services
    "services.title": "Dịch vụ &",
    "services.titleHighlight": "Bảng giá",
    "services.popular": "Phổ biến nhất",
    "services.frontend.name": "Phát triển Frontend",
    "services.frontend.description": "Website đẹp, tương thích mọi thiết bị với React/Next.js",
    "services.frontend.price": "$500+",
    "services.frontend.period": "dự án",
    "services.frontend.f1": "Thiết kế Responsive",
    "services.frontend.f2": "Tối ưu hóa SEO",
    "services.frontend.f3": "Hiệu năng cao",
    "services.backend.name": "Hệ thống Backend",
    "services.backend.description": "API mở rộng và kiến trúc cơ sở dữ liệu",
    "services.backend.price": "$800+",
    "services.backend.period": "dự án",
    "services.backend.f1": "Thiết kế API",
    "services.backend.f2": "Thiết kế CSDL",
    "services.backend.f3": "Bảo mật",
    "services.fullstack.name": "Giải pháp Full Stack",
    "services.fullstack.description": "Phát triển ứng dụng trọn gói từ A-Z",
    "services.fullstack.price": "$1200+",
    "services.fullstack.period": "dự án",
    "services.fullstack.f1": "Hệ thống hoàn chỉnh",
    "services.fullstack.f2": "Trang quản trị (Admin)",
    "services.fullstack.f3": "Triển khai & CI/CD",
    "services.getStarted": "Bắt đầu ngay",

    // Stats
    "stats.articles": "Bài viết",
    "stats.readers": "Người đọc",
    "stats.topics": "Chủ đề",
    "stats.projects": "Dự án",
    "stats.categories": "Danh mục",
    "stats.linesOfCode": "Dòng code",

    // Section Headers & CTAs
    "section.noArticles": "Không tìm thấy bài viết nào",
    "section.stayUpdated": "Bạn muốn cập nhật",
    "section.stayUpdatedHighlight": "Mới nhất?",
    "section.stayUpdatedDesc": "Đăng ký nhận tin để không bỏ lỡ xu hướng công nghệ và mẹo lập trình.",
    "section.noProjects": "Không tìm thấy dự án nào",
    "section.haveProject": "Bạn có ý tưởng",
    "section.haveProjectHighlight": "Dự án?",
    "section.haveProjectDesc": "Hãy biến ý tưởng thành hiện thực. Đặt lịch tư vấn để thảo luận ngay hôm nay.",

    // Projects specific
    "project.keyImpact": "Hiệu quả chính",
    "project.readCaseStudy": "Xem Case Study",
    "project.softwareEngineer": "Kỹ sư phần mềm",

    // Admin
    "admin.dashboard": "Bảng điều khiển",
    "admin.blogs": "Bài viết",
    "admin.projects": "Dự án",
    "admin.testimonials": "Đánh giá",
    "admin.supportRequests": "Yêu cầu hỗ trợ",
    "admin.auditLogs": "Nhật ký kiểm tra",
    "admin.notifications": "Thông báo",
    "admin.seo": "Cài đặt SEO",
    "admin.logout": "Đăng xuất",
    "admin.overview": "Tổng quan quản lý nội dung",
    "admin.contentTrends": "Xu hướng nội dung",
    "admin.contentDistribution": "Phân bổ nội dung",
    "admin.recentActivity": "Hoạt động gần đây",
    "admin.noActivity": "Chưa có hoạt động nào",
    "admin.manageBlogs": "Quản lý bài viết",
    "admin.manageProjects": "Quản lý dự án",
    "admin.blogDesc": "Tạo và chỉnh sửa bài viết",
    "admin.projectDesc": "Thêm và chỉnh sửa dự án",
    "admin.createBlog": "Tạo bài viết mới",
    "admin.editBlog": "Chỉnh sửa bài viết",
    "admin.createProject": "Tạo dự án mới",
    "admin.editProject": "Chỉnh sửa dự án",
    "admin.title": "Tiêu đề",
    "admin.slug": "Slug",
    "admin.excerpt": "Tóm tắt",
    "admin.content": "Nội dung",
    "admin.coverImage": "URL ảnh bìa",
    "admin.published": "Đã xuất bản",
    "admin.draft": "Nháp",
    "admin.category": "Danh mục",
    "admin.techStack": "Công nghệ (Tech Stack)",
    "admin.description": "Mô tả",
    "admin.thumbnail": "URL ảnh đại diện",
    "admin.demoUrl": "Demo URL",
    "admin.githubUrl": "GitHub URL",
    "admin.create": "Tạo mới",
    "admin.update": "Cập nhật",
    "admin.cancel": "Hủy",
    "admin.delete": "Xóa",
    "admin.confirmDelete": "Bạn có chắc chắn muốn xóa không?",
    "admin.success": "Thành công",
    "admin.error": "Lỗi",
    "admin.loading": "Đang tải...",

    // Admin - Testimonials
    "admin.testimonialsManagement": "Quản lý Đánh giá",
    "admin.testimonialsDesc": "Thêm và chỉnh sửa đánh giá khách hàng",
    "admin.editTestimonial": "Chỉnh sửa đánh giá",
    "admin.createTestimonial": "Tạo đánh giá mới",
    "admin.clientName": "Tên khách hàng",
    "admin.clientRole": "Chức vụ/Vai trò",
    "admin.clientAvatar": "URL Avatar",
    "admin.testimonialContent": "Nội dung đánh giá",
    "admin.rating": "Đánh giá (Sao)",
    "admin.deleteTestimonialSuccess": "Xóa đánh giá thành công!",
    "admin.deleteTestimonialConfirm": "Bạn có chắc chắn muốn xóa đánh giá này?",
    "admin.saveTestimonialSuccess": "Lưu đánh giá thành công!",
    "admin.updateTestimonialSuccess": "Cập nhật đánh giá thành công!",

    // Admin - Support Requests
    "admin.supportRequestsManagement": "Quản lý Yêu cầu Hỗ trợ",
    "admin.supportRequestsDesc": "Xem và xử lý yêu cầu từ người dùng",
    "admin.filterStatus": "Lọc theo trạng thái:",
    "admin.statusAll": "Tất cả",
    "admin.statusPending": "Chờ xử lý",
    "admin.statusInProgress": "Đang xử lý",
    "admin.statusCompleted": "Hoàn thành",
    "admin.statusCancelled": "Đã hủy",
    "admin.noRequests": "Không tìm thấy yêu cầu nào",
    "admin.deleteRequestSuccess": "Xóa yêu cầu thành công!",
    "admin.updateStatusSuccess": "Cập nhật trạng thái thành công!",
    "admin.deleteRequestConfirm": "Bạn có chắc chắn muốn xóa yêu cầu này?",
    "admin.viewAndHandle": "Xem và xử lý",
    "admin.markAsProcessing": "Đánh dấu đang xử lý",
    "admin.markAsCompleted": "Đánh dấu hoàn thành",
    "admin.markAsCancelled": "Đánh dấu đã hủy",
    "admin.deleteRequest": "Xóa yêu cầu",

    // Footer
    "footer.description": "Full-Stack Developer & Chuyên gia AI",
    "footer.quickLinks": "Liên kết",
    "footer.contact": "Liên hệ",
    "footer.rights": "Bảo lưu mọi quyền.",
    "footer.copyright": "Bản quyền © 2025 Viet Dev.",
    "footer.madeWith": "Được làm bằng",
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
