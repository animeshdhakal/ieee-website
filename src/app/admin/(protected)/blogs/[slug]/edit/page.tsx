import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { BlogForm } from "@/components/admin/BlogForm";
import { updateBlog } from "@/actions/blogs";
import { getPostBySlug } from "@/lib/blogs";

export const metadata = {
  title: "Edit Blog | Admin",
};

/** Convert a stored display date ("June 6, 2026") to a yyyy-MM-dd input value. */
function toDateInput(value: unknown): string {
  if (typeof value !== "string") return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return format(parsed, "yyyy-MM-dd");
}

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/blogs"
          className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Blog</h1>
      </div>

      <BlogForm
        action={updateBlog}
        mode="edit"
        defaults={{
          slug: post.slug,
          title: post.title,
          date: toDateInput(post.date),
          excerpt: post.excerpt,
          author: post.author,
          authorRole: post.authorRole,
          category: post.category,
          readTime: post.readTime,
          thumbnail: post.thumbnail,
          content: post.content,
        }}
      />
    </div>
  );
}
