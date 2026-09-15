import { supabase } from "@/lib/auth";

/* Profile photo upload: the picked image is cropped to a centred square, shrunk to 512px and
 * saved as JPEG in the person's own folder of the public ikan2-avatars bucket. */

const SIZE = 512;
const MAX_INPUT = 15 * 1024 * 1024;

async function squareJpeg(file: File): Promise<Blob> {
  if (!/^image\//.test(file.type)) throw new Error("Choose a photo (JPG, PNG or WebP).");
  if (file.size > MAX_INPUT) throw new Error("That photo is too large. Choose one under 15 MB.");
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("That photo couldn’t be opened. Try another one.");
  });
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    bitmap,
    (bitmap.width - side) / 2,
    (bitmap.height - side) / 2,
    side,
    side,
    0,
    0,
    SIZE,
    SIZE,
  );
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("That photo couldn’t be saved."))),
      "image/jpeg",
      0.88,
    ),
  );
}

/** Uploads the photo and returns its public link. */
export async function uploadAvatar(file: File) {
  const { data } = await supabase().auth.getSession();
  const uid = data.session?.user.id;
  if (!uid) throw new Error("Sign in again to change your photo.");
  const blob = await squareJpeg(file);
  const path = `${uid}/avatar-${Date.now()}.jpg`;
  const { error } = await supabase()
    .storage.from("ikan2-avatars")
    .upload(path, blob, { contentType: "image/jpeg", upsert: true });
  if (error) throw new Error("Your photo didn’t upload. Check your connection and try again.");
  return supabase().storage.from("ikan2-avatars").getPublicUrl(path).data.publicUrl;
}

/** The photo from Google or LinkedIn sign-in, if there is one. */
export async function providerPhoto() {
  const { data } = await supabase().auth.getSession();
  const u = data.session?.user;
  const fromMeta =
    (u?.user_metadata?.["avatar_url"] as string | undefined) ||
    (u?.user_metadata?.["picture"] as string | undefined);
  if (fromMeta) return fromMeta;
  for (const i of u?.identities ?? []) {
    const pic = (i.identity_data?.["avatar_url"] ?? i.identity_data?.["picture"]) as
      string | undefined;
    if (pic) return pic;
  }
  return undefined;
}
