import {
  KtxstatsV3E,
  toKtxstatsV3Enhanced,
} from "@qwhub/pages/games/player/KtxstatsV3Enchanced.ts";
import { useState } from "react";
import { useEffectOnce } from "usehooks-ts";

const CLOUDFRONT_URL = "https://d.quake.world";

export function useKtxstats(sha256: string): KtxstatsV3E | null | undefined {
  const [stats, setStats] = useState<KtxstatsV3E | null | undefined>(undefined);

  useEffectOnce(() => {
    async function init() {
      setStats(await getKtxstatsBySha256(sha256));
    }

    init();
  });

  return stats;
}

async function getKtxstatsBySha256(
  sha256: string,
): Promise<null | KtxstatsV3E> {
  try {
    const res = await fetch(
      `${CLOUDFRONT_URL}/${sha256ToS3Key(sha256)}.mvd.ktxstats.json`,
    );
    if (res.ok) {
      return toKtxstatsV3Enhanced(await res.text());
    }
  } catch (e) {
    console.log("FAIL: getKtxstatsBySha256", e);
  }
  return null;
}

function sha256ToS3Key(sha256: string): string {
  return `${sha256.substring(0, 3)}/${sha256}`;
}
