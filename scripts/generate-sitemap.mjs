import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = "https://vitlaicodedao.tech";

// Generate XML sitemap header
const generateSitemapHeader = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
};

const generateSitemapFooter = () => "</urlset>";

// Generate URL entry
const generateUrlEntry = (loc, lastmod, changefreq, priority, image = null) => {
  const imageTag = image
    ? `
    <image:image>
      <image:loc>${image}</image:loc>
    </image:image>`
    : "";

  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${imageTag}
  </url>`;
};

// Generate main sitemap
const generateMainSitemap = async () => {
  const today = new Date().toISOString().split("T")[0];

  let sitemap = generateSitemapHeader();

  // Main pages
  const mainPages = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/#about", changefreq: "monthly", priority: "0.8" },
    { path: "/#services", changefreq: "monthly", priority: "0.8" },
    { path: "/#skills", changefreq: "monthly", priority: "0.7" },
    { path: "/#projects", changefreq: "weekly", priority: "0.9" },
    { path: "/#blog", changefreq: "daily", priority: "0.9" },
    { path: "/#testimonials", changefreq: "monthly", priority: "0.6" },
    { path: "/#contact", changefreq: "monthly", priority: "0.8" },
  ];

  mainPages.forEach((page) => {
    sitemap += generateUrlEntry(
      `${SITE_URL}${page.path}`,
      today,
      page.changefreq,
      page.priority
    );
  });

  sitemap += generateSitemapFooter();

  writeFileSync(join(__dirname, "../public/sitemap.xml"), sitemap);

  console.log("✅ Main sitemap generated successfully!");
};

// Generate blog sitemap
const generateBlogSitemap = async () => {
  try {
    const { data: blogs, error } = await supabase
      .from("blogs")
      .select("slug, created_at, updated_at, cover_image, title")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(
        "⚠️  Could not fetch blogs from database, creating empty blog sitemap"
      );
    }

    let sitemap = generateSitemapHeader();

    // Add blog index
    sitemap += generateUrlEntry(
      `${SITE_URL}/#blog`,
      new Date().toISOString().split("T")[0],
      "daily",
      "0.9"
    );

    // Add individual blog posts
    if (blogs && blogs.length > 0) {
      blogs.forEach((blog) => {
        const lastmod = (blog.updated_at || blog.created_at).split("T")[0];
        sitemap += generateUrlEntry(
          `${SITE_URL}/blog/${blog.slug}`,
          lastmod,
          "monthly",
          "0.7",
          blog.cover_image
        );
      });
    }

    sitemap += generateSitemapFooter();

    writeFileSync(join(__dirname, "../public/sitemap-blogs.xml"), sitemap);

    console.log(`✅ Blog sitemap generated with ${blogs?.length || 0} posts!`);
  } catch (error) {
    console.error("❌ Error generating blog sitemap:", error.message);

    // Create minimal sitemap even on error
    let sitemap = generateSitemapHeader();
    sitemap += generateUrlEntry(
      `${SITE_URL}/#blog`,
      new Date().toISOString().split("T")[0],
      "daily",
      "0.9"
    );
    sitemap += generateSitemapFooter();
    writeFileSync(join(__dirname, "../public/sitemap-blogs.xml"), sitemap);
  }
};

// Generate project sitemap
const generateProjectSitemap = async () => {
  try {
    const { data: projects, error } = await supabase
      .from("projects")
      .select("slug, created_at, updated_at, image, title")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn(
        "⚠️  Could not fetch projects from database, creating empty project sitemap"
      );
    }

    let sitemap = generateSitemapHeader();

    // Add projects index
    sitemap += generateUrlEntry(
      `${SITE_URL}/#projects`,
      new Date().toISOString().split("T")[0],
      "weekly",
      "0.9"
    );

    // Add individual projects
    if (projects && projects.length > 0) {
      projects.forEach((project) => {
        const lastmod = (project.updated_at || project.created_at).split(
          "T"
        )[0];
        sitemap += generateUrlEntry(
          `${SITE_URL}/project/${project.slug}`,
          lastmod,
          "monthly",
          "0.6",
          project.image
        );
      });
    }

    sitemap += generateSitemapFooter();

    writeFileSync(join(__dirname, "../public/sitemap-projects.xml"), sitemap);

    console.log(
      `✅ Project sitemap generated with ${projects?.length || 0} projects!`
    );
  } catch (error) {
    console.error("❌ Error generating project sitemap:", error.message);

    // Create minimal sitemap even on error
    let sitemap = generateSitemapHeader();
    sitemap += generateUrlEntry(
      `${SITE_URL}/#projects`,
      new Date().toISOString().split("T")[0],
      "weekly",
      "0.9"
    );
    sitemap += generateSitemapFooter();
    writeFileSync(join(__dirname, "../public/sitemap-projects.xml"), sitemap);
  }
};

// Generate sitemap index
const generateSitemapIndex = () => {
  const today = new Date().toISOString().split("T")[0];

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-blogs.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-projects.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  writeFileSync(join(__dirname, "../public/sitemap-index.xml"), sitemapIndex);

  console.log("✅ Sitemap index generated successfully!");
};

// Main execution
const generateAllSitemaps = async () => {
  console.log("🚀 Generating sitemaps...\n");

  await generateMainSitemap();
  await generateBlogSitemap();
  await generateProjectSitemap();
  generateSitemapIndex();

  console.log("\n✨ All sitemaps generated successfully!");
  console.log("📍 Files created:");
  console.log("   - public/sitemap.xml");
  console.log("   - public/sitemap-blogs.xml");
  console.log("   - public/sitemap-projects.xml");
  console.log("   - public/sitemap-index.xml");
};

generateAllSitemaps();
