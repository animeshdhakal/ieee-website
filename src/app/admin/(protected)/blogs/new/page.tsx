import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";
import { createBlog } from "@/actions/blogs";

export const metadata = {
  title: "New Blog | Admin",
};

export default function NewBlogPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/blogs"
          className="text-sm font-medium text-gray-500 hover:text-ieee-blue flex items-center mb-2"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Blogs
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">New Blog</h1>
      </div>

      <BlogForm action={createBlog} mode="create" />
    </div>
  );
}
