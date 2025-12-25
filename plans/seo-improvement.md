# SEO Improvement Plan for VitLaiCodeDao

## 1. Current State Analysis

### Strengths
*   **Framework:** Built on Next.js 14 (App Router) which offers excellent SEO capabilities (SSR/ISR).
*   **Global Metadata:** `app/layout.tsx` correctly implements basic metadata (`title`, `description`, `openGraph`, `twitter`, `alternates`).
*   **Dynamic Sitemaps:** `app/sitemap.ts` correctly generates dynamic routes for blogs and projects.
*   **Robots.txt:** `app/robots.ts` is correctly configured to block admin routes and point to the sitemap.
*   **Structured Data:** Home page and Blog Detail pages already contain JSON-LD structured data (`WebSite`, `Person`, `BlogPosting`).
*   **Fonts:** Optimized using `next/font/google`.

### Weaknesses & Critical Issues
*   **Deprecated `SEO.tsx` Component:** The project uses a `src/components/SEO.tsx` component that relies on `next/head`. **This is incompatible with the App Router** for metadata management and effectively does nothing in Server Components. It is currently used in `app/projects/page.tsx` and `app/blogs/page.tsx`.
*   **Image Optimization:** Blog detail pages use standard `<img>` tags for cover images and markdown content, missing out on Next.js automatic image optimization (lazy loading, sizing, formats).
*   **Canonical URLs:** While `layout.tsx` defines a base canonical, dynamic pages (blogs/projects) do not explicitly override this, potentially leading to self-referencing issues or missing canonicals for deep links if not handled automatically.
*   **Breadcrumbs:** Missing `BreadcrumbList` structured data, which helps rich snippets in search results.

## 2. Technical SEO Strategy

### A. Fix Metadata Implementation (Critical)
The priority is to migrate pages using the legacy `SEO` component to the Next.js Metadata API.

*   **Action:** Refactor `app/projects/page.tsx` and `app/blogs/page.tsx`.
*   **Implementation:** Remove `<SEO />` and export `generateMetadata` function.

### B. Canonical URL Strategy
Ensure every page points to its definitive URL version.

*   **Global:** `layout.tsx` handles the base.
*   **Dynamic:** `generateMetadata` in `[slug]/page.tsx` must explicitly return:
    ```typescript
    alternates: {
      canonical: `/blog/${slug}`,
    }
    ```

### C. Image Optimization & Performance
*   **Cover Images:** Replace `<img>` with `<Image />` component from `next/image` in blog/project detail pages.
*   **Markdown Images:** Create a custom component for `react-markdown` to render images using `next/image`.

## 3. Structured Data Strategy (JSON-LD)

We will standardize Structured Data using a utility or strict patterns in `generateMetadata` or page bodies.

| Page Type | Schema Type | Implementation Location |
| :--- | :--- | :--- |
| **Home** | `WebSite`, `Person`, `ProfessionalService` | `app/page.tsx` (Existing - Keep) |
| **Blog Listing** | `CollectionPage`, `BreadcrumbList` | `app/blogs/page.tsx` |
| **Blog Detail** | `BlogPosting`, `BreadcrumbList` | `app/blog/[slug]/page.tsx` |
| **Project Listing** | `CollectionPage`, `BreadcrumbList` | `app/projects/page.tsx` |
| **Project Detail** | `SoftwareSourceCode` or `CreativeWork` | `app/project/[slug]/page.tsx` |

## 4. Implementation Steps

### Step 1: Migration (High Priority)
1.  **Delete:** `src/components/SEO.tsx`.
2.  **Update:** `app/projects/page.tsx` to use `generateMetadata`.
3.  **Update:** `app/blogs/page.tsx` to use `generateMetadata`.

### Step 2: Content Optimization
1.  **Update:** `app/blog/[slug]/page.tsx` to use `next/image` for the main cover image.
2.  **Update:** `app/blog/[slug]/page.tsx` to add `BreadcrumbList` structured data.
3.  **Update:** `app/project/[slug]/page.tsx` to add `generateMetadata` (if missing) and structured data.

### Step 3: Verification
1.  Run `npm run build` to ensure type safety.
2.  Use Google Rich Results Test on local host (via tunneling) or after deployment.
3.  Check `view-source` to confirm meta tags are present in the `<head>`.

## 5. Future Considerations
*   **Open Graph Image Generation:** Use `@vercel/og` to dynamically generate social share images for every blog post title.
*   **Analytics:** Ensure Google Analytics or similar is properly integrated via `third-parties` library or `layout.tsx` script.
