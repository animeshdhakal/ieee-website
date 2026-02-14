import React from "react";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blogs";
import BlogList from "@/components/blog-list";
import { BlogPost } from "@/types";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Articles, research highlights, and stories from the IEEE Pulchowk Student Branch community.",
    openGraph: {
        title: "Blog | IEEE Pulchowk Student Branch",
        description:
            "Articles, research highlights, and stories from the IEEE Pulchowk Student Branch community.",
    },
};

export default function BlogsPage() {
    const posts = getAllPosts([
        "slug",
        "title",
        "excerpt",
        "date",
        "category",
        "thumbnail",
        "readTime",
        "author",
        "authorRole",
    ]);

    const formattedPosts: BlogPost[] = posts.map((post) => ({
        id: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        category: post.category,
        imageUrl: post.thumbnail,
        readTime: post.readTime,
        author: post.author,
        authorRole: post.authorRole,
        content: "", // Content not needed for listing
    }));

    return <BlogList posts={formattedPosts} />;
}
