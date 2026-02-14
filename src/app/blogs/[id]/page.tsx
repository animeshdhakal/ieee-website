import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, User, Share2 } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/blogs";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const post = getPostBySlug(id, ["title", "excerpt", "thumbnail"]);

    return {
        title: post.title as string,
        description: post.excerpt as string,
        openGraph: {
            title: post.title as string,
            description: post.excerpt as string,
            type: "article",
            ...(post.thumbnail && {
                images: [{ url: post.thumbnail as string }],
            }),
        },
    };
}

export async function generateStaticParams() {
    const posts = getAllPosts(["slug"]);
    return posts.map((post) => ({
        id: post.slug,
    }));
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const postData = getPostBySlug(id, [
        "title",
        "date",
        "slug",
        "author",
        "authorRole",
        "content",
        "imageUrl",
        "category",
        "readTime",
    ]);

    if (!postData.slug) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Article Not Found
                    </h2>
                    <Link
                        href="/blogs"
                        className="text-ieee-blue hover:underline"
                    >
                        Return to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    // Fetch related posts for sidebar/bottom
    const allPosts = getAllPosts(["slug", "title", "category", "excerpt"]);
    const relatedPosts = allPosts.filter((p) => p.slug !== id).slice(0, 2);

    return (
        <article className="pt-24 pb-20 min-h-screen bg-white">
            {/* Hero / Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-10">
                <Link
                    href="/blogs"
                    className="inline-flex items-center text-gray-500 hover:text-ieee-blue transition-colors mb-8 group"
                >
                    <ArrowLeft
                        size={16}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />{" "}
                    Back to Articles
                </Link>

                <div className="flex items-center space-x-2 mb-6">
                    <span className="bg-blue-50 text-ieee-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {postData.category}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm flex items-center">
                        <Clock size={14} className="mr-1" /> {postData.readTime}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                    {postData.title}
                </h1>

                <div className="flex items-center justify-between border-b border-gray-100 pb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                {postData.author}
                            </p>
                            <p className="text-xs text-gray-500">
                                {postData.authorRole || "Contributor"} •{" "}
                                {postData.date}
                            </p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-ieee-blue transition-colors p-2 rounded-full hover:bg-blue-50">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {postData.imageUrl && (
                    <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={postData.imageUrl}
                            alt={postData.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                    <ReactMarkdown>{postData.content}</ReactMarkdown>
                </div>

                <div className="mt-16 pt-10 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        More from IEEE PSB
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedPosts.map((related) => (
                            <Link
                                key={related.slug}
                                href={`/blogs/${related.slug}`}
                                className="group block bg-gray-50 p-6 rounded-xl hover:bg-blue-50 transition-colors"
                            >
                                <span className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                                    {related.category}
                                </span>
                                <h4 className="font-bold text-gray-900 group-hover:text-ieee-blue transition-colors mb-2">
                                    {related.title}
                                </h4>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {related.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}
