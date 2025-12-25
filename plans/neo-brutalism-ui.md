# Neo-Brutalism UI Implementation Plan

## 1. Analysis

### Current State
- **Theme:** "Sophisticated" with gradients, glows, `backdrop-blur`, and roundness (`0.75rem`).
- **Colors:** Electric Blue (`hsl(217 91% 60%)`), Purple Accent, White/Dark Backgrounds.
- **Typography:** Space Grotesk (Sans), Playfair Display (Serif), JetBrains Mono.
- **Shadows:** Soft, glowing (`shadow-glow`, `shadow-lg`).
- **Borders:** Thin, subtle.

### Goal: Neo-Brutalism
- **Theme:** Raw, bold, high contrast, "ugly-chic".
- **Visuals:**
    - **Radius:** `0px` everywhere.
    - **Borders:** `2px` or `3px` solid black (`#000`).
    - **Shadows:** Hard, offset shadows (e.g., `5px 5px 0px 0px #000`).
    - **Colors:**
        - Background: Pastel/Off-white (e.g., `hsl(47 88% 88%)` - Beige/Yellowish) or pure white.
        - Primary: Neo-Green, Hot Pink, or Electric Blue but *flat*.
        - Text: Pure Black (`#000`).
    - **Animations:** Instant state changes (no `ease-in-out`), snappy `translate` on click to simulate physical buttons.

## 2. Implementation Strategy

### Phase 1: Global Reset (CSS Variables & Tailwind)

1.  **`app/globals.css`**:
    - Update `:root` colors to a Neo-Brutalist palette.
        - **Bg:** Light beige/yellow or stark white.
        - **Fg:** Black.
        - **Primary:** High-saturation Violet or Green.
        - **Border:** Black.
    - Set `--radius` to `0rem`.
    - Remove "soft" utility classes (`.glass-effect`, `.card-glow`, `.gradient-text`) or redefine them to be "hard" (solid backgrounds, no blur).
    - Add `.neo-shadow` utility class.

2.  **`tailwind.config.ts`**:
    - Extend `boxShadow` with `neo`: `'4px 4px 0px 0px rgba(0,0,0,1)'` and `neo-lg`: `'8px 8px 0px 0px rgba(0,0,0,1)'`.
    - Extend `borderWidth` if needed.
    - Remove soft animations if they conflict.

### Phase 2: Component Overrides (`src/components/ui`)

We need to edit Shadcn components to enforce the style.

-   **`button.tsx`**:
    -   Base: `border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[4px] active:translate-y-[4px]`.
    -   Variants: Ensure all variants (outline, ghost, link) respect the hard edges.

-   **`card.tsx`**:
    -   Base: `border-2 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white`.

-   **`input.tsx`, `textarea.tsx`, `select.tsx`**:
    -   Base: `border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-black`.

-   **`badge.tsx`**:
    -   Base: `border-2 border-black rounded-none font-bold`.

-   **`dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx`**:
    -   Overlays: Solid or heavy pattern instead of blur.
    -   Content: Hard borders, hard shadows.

-   **`toast.tsx` / `sonner.tsx`**:
    -   Square boxes, thick borders.

### Phase 3: Layout & Feature Components

-   **`Navigation.tsx`**: Remove blur, add top/bottom border (2px black).
-   **`Hero.tsx`**: Update typography to be massive and bold. Use "brutalist" layout (grid lines, asymmetrical spacing).
-   **`Footer.tsx`**: Grid layout with visible borders.

## 3. Step-by-Step Execution Plan

1.  **Setup Globals**:
    -   Modify `app/globals.css` to change CSS variables (colors, radius).
    -   Clean up "soft" CSS classes.
2.  **Tailwind Config**:
    -   Add `neo` shadow utilities in `tailwind.config.ts`.
3.  **UI Core**:
    -   Rewrite `button.tsx` and `card.tsx` first as they are most visible.
    -   Rewrite `input.tsx` and form elements.
4.  **Layout**:
    -   Update `Navigation.tsx` and `Footer.tsx`.
5.  **Review**:
    -   Check the Landing Page (`Hero.tsx`, `Services.tsx`, etc.) and fix any lingering "rounded" or "soft" styles.

## 4. Specific CSS Variables to Use

```css
:root {
  /* Neo-Brutalism Light */
  --background: 47 88% 88%; /* Light Yellow/Beige Paper */
  --foreground: 0 0% 0%;    /* Pure Black */
  
  --card: 0 0% 100%;        /* White */
  --card-foreground: 0 0% 0%;
  
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 0%;
  
  --primary: 250 100% 65%;  /* Vibrant Violet */
  --primary-foreground: 0 0% 100%;
  
  --secondary: 180 100% 50%; /* Cyan */
  --secondary-foreground: 0 0% 0%;
  
  --muted: 0 0% 90%;
  --muted-foreground: 0 0% 40%;
  
  --accent: 320 100% 70%;   /* Hot Pink */
  --accent-foreground: 0 0% 0%;
  
  --destructive: 0 100% 50%; /* Red */
  --destructive-foreground: 0 0% 100%;

  --border: 0 0% 0%;        /* Black Borders */
  --input: 0 0% 0%;
  --ring: 0 0% 0%;
  
  --radius: 0rem;           /* NO ROUNDED CORNERS */
}
```
