import Link from "next/link";
import { Plus, Pencil, FileEdit, Calendar, ExternalLink } from "lucide-react";
import { getAllPosts } from "@/lib/blogs";
import { DeleteBlogButton } from "@/components/admin/DeleteBlogButton";

export const metadata = {
  title: "Manage Blogs | Admin",
};

export default async function ManageBlogsPage() {
  const posts = await getAllPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
          <p className="text-gray-500 mt-1">
            Create, edit, and delete blog posts. {posts.length} total.
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center justify-center gap-2 bg-ieee-blue text-white font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> New Blog
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            No blogs yet.{" "}
            <Link href="/admin/blogs/new" className="text-ieee-blue font-bold hover:underline">
              Write your first post
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileEdit size={16} className="text-gray-400 shrink-0" />
                    <h3 className="font-bold text-gray-900 truncate">{post.title}</h3>
                    {post.category && (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-ieee-blue">
                        {post.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1 ml-6">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {post.date}
                    </span>
                    {post.author && <span>by {post.author}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/blogs/${post.slug}`}
                    target="_blank"
                    title="View public page"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                  </Link>
                  <Link
                    href={`/admin/blogs/${post.slug}/edit`}
                    title="Edit blog"
                    className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </Link>
                  <DeleteBlogButton slug={post.slug as string} title={post.title as string} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
