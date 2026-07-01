/**
 * One-off migration: uploads the remaining local content images
 * (public/gallery, public/events, public/blogs) into the public
 * `event-images` Supabase bucket — the same bucket the admin forms upload new
 * gallery images, event thumbnails, and blog thumbnails to — and rewrites each
 * row's image column to the bucket's public URL.
 *
 * Requires a Supabase SERVICE key (bypasses Storage RLS). Add one to
 * .env.local, then run:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx bun run scripts/migrate-content-images.ts
 *
 * Safe to re-run: uploads use upsert and only local (non-http) paths are touched.
 */
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

dotenv.config({ path: ".env.local" });

const BUCKET = "event-images";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!SERVICE_KEY) {
  console.error(
    "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY). " +
      "Grab the service_role / secret key from Supabase → Project Settings → API."
  );
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, SERVICE_KEY);

// Each table's image-bearing column that may still hold a local /public path.
const TARGETS = [
  { table: "gallery_items", column: "image_url" },
  { table: "events", column: "thumbnail" },
  { table: "blogs", column: "thumbnail" },
] as const;

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

async function main() {
  // Ensure the bucket exists and is public (no-op if already created).
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});

  let uploaded = 0;
  let skipped = 0;
  let missing = 0;

  for (const { table, column } of TARGETS) {
    const rows = await sql.unsafe<{ id: number; url: string | null }[]>(
      `SELECT id, ${column} AS url FROM ${table} ORDER BY id`
    );

    for (const row of rows) {
      const url = row.url;
      if (!url || url.startsWith("http")) {
        skipped += 1;
        continue;
      }

      const objectPath = url.replace(/^\//, ""); // e.g. gallery/foo.webp
      const localPath = path.join(process.cwd(), "public", objectPath);
      if (!existsSync(localPath)) {
        console.warn(`  ! missing file for ${table} #${row.id}: ${url}`);
        missing += 1;
        continue;
      }

      const ext = path.extname(localPath).toLowerCase();
      const bytes = await readFile(localPath);

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, bytes, {
          contentType: CONTENT_TYPES[ext] ?? "application/octet-stream",
          upsert: true,
        });
      if (error) {
        console.error(`  x upload failed for ${objectPath}: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
      await sql.unsafe(`UPDATE ${table} SET ${column} = $1 WHERE id = $2`, [
        data.publicUrl,
        row.id,
      ]);
      uploaded += 1;
      console.log(`  ✓ ${table} #${row.id} → ${objectPath}`);
    }
  }

  console.log(
    `\nDone. Uploaded ${uploaded}, skipped ${skipped} (already remote / no image), missing ${missing}.`
  );
  await sql.end();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
