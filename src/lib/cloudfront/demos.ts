import { env } from "@/config/env";
import { DemoInfo } from "./types";

export const DEMOS_BASE_URL: string = env.demosCloudfrontUrl;

export async function getInfo(sha256: string): Promise<DemoInfo | null> {
  const url = `${getBaseUrl(sha256)}.mvd.info.json`;

  try {
    const response = await fetch(url);
    return (await response.json()) as DemoInfo;
  } catch {}

  return null;
}

export function getDownloadUrl(sha256: string): string {
  return `${getBaseUrl(sha256)}.mvd.gz`;
}

function getBaseUrl(sha256: string): string {
  return `${DEMOS_BASE_URL}/${sha256.substring(0, 3)}/${sha256}`;
}
