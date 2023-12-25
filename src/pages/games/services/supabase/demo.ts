import { Demo, DemoParticipants } from "./supabase.types.ts";

const BASE_URL: string = import.meta.env.VITE_AWS_S3_BUCKET_URL;

export function getDemoDownloadUrl(s3_key: string): string {
  return [BASE_URL, s3_key].join("/");
}

export function getDemoTitle(demo: Demo): string {
  const participants = demo.participants as DemoParticipants;

  if (0 === participants.teams.length) {
    return demo.title;
  }

  return participants.teams.map((t) => t.name).join(" vs ");
}

export function getDemoDescription(demo: Demo): string {
  return `${demo.mode}: ${getDemoTitle(demo)} [${demo.map}]`;
}

export function compareDemoDates(a: string | null, b: string | null) {
  return new Date(a || 0).getTime() - new Date(b || 0).getTime();
}
