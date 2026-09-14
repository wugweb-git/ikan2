/* The iKAN backend: the "Ikan - App" Supabase project. Sign-in, saved app data, Google Health
 * and push reminders all live here. The publishable (anon) key is safe to ship in the app; row
 * level security keeps each account to its own rows. */

export const BACKEND_URL = "https://jpfvoevxegnknxoqmwye.supabase.co";
export const BACKEND_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZnZvZXZ4ZWdua254b3Ftd3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjIyNDIsImV4cCI6MjA3MzY5ODI0Mn0.VGYSE8LqBEggrQcUHJH9NcvursaoNfQK9K8-ESCo-rc";

/** Edge functions on the backend. */
export const functionUrl = (name: string) => `${BACKEND_URL}/functions/v1/${name}`;
