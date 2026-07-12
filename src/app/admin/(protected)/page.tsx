import React from "react";
import Link from "next/link";
import { CleanupButton } from "@/components/admin/CleanupButton";
import {
  Calendar,
  ClipboardList,
  Newspaper,
  Image as ImageIcon,
  Users,
  ArrowRight,
} from "lucide-react";

interface AdminSection {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
}

const ADMIN_SECTIONS: AdminSection[] = [
  {
    href: "/admin/events",
    title: "Events",
    description: "Create, edit, and publish workshops, seminars, and hackathons.",
    icon: Calendar,
  },
  {
    href: "/admin/forms",
    title: "Forms",
    description: "Build registration forms and review their submissions.",
    icon: ClipboardList,
  },
  {
    href: "/admin/blogs",
    title: "Blogs",
    description: "Write and manage blog posts and announcements.",
    icon: Newspaper,
  },
  {
    href: "/admin/gallery",
    title: "Gallery",
    description: "Upload and organize photos from past events.",
    icon: ImageIcon,
  },
  {
    href: "/admin/team",
    title: "Team",
    description: "Manage committee members, officers, and their profiles.",
    icon: Users,
  },
];

export default function AdminHomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage everything on the IEEE Pulchowk Student Branch site.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ADMIN_SECTIONS.map(({ href, title, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:border-ieee-blue/40 hover:shadow-md transition-all"
          >
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-ieee-blue mb-4 group-hover:bg-ieee-blue group-hover:text-white transition-colors">
              <Icon size={22} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              {description}
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-ieee-blue">
              Manage
              <ArrowRight
                size={16}
                className="ml-1 group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>
        ))}
        <CleanupButton />
      </div>
    </div>
  );
}
