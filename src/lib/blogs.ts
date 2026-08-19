import fs from "fs";
import path from "path";
import { parseMarkdownFile } from "./markdown";

const postsDirectory = path.join(process.cwd(), "src/content/blogs");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  thumbnail: string;
  content: string;
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file: string) => file.endsWith(".md"))
    .map((file: string) => file.replace(/\.md$/, ""));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const { data, content } = parseMarkdownFile(fullPath);

  return {
    slug: realSlug,
    title: typeof data.title === "string" ? data.title : realSlug,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    date: typeof data.date === "string" ? data.date : "",
    author: typeof data.author === "string" ? data.author : "IEEE Pulchowk",
    authorRole: typeof data.authorRole === "string" ? data.authorRole : "",
    category: typeof data.category === "string" ? data.category : "General",
    readTime: typeof data.readTime === "string" ? data.readTime : "3 min read",
    thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : "",
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is BlogPost => p !== null);

  return posts.sort((post1, post2) => {
    const date1 = new Date(post1.date).getTime();
    const date2 = new Date(post2.date).getTime();
    return date1 > date2 ? -1 : 1;
  });
}
