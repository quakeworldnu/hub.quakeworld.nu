import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";
import { KtxstatsV3, toKtxstatsV3 } from "./KtxstatsV3.ts";

const CLOUDFRONT_URL = "https://d.quake.world";

export function useKtxstats(sha256: string): KtxstatsV3 | null | undefined {
  const [stats, setStats] = useState<KtxstatsV3 | null | undefined>(undefined);

  useEffectOnce(() => {
    async function init() {
      setStats(await getKtxstatsBySha256(sha256));
    }

    init();
  });

  return stats;
}

async function getKtxstatsBySha256(sha256: string): Promise<null | KtxstatsV3> {
  try {
    const res = await fetch(
      `${CLOUDFRONT_URL}/${sha256_to_s3_key(sha256)}.mvd.ktxstats.json`,
    );
    if (res.ok) {
      return toKtxstatsV3(await res.text());
    }
  } catch (e) {}
  return null;
}

function sha256_to_s3_key(sha256: string): string {
  return `${sha256.substring(0, 3)}/${sha256}`;
}
