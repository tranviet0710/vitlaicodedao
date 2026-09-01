"use client";

import { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  Code,
  CodeSquare,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Minus,
  ImagePlus,
  Loader2,
  Eye,
  EyeOff,
  Upload,
  Highlighter,
  Palette,
  MessageSquareWarning,
  Youtube,
  Table as TableIcon,
  Pilcrow,
  Columns2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MarkdownContent } from "@/components/markdown/MarkdownContent";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  /** Folder inside the `assets` bucket that pasted/uploaded images land in. */
  uploadFolder?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

/** Swatches map to the highlight classes allowlisted in markdown-schema.ts. */
const HIGHLIGHTS = [
  { cls: "hl-yellow", label: "Yellow", swatch: "hsl(50 100% 60%)" },
  { cls: "hl-green", label: "Green", swatch: "hsl(140 80% 60%)" },
  { cls: "hl-blue", label: "Blue", swatch: "hsl(200 100% 65%)" },
  { cls: "hl-pink", label: "Pink", swatch: "hsl(320 100% 72%)" },
  { cls: "hl-violet", label: "Violet", swatch: "hsl(250 100% 75%)" },
];

const TEXT_COLORS = [
  { cls: "tx-violet", label: "Violet", swatch: "hsl(250 100% 65%)" },
  { cls: "tx-cyan", label: "Cyan", swatch: "hsl(185 100% 38%)" },
  { cls: "tx-pink", label: "Pink", swatch: "hsl(320 100% 55%)" },
  { cls: "tx-green", label: "Green", swatch: "hsl(145 75% 38%)" },
  { cls: "tx-red", label: "Red", swatch: "hsl(0 90% 52%)" },
  { cls: "tx-muted", label: "Muted", swatch: "hsl(0 0% 55%)" },
];

const CALLOUTS = [
  { cls: "callout-info", label: "Info", emoji: "ℹ️" },
  { cls: "callout-tip", label: "Tip", emoji: "✅" },
  { cls: "callout-warn", label: "Warning", emoji: "⚠️" },
  { cls: "callout-danger", label: "Danger", emoji: "🚫" },
];

const IMAGE_LAYOUTS = [
  { cls: "img-full img-center", label: "Full width" },
  { cls: "img-md img-center", label: "Medium, centered" },
  { cls: "img-sm img-center", label: "Small, centered" },
  { cls: "img-sm img-left", label: "Small, float left" },
  { cls: "img-sm img-right", label: "Small, float right" },
];

const TABLE_TEMPLATE = `
| Column A | Column B |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |
`;

