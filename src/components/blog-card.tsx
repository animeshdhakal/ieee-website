import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, User } from "lucide-react";
import { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  if (featured) {
    return (
      <div className="group relative grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
        <div className="h-64 md:h-full bg-gray-100 relative overflow-hidden">
          {post.imageUrl ? (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ieee-blue to-ieee-dark flex items-center justify-center">
              <span className="text-white/20 text-6xl font-bold">Blog</span>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-ieee-blue uppercase tracking-wide">
            {post.category}
          </div>
        </div>

        <div className="p-8 flex flex-col justify-center">
          <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
            <span className="flex items-center">
              <User size={14} className="mr-1.5" /> {post.author}
            </span>
            <span className="flex items-center">
              <Clock size={14} className="mr-1.5" /> {post.readTime}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-ieee-blue transition-colors">
            <Link href={`/blogs/${post.id}`}>{post.title}</Link>
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div>
            <Link
              href={`/blogs/${post.id}`}
              className="inline-flex items-center text-ieee-blue font-semibold hover:text-ieee-dark transition-colors"
            >
              Read Article{" "}
              <ArrowRight
                size={18}
                className="ml-2 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-ieee-blue uppercase tracking-wide">
          {post.category}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-ieee-blue transition-colors">
          <Link href={`/blogs/${post.id}`}>{post.title}</Link>
        </h3>

        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>

        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            By {post.author}
          </span>
          <Link
            href={`/blogs/${post.id}`}
            className="text-sm font-semibold text-ieee-blue flex items-center hover:underline"
          >
            Read <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
