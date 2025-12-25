
import { Metadata } from "next";
import ProjectsContent from "@/components/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects - VietDev | Full-Stack Development Portfolio",
  description:
    "Explore my portfolio of web development projects featuring React, Node.js, TypeScript, and modern technologies. View live demos and source code.",
  keywords:
    "web development projects, React portfolio, Node.js projects, TypeScript apps, full-stack projects, developer portfolio",
  openGraph: {
    title: "Projects - VietDev | Full-Stack Development Portfolio",
    description:
      "Explore my portfolio of web development projects featuring React, Node.js, TypeScript, and modern technologies. View live demos and source code.",
    type: "website",
    url: "https://vitlaicodedao.tech/projects",
    siteName: "Viet Dev",
  },
  alternates: {
    canonical: "https://vitlaicodedao.tech/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
