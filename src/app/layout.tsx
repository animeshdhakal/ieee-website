import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://ieeepsb.org";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "IEEE Pulchowk Student Branch",
        template: "%s | IEEE Pulchowk Student Branch",
    },
    description:
        "Official website of IEEE Pulchowk Student Branch at IOE Pulchowk Campus — workshops, seminars, competitions, and a community advancing technology for humanity.",
    keywords: [
        "IEEE",
        "IEEE Pulchowk",
        "IEEE Student Branch",
        "Pulchowk Campus",
        "IOE",
        "engineering",
        "technology",
        "Nepal",
        "workshops",
        "seminars",
        "hackathons",
    ],
    authors: [{ name: "IEEE Pulchowk Student Branch" }],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: "IEEE Pulchowk Student Branch",
        title: "IEEE Pulchowk Student Branch",
        description:
            "Workshops, seminars, competitions, and a community advancing technology for humanity at IOE Pulchowk Campus.",
        images: [
            {
                url: "/logo-blue.svg",
                width: 512,
                height: 512,
                alt: "IEEE Pulchowk Student Branch Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "IEEE Pulchowk Student Branch",
        description:
            "Workshops, seminars, competitions, and a community advancing technology for humanity at IOE Pulchowk Campus.",
        images: ["/logo-blue.svg"],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "IEEE Pulchowk Student Branch",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-blue.svg`,
    description:
        "IEEE Student Branch at IOE Pulchowk Campus, Tribhuvan University, Nepal.",
    address: {
        "@type": "PostalAddress",
        addressLocality: "Lalitpur",
        addressRegion: "Bagmati",
        addressCountry: "NP",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
            </body>
        </html>
    );
}
