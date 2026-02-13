import fs from "fs";
import path from "path";
import matter from "gray-matter";

const eventsDirectory = path.join(process.cwd(), "content/events");

export function getEventSlugs() {
  return fs.readdirSync(eventsDirectory);
}

export function getEventBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(eventsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  type Items = {
    [key: string]: string | boolean;
  };

  const items: Items = {};

  // Ensure minimal required fields
  items["slug"] = realSlug;
  items["content"] = content;

  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = realSlug;
    }
    if (field === "content") {
      items[field] = content;
    }

    if (typeof data[field] !== "undefined") {
      items[field] = data[field];
    }
  });

  return items;
}

export function getAllEvents(fields: string[] = []) {
  const slugs = getEventSlugs();
  const events = slugs
    .map((slug) => getEventBySlug(slug, fields))
    // sort events by date in descending order
    .sort((event1, event2) => (event1.date > event2.date ? -1 : 1));
  return events;
}
