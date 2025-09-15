import { z } from "zod";

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("RWF"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["Active", "Draft", "Out of Stock"]).default("Active"),
  featured: z.boolean().default(false),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
  sku: z.string().optional(),
  // @ts-ignore

  specifications: z.record(z.any()).optional(),
  images: z.array(z.string()).default([]),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  status: z.enum(["Draft", "Published", "Scheduled"]).default("Draft"),
  publishedAt: z.date().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  readTime: z.number().int().positive().optional(),
  wordCount: z.number().int().positive().optional(),
});

// Team member validation schema
export const teamMemberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
  startDate: z.date(),
  salary: z.number().positive().optional(),
  status: z.enum(["Active", "On Leave", "Inactive"]).default("Active"),
  skills: z.array(z.string()).default([]),
  // @ts-ignore
  permissions: z.record(z.any()).optional(),
  // @ts-ignore
  emergencyContact: z.record(z.any()).optional(),
  address: z.string().optional(),
});

// Contact validation schema
export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["New", "In Progress", "Replied", "Closed"]).default("New"),
  priority: z.enum(["High", "Medium", "Low"]).default("Medium"),
  source: z.string().default("Website"),
});

// Contact reply validation schema
export const contactReplySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  priority: z.enum(["High", "Urgent", "Normal", "Low"]).default("Normal"),
  scheduleSend: z.boolean().default(false),
  scheduleDate: z.date().optional(),
  scheduleTime: z.string().optional(),
  sendCopy: z.boolean().default(false),
  contactId: z.string().min(1, "Contact ID is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ContactReplyInput = z.infer<typeof contactReplySchema>;
