import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description:
        "A visual journey through IEEE Pulchowk Student Branch events, workshops, and community gatherings.",
    openGraph: {
        title: "Gallery | IEEE Pulchowk Student Branch",
        description:
            "A visual journey through IEEE Pulchowk Student Branch events, workshops, and community gatherings.",
    },
};

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
