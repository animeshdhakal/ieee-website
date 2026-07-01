export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blogs";
import { getAllEvents } from "@/lib/events";

const SITE_URL = "https://ieeepsb.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await getAllPosts(["slug"]);
    const events = await getAllEvents(["slug"]);

    const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${SITE_URL}/blogs/${post.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const eventUrls: MetadataRoute.Sitemap = events.map((event) => ({
        url: `${SITE_URL}/events/${event.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    return [
        {
            url: SITE_URL,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/events`,
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/blogs`,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/team`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${SITE_URL}/gallery`,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        ...eventUrls,
        ...blogUrls,
    ];
}
