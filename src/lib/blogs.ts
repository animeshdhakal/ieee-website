import { db } from "@/db";
import { blogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getPostSlugs() {
  const result = await db.select({ slug: blogs.slug }).from(blogs);
  return result.map(row => row.slug);
}

export async function getPostBySlug(slug: string, fields: string[] = []) {
  const [post] = await db.select().from(blogs).where(eq(blogs.slug, slug));
  
  if (!post) return null;

  type Items = Record<string, any>;
  const items: Items = {};

  if (fields.length === 0) {
    return post;
  }

  items["slug"] = post.slug;
  items["content"] = post.content;

  fields.forEach((field) => {
    if (field in post) {
      items[field] = post[field as keyof typeof post];
    }
  });

  return items;
}

export async function getAllPosts(fields: string[] = []) {
  const allPosts = await db.select().from(blogs);
  
  const sortedPosts = allPosts.sort((post1, post2) => {
    const date1 = new Date(post1.date).getTime();
    const date2 = new Date(post2.date).getTime();
    return date1 > date2 ? -1 : 1;
  });

  return sortedPosts.map(post => {
    const items: Record<string, any> = {};
    if (fields.length === 0) return post;
    
    fields.forEach((field) => {
      if (field in post) {
        items[field] = post[field as keyof typeof post];
      }
    });
    items["slug"] = post.slug;
    return items;
  });
}
