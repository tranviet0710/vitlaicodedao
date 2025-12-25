# AGENTS.md

## Project Overview
This is a Next.js (App Router) project integrated with Supabase for backend services (database, vector store, edge functions). It uses TypeScript, Tailwind CSS, and Shadcn UI components.

## 1. Build, Lint, and Test Commands

### Core Commands
- **Development Server:** `npm run dev` (Starts Next.js dev server)
- **Production Build:** `npm run build` (Builds the Next.js app)
- **Production Start:** `npm run start` (Starts the built app)
- **Linting:** `npm run lint` (Runs Next.js linting configuration)

### Database Management (Supabase)
- **Push Schema:** `npm run db:push` (Pushes local schema changes to remote/local database)
- **Seed Database:** `npm run db:seed` (Seeds the database with initial data from `supabase/seed/`)
- **Reset Database:** `npm run db:reset` (Resets the database - CAUTION: deletes all data)
- **Migrate:** `npm run db:migrate` (Combines push and seed)
- **Generate Sitemap:** `npm run generate:sitemap`

### Testing
*Note: Currently, there are no explicit test scripts (like Jest or Vitest) defined in `package.json`. If adding tests, prefer Vitest for compatibility with the existing Vite-based tooling config.*

## 2. Code Style & Conventions

### General Principles
- **Framework:** Next.js 14+ (App Router). Use Server Components by default; add `"use client"` only when interactivity (hooks, event listeners) is required.
- **Language:** TypeScript. Use strictly typed interfaces/types. Avoid `any` where possible, though strict mode is currently relaxed in `tsconfig.json`.
- **Styling:** Tailwind CSS. Use utility classes. For complex conditional classes, use `cn()` utility (clsx + tailwind-merge).
- **Fonts:**
  - `Space Grotesk` (sans-serif) for body text
  - `JetBrains Mono` (monospace) for code
  - `Playfair Display` (serif) for headings
  - Fonts are configured in `app/layout.tsx` and available as CSS variables.
- **UI Components:** Shadcn UI (Radix Primitives + Tailwind). Found in `src/components/ui`. Do not reinvent UI patterns; extend existing components.

### File Structure & Naming
- **App Router:** Routes are defined in `app/`. Use standard Next.js file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `not-found.tsx`).
- **Source Directory:** Core code lives in `src/`.
  - `src/components`: React components.
  - `src/hooks`: Custom React hooks.
  - `src/lib`: Utility functions and Zod schemas (`validations.ts`).
  - `src/integrations/supabase`: Supabase client/server setup and types.
- **Component Naming:** PascalCase for components (e.g., `Hero.tsx`, `AdminLayout.tsx`).
- **Function/Variable Naming:** camelCase (e.g., `handleSubmit`, `isLoading`).

### Imports
- **Path Aliases:** Use `@/` to import from `src/`.
  - Example: `import { Button } from "@/components/ui/button"`
- **Grouping:** Group imports:
  1. Built-in (React, Next.js)
  2. Third-party libraries
  3. Internal components (`@/components/...`)
  4. Utilities/Hooks/Types (`@/lib/...`, `@/hooks/...`)
  5. Styles (`./index.css` - rarely needed explicitly due to global imports)

### Error Handling
- Use `try/catch` blocks for async operations, especially Supabase queries.
- Use `sonner` (toast notifications) for user feedback on success/failure.
- Example:
  ```typescript
  try {
    const { error } = await supabase.from('...').select();
    if (error) throw error;
    toast.success("Operation successful");
  } catch (error) {
    console.error("Error:", error);
    toast.error("Something went wrong");
  }
  ```

### Database & Types
- **Supabase Client:** Use the typed client from `@/integrations/supabase/client`.
- **Types:** Database types are generated in `@/integrations/supabase/types.ts`. Use them to ensure type safety when interacting with the DB.

### Environment Variables
- Accessed via `process.env`. Ensure local development uses `.env.local`.
- `.env.local` is ignored by git.

### Linting Rules (ESLint)
- The project extends `next/core-web-vitals` and standard TypeScript/React recommended configs.
- Unused variables are currently set to "off" in `eslint.config.js`, but clean code is preferred.

## 3. Cursor / Copilot Instructions
*No specific `.cursorrules` or `.github/copilot-instructions.md` found. Follow the standard conventions above.*

## 4. Specialized Sub-Agents

When operating in this repository, agents should adopt one of the following personas when requested or when the task requires specialization.

### Planning Agent (`planning-agent`)
**Role:** Technical Architect / Lead Developer
**Goal:** Analyze user requirements, explore the codebase, and produce a detailed, fail-safe implementation plan.
**Responsibilities:**
1.  **Exploration:** thoroughly search and read relevant files to understand context.
2.  **Feasibility:** Verify that dependencies and architectural patterns support the requested feature.
3.  **Deliverable:** A comprehensive step-by-step plan (often stored in `TASKS.md` or a Todo list) that lists:
    *   Files to create/modify.
    *   Specific functions/components to change.
    *   Data model changes (if any).
    *   Verification steps (how to test).
4.  **Constraint:** Do **not** write final implementation code. Focus on *how* and *where*.

### Implementing Agent (`implementing-agent`)
**Role:** Senior Full-Stack Developer
**Goal:** Execute the plan provided by the Planning Agent with high precision and adherence to style.
**Responsibilities:**
1.  **Context:** Read the plan and the files mentioned in it.
2.  **Implementation:** Write the code using `edit` and `write` tools.
    *   Strictly follow the **Code Style & Conventions** (Section 2).
    *   Use the existing UI components (`@/components/ui`) and utility functions.
3.  **Verification:**
    *   Run `npm run lint` to ensure no linting errors.
    *   Run `npm run build` (or `tsc`) to check for type safety.
    *   Self-correct any errors immediately.
4.  **Handover:** Report completion and any deviations from the original plan.
