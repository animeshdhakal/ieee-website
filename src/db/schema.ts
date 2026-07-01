import { pgTable, serial, text, timestamp, boolean, jsonb, integer, doublePrecision } from "drizzle-orm/pg-core";
import type { FormField } from "@/lib/form-fields";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  category: text("category"),
  isUpcoming: boolean("is_upcoming").default(false),
  registrationUrl: text("registration_url"),
  description: text("description"),
  thumbnail: text("thumbnail"),
  content: text("content").notNull(), // The Markdown content
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  date: text("date").notNull(),
  author: text("author"),
  authorRole: text("author_role"),
  category: text("category"),
  readTime: text("read_time"),
  thumbnail: text("thumbnail"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  year: text("year").notNull(),
  section: text("section").notNull(), // officers | seniorExecs | committee
  committeeTitle: text("committee_title"),
  name: text("name").notNull(),
  role: text("role").notNull(),
  imageUrl: text("image_url"),
  linkedin: text("linkedin"),
  github: text("github"),
  instagram: text("instagram"),
  imagePosition: text("image_position"),
  imageScale: doublePrecision("image_scale"),
  imageOffset: integer("image_offset"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  fields: jsonb("fields").$type<FormField[]>().notNull().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  formId: text("form_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  formData: jsonb("form_data"), // Store dynamic fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
