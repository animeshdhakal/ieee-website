import { createClient } from "@/utils/supabase/client";

export const EVENT_IMAGE_BUCKET = "event-images";
export const TEAM_IMAGE_BUCKET = "team-images";
export const FORM_UPLOAD_BUCKET = "form-uploads";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Uploads an image to a public Supabase Storage bucket and returns its public
 * URL. Runs in the browser using the signed-in admin's session. Defaults to the
 * `event-images` bucket; pass a bucket to target another (e.g. team photos).
 */
export async function uploadImage(
  file: File,
  bucket: string = EVENT_IMAGE_BUCKET
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large (max 5 MB).");
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    throw new Error(
      `Upload failed: ${error.message}. Ensure a public "${bucket}" bucket exists in Supabase.`
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
