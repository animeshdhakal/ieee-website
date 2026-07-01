/**
 * One-off migration: uploads the existing local team photos (public/committee/…)
 * into the public `team-images` Supabase bucket and rewrites each
 * team_members.image_url to the bucket's public URL.
 *
 * Requires a Supabase SERVICE key (bypasses Storage RLS) because the anon /
 * publishable key cannot write to storage. Add one to .env.local, then run:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxx bun run scripts/migrate-team-images.ts
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

const BUCKET = "team-images";
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

  const rows = await sql<{ id: number; image_url: string | null }[]>`
    SELECT id, image_url FROM team_members ORDER BY id
  `;

  let uploaded = 0;
  let skipped = 0;
  let missing = 0;

  for (const row of rows) {
    const url = row.image_url;
    if (!url || url.startsWith("http")) {
      skipped += 1;
      continue;
    }

    const localPath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
    if (!existsSync(localPath)) {
      console.warn(`  ! missing file for member ${row.id}: ${url}`);
      missing += 1;
      continue;
    }

    const objectPath = url.replace(/^\//, "");
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
    await sql`UPDATE team_members SET image_url = ${data.publicUrl} WHERE id = ${row.id}`;
    uploaded += 1;
    console.log(`  ✓ ${objectPath}`);
  }

  console.log(
    `\nDone. Uploaded ${uploaded}, skipped ${skipped} (already remote / no photo), missing ${missing}.`
  );
  await sql.end();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
