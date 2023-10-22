import { Demo } from "./services/supabase/supabase.types.ts";

const BASE_URL: string = import.meta.env.VITE_AWS_S3_BUCKET_URL;

export function getDemoUrl(s3_key: string): string {
  return [BASE_URL, s3_key].join("/");
}

export function getDemoDescription(demo: Demo): string {
  return `${demo.mode}: ${demo.title} [${demo.map}]`;
}