/** Accepts a full YouTube URL or a bare id and returns the id. */
function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{6,20}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1);
      return /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
    }
    if (url.hostname.endsWith("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.split("/embed/")[1];
      return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function MarkdownEditor({
  value,
  onChange,
  className,
  placeholder = "Write your blog content in Markdown...",
  uploadFolder = "blog-content",
}: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingLayout, setPendingLayout] = useState(IMAGE_LAYOUTS[0].cls);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /** Wrap the selection (or a placeholder) with the given strings. */
  const insertAtCursor = useCallback(
    (textBefore: string, textAfter = "", selectPlaceholder?: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const insertText = selectedText || selectPlaceholder || "";

      const newValue =
        value.substring(0, start) +
        textBefore +
        insertText +
        textAfter +
        value.substring(end);

      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursorStart = start + textBefore.length;
        textarea.setSelectionRange(cursorStart, cursorStart + insertText.length);
      });
    },
    [value, onChange]
  );

  /** Prefix the current line, e.g. for headings and list items. */
  const prefixLine = useCallback(
    (prefix: string, placeholderText: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const selectedText = value.substring(start, end);
      const insertText = selectedText || placeholderText;

      const newValue =
        value.substring(0, lineStart) +
        prefix +
        value.substring(lineStart, start) +
        insertText +
        value.substring(end);

      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const cursorStart = start + prefix.length;
        textarea.setSelectionRange(cursorStart, cursorStart + insertText.length);
      });
    },
    [value, onChange]
  );

  /** Insert a block on its own lines, keeping surrounding blank lines tidy. */
  const insertBlock = useCallback(
    (block: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const needsLeadingBreak = start > 0 && !value.endsWith("\n", start);
      const prefix = needsLeadingBreak ? "\n\n" : "";
      const text = `${prefix}${block}\n`;

      const newValue = value.substring(0, start) + text + value.substring(start);
      onChange(newValue);

      requestAnimationFrame(() => {
        textarea.focus();
        const pos = start + text.length;
        textarea.setSelectionRange(pos, pos);
      });
    },
    [value, onChange]
  );

  const wrapInSpan = useCallback(
    (cls: string, placeholderText: string) => {
      insertAtCursor(`<span class="${cls}">`, "</span>", placeholderText);
    },
    [insertAtCursor]
  );

  const insertCallout = useCallback(
    (cls: string, label: string) => {
      insertBlock(
        `<div class="callout ${cls}">\n\n**${label}:** Write the ${label.toLowerCase()} here.\n\n</div>`
      );
    },
    [insertBlock]
  );

  const insertYouTube = useCallback(() => {
    const input = window.prompt("Paste a YouTube URL or video id:");
    if (!input) return;

    const id = extractYouTubeId(input);
    if (!id) {
      toast({
        title: "Not a YouTube link",
        description: "Paste a full YouTube URL or a bare video id.",
        variant: "destructive",
      });
      return;
    }
    insertBlock(`<div class="embed-youtube" data-youtube-id="${id}"></div>`);
  }, [insertBlock, toast]);

  const uploadImage = useCallback(
    async (file: File) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only JPEG, PNG, GIF, WebP, and SVG images are allowed.",
          variant: "destructive",
        });
        return null;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "Image must be smaller than 5MB.",
          variant: "destructive",
        });
        return null;
      }

      try {
        setIsUploading(true);
        const fileExt = file.name.split(".").pop() || "png";
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${uploadFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("assets")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("assets").getPublicUrl(filePath);
        return data.publicUrl;
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [toast, uploadFolder]
  );

  const insertImage = useCallback(
    async (file: File, layout: string) => {
      const url = await uploadImage(file);
      if (!url) return;

      const altText = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      // Alt doubles as the caption, so keep it human-readable.
      insertBlock(`<img src="${url}" alt="${altText}" class="${layout}" />`);
      toast({
        title: "Image inserted",
        description: "Edit the alt text — it is also used as the caption.",
      });
    },
    [uploadImage, insertBlock, toast]
  );

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      await insertImage(file, pendingLayout);
      e.target.value = "";
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const imageFiles = Array.from(e.dataTransfer.files).filter((f) =>
        ALLOWED_IMAGE_TYPES.includes(f.type)
      );
      for (const file of imageFiles) {
        await insertImage(file, pendingLayout);
      }
    },
    [insertImage, pendingLayout]
  );

  const handlePaste = useCallback(
    async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const imageItems = Array.from(e.clipboardData.items).filter((item) =>
        item.type.startsWith("image/")
      );
      if (imageItems.length === 0) return;

      e.preventDefault();
      for (const item of imageItems) {
        const file = item.getAsFile();
        if (file) await insertImage(file, pendingLayout);
      }
    },
    [insertImage, pendingLayout]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (isMod && e.key === "b") {
        e.preventDefault();
        insertAtCursor("**", "**", "bold text");
      } else if (isMod && e.key === "i") {
        e.preventDefault();
        insertAtCursor("*", "*", "italic text");
      } else if (isMod && e.key === "k") {
        e.preventDefault();
        insertAtCursor("[", "](url)", "link text");
      } else if (isMod && e.key === "e") {
        e.preventDefault();
        insertAtCursor("`", "`", "code");
      } else if (e.key === "Tab") {
        e.preventDefault();
        insertAtCursor("  ");
      }
    },
    [insertAtCursor]
  );

  const toolbarButton =
    "h-8 w-8 p-0 hover:bg-background hover:border-border";

  return (
    <div className={`space-y-0 ${className || ""}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-t-md border-2 border-b-0 border-border bg-muted/50 p-2">
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => prefixLine("## ", "Heading")} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => prefixLine("### ", "Heading")} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertAtCursor("**", "**", "bold text")} title="Bold (⌘B)">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertAtCursor("*", "*", "italic text")} title="Italic (⌘I)">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertAtCursor("~~", "~~", "struck text")} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Highlight colours */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={toolbarButton} title="Highlight">
              <Highlighter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-2 border-border">
            <DropdownMenuLabel>Highlight</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {HIGHLIGHTS.map((h) => (
              <DropdownMenuItem key={h.cls} onSelect={() => wrapInSpan(h.cls, "highlighted text")}>
                <span className="mr-2 inline-block h-4 w-4 border-2 border-border"
                  style={{ backgroundColor: h.swatch }} />
                {h.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Text colours */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={toolbarButton} title="Text colour">
              <Palette className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-2 border-border">
            <DropdownMenuLabel>Text colour</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {TEXT_COLORS.map((c) => (
              <DropdownMenuItem key={c.cls} onSelect={() => wrapInSpan(c.cls, "coloured text")}>
                <span className="mr-2 inline-block h-4 w-4 border-2 border-border"
                  style={{ backgroundColor: c.swatch }} />
                {c.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Callouts */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={toolbarButton} title="Callout box">
              <MessageSquareWarning className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-2 border-border">
            <DropdownMenuLabel>Callout box</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CALLOUTS.map((c) => (
              <DropdownMenuItem key={c.cls} onSelect={() => insertCallout(c.cls, c.label)}>
                <span className="mr-2">{c.emoji}</span>
                {c.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() =>
            insertBlock(
              '<p class="lead">Write the opening paragraph that hooks the reader.</p>'
            )
          }
          title="Lead paragraph">
          <Pilcrow className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertAtCursor("[", "](url)", "link text")} title="Link (⌘K)">
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertAtCursor("`", "`", "code")} title="Inline code (⌘E)">
          <Code className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertBlock("```ts\ncode block\n```")} title="Code block">
          <CodeSquare className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => prefixLine("- ", "list item")} title="Bullet list">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => prefixLine("1. ", "list item")} title="Numbered list">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => prefixLine("> ", "quote")} title="Blockquote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertBlock(TABLE_TEMPLATE.trim())} title="Table">
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={() => insertBlock("---")} title="Divider">
          <Minus className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className={toolbarButton}
          onClick={insertYouTube} title="Embed YouTube video">
          <Youtube className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-border" />

        {/* Image layout picker — applies to the next upload/drop/paste */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm"
              className="h-8 gap-1.5 px-2 hover:bg-background" title="Layout for inserted images">
              <Columns2 className="h-4 w-4" />
              <span className="hidden text-xs font-medium lg:inline">
                {IMAGE_LAYOUTS.find((l) => l.cls === pendingLayout)?.label}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="border-2 border-border">
            <DropdownMenuLabel>Image layout</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {IMAGE_LAYOUTS.map((l) => (
              <DropdownMenuItem key={l.cls} onSelect={() => setPendingLayout(l.cls)}>
                {l.label}
                {l.cls === pendingLayout && <span className="ml-auto pl-3 text-primary">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2 text-primary hover:bg-background hover:border-border"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Upload an image into the content"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          <span className="hidden text-xs font-medium sm:inline">
            {isUploading ? "Uploading..." : "Image"}
          </span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="flex-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 gap-1.5 px-2 ${
            showPreview ? "bg-primary/10 text-primary" : "hover:bg-background"
          }`}
          onClick={() => setShowPreview(!showPreview)}
          title={showPreview ? "Hide preview" : "Show preview"}
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="hidden text-xs font-medium sm:inline">Preview</span>
        </Button>
      </div>

      {/* Editor + preview */}
      <div
        className={`grid ${
          showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        } overflow-hidden rounded-b-md border-2 border-border`}
      >
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onPaste={handlePaste}
            placeholder={placeholder}
            spellCheck={false}
            className={`min-h-[500px] w-full resize-y bg-background p-4 pb-8 font-mono text-sm leading-relaxed text-foreground focus:outline-none focus:ring-0 ${
              showPreview ? "lg:border-r-2 lg:border-border" : ""
            } ${isDragOver ? "bg-primary/5" : ""}`}
          />

          {isDragOver && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-primary bg-primary/10">
              <div className="neo-shadow flex flex-col items-center gap-2 border-2 border-border bg-background px-6 py-4">
                <Upload className="h-8 w-8 text-primary" />
                <span className="text-sm font-bold text-primary">
                  Drop image to upload
                </span>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="neo-shadow absolute bottom-4 right-4 z-10 flex items-center gap-2 border-2 border-border bg-background px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-medium">Uploading image...</span>
            </div>
          )}

          <div className="pointer-events-none absolute bottom-2 left-4 hidden select-none text-xs text-muted-foreground/50 md:block">
            <span className="font-mono">⌘B</span> Bold
            <span className="ml-2 font-mono">⌘I</span> Italic
            <span className="ml-2 font-mono">⌘K</span> Link
            <span className="ml-2 font-mono">⌘E</span> Code
          </div>
        </div>

        {showPreview && (
          <div className="overflow-auto border-t-2 border-border bg-background lg:border-t-0">
            <div className="sticky top-0 z-10 border-b border-border bg-muted/80 px-4 py-2 backdrop-blur-sm">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Eye className="h-3 w-3" />
                Live preview — matches the published page
              </span>
            </div>

            <div className="min-h-[500px] p-6">
              {value ? (
                <MarkdownContent content={value} />
              ) : (
                <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-muted-foreground">
                  <Eye className="mb-4 h-12 w-12 opacity-20" />
                  <p className="text-sm font-medium">Start writing to see the preview</p>
                  <p className="mt-1 text-xs opacity-60">
                    Markdown + colours, callouts, images and embeds
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1 pt-2">
        <p className="text-xs text-muted-foreground">
          Drag &amp; drop or paste images • Max 5MB • Alt text becomes the caption
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          {value.length.toLocaleString()} chars
        </p>
      </div>
    </div>
  );
}
