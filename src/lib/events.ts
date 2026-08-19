import fs from "fs";
import path from "path";
import { parseMarkdownFile } from "./markdown";

const eventsDirectory = path.join(process.cwd(), "src/content/events");

export interface EventItem {
  slug: string;
  title: string;
  dates: string[];
  date: string;
  location: string;
  category: string;
  isUpcoming: boolean;
  registrationUrl: string;
  description: string;
  thumbnail: string;
  content: string;
}

export function getEventSlugs(): string[] {
  if (!fs.existsSync(eventsDirectory)) return [];
  return fs
    .readdirSync(eventsDirectory)
    .filter((file: string) => file.endsWith(".md"))
    .map((file: string) => file.replace(/\.md$/, ""));
}

export function getEventBySlug(slug: string): EventItem | null {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(eventsDirectory, `${realSlug}.md`);

  if (!fs.existsSync(fullPath)) return null;

  const { data, content } = parseMarkdownFile(fullPath);

  let dates: string[] = [];
  if (Array.isArray(data.dates)) {
    dates = data.dates.map(String);
  } else if (data.date) {
    dates = [String(data.date)];
  }

  return {
    slug: realSlug,
    title: typeof data.title === "string" ? data.title : realSlug,
    dates,
    date: typeof data.date === "string" ? data.date : dates.length > 0 ? dates[0] : "",
    location: typeof data.location === "string" ? data.location : "",
    category: typeof data.category === "string" ? data.category : "Event",
    isUpcoming: Boolean(data.isUpcoming),
    registrationUrl: typeof data.registrationUrl === "string" ? data.registrationUrl : "",
    description: typeof data.description === "string" ? data.description : "",
    thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : "",
    content,
  };
}

function eventTime(dateStr: unknown): number {
  if (!dateStr || typeof dateStr !== "string") return Infinity;
  const t = new Date(dateStr).getTime();
  return Number.isNaN(t) ? Infinity : t;
}

export function getAllEvents(): EventItem[] {
  const slugs = getEventSlugs();
  const events = slugs
    .map((slug) => getEventBySlug(slug))
    .filter((e): e is EventItem => e !== null);

  return events.sort((event1, event2) => {
    const d1 = event1.dates.length > 0 ? event1.dates[0] : event1.date;
    const d2 = event2.dates.length > 0 ? event2.dates[0] : event2.date;
    const t1 = eventTime(d1);
    const t2 = eventTime(d2);
    if (t1 === t2) return 0;
    return t1 > t2 ? -1 : 1;
  });
}
