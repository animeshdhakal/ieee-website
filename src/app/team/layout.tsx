import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Team",
    description:
        "Meet the executive officers, senior executives, and committee members of IEEE Pulchowk Student Branch.",
    openGraph: {
        title: "Our Team | IEEE Pulchowk Student Branch",
        description:
            "Meet the executive officers, senior executives, and committee members of IEEE Pulchowk Student Branch.",
    },
};

export default function TeamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
