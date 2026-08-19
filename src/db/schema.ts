import { pgTable, serial, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import type { FormField } from "@/lib/form-fields";

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
