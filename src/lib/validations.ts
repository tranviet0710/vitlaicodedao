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
