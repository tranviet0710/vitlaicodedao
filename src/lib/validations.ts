import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string()
    .trim()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  phone: z.string()
    .trim()
    .max(20, { message: 'Phone number must be less than 20 characters' })
    .optional()
    .or(z.literal('')),
  message: z.string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(5000, { message: 'Message must be less than 5000 characters' })
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const blogSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  slug: z.string()
    .trim()
    .min(1, { message: 'Slug is required' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    .max(200, { message: 'Slug must be less than 200 characters' }),
  excerpt: z.string()
    .trim()
    .max(500, { message: 'Excerpt must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
  content: z.string()
    .trim()
    .min(1, { message: 'Content is required' })
    .max(100000, { message: 'Content must be less than 100,000 characters' }),
  cover_image: z.string()
    .trim()
    .url({ message: 'Cover image must be a valid URL' })
    .optional()
    .or(z.literal('')),
  published: z.boolean()
});

export type BlogFormData = z.infer<typeof blogSchema>;

export const projectSchema = z.object({
  title: z.string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  slug: z.string()
    .trim()
    .min(1, { message: 'Slug is required' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug must contain only lowercase letters, numbers, and hyphens' })
    .max(200, { message: 'Slug must be less than 200 characters' }),
  description: z.string()
    .trim()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description must be less than 1000 characters' }),
  category: z.string()
    .trim()
    .min(1, { message: 'Category is required' })
    .max(100, { message: 'Category must be less than 100 characters' }),
  tech_stack: z.string()
    .trim()
    .max(500, { message: 'Tech stack must be less than 500 characters' }),
  thumbnail: z.string()
    .trim()
    .url({ message: 'Thumbnail must be a valid URL' })
    .optional()
    .or(z.literal('')),
  demo_url: z.string()
    .trim()
    .url({ message: 'Demo URL must be a valid URL' })
    .optional()
    .or(z.literal('')),
  github_url: z.string()
    .trim()
    .url({ message: 'GitHub URL must be a valid URL' })
    .optional()
    .or(z.literal(''))
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const testimonialSchema = z.object({
  client_name: z.string()
    .trim()
    .min(1, { message: 'Client name is required' })
    .max(100, { message: 'Client name must be less than 100 characters' }),
  client_role: z.string()
    .trim()
    .min(1, { message: 'Client role is required' })
    .max(100, { message: 'Client role must be less than 100 characters' }),
  client_avatar: z.string()
    .trim()
    .url({ message: 'Client avatar must be a valid URL' })
    .optional()
    .or(z.literal('')),
  content: z.string()
    .trim()
    .min(10, { message: 'Content must be at least 10 characters' })
    .max(1000, { message: 'Content must be less than 1000 characters' }),
  rating: z.number()
    .int()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' })
});

export type TestimonialFormData = z.infer<typeof testimonialSchema>;

export const seoSchema = z.object({
  page_key: z.string().min(1),
  title: z.string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  description: z.string()
    .trim()
    .max(500, { message: 'Description must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
  keywords: z.string()
    .trim()
    .max(500, { message: 'Keywords must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
  og_title: z.string()
    .trim()
    .max(200, { message: 'OG title must be less than 200 characters' })
    .optional()
    .or(z.literal('')),
  og_description: z.string()
    .trim()
    .max(500, { message: 'OG description must be less than 500 characters' })
    .optional()
    .or(z.literal('')),
  og_image: z.string()
    .trim()
    .url({ message: 'OG image must be a valid URL' })
    .optional()
    .or(z.literal('')),
  og_type: z.string()
    .trim()
    .optional()
    .or(z.literal('')),
  twitter_card: z.string()
    .trim()
    .optional()
    .or(z.literal('')),
  twitter_site: z.string()
    .trim()
    .max(100, { message: 'Twitter site must be less than 100 characters' })
    .optional()
    .or(z.literal('')),
  canonical_url: z.string()
    .trim()
    .url({ message: 'Canonical URL must be a valid URL' })
    .optional()
    .or(z.literal(''))
});

export type SEOFormData = z.infer<typeof seoSchema>;
