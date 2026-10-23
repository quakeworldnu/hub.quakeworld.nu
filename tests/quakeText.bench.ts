import { bench, describe } from "vitest";

import { quakeBytesToHtml } from "../src/pages/games/player/QuakeText";
import { parseQuakeText } from "../src/services/qworld/quakeText";

const ascii = (text: string) => [...text].map((c) => c.charCodeAt(0));
const high = (text: string) => ascii(text).map((c) => c + 128);

// typical player/team names, incl. high bit and special chars
const NAMES = [
  ascii("ToT_Oddjob"),
  ascii("blue"),
  [...ascii("Anza "), 14, ...high("fu"), 14],
  [16, ...ascii("sr"), 17, ...high("mm2")],
  [...high("namtsui"), 5, 18, 19, 20],
  ascii("a very long player name"),
];

const BYTES = NAMES.map((name) => Uint8Array.from(name));
const STRINGS = NAMES.map((name) => String.fromCharCode(...name));

describe("quake text", () => {
  bench("quakeBytesToHtml (demo player)", () => {
    for (const name of BYTES) {
      quakeBytesToHtml(name);
    }
  });

  bench("parseQuakeText (server browser)", () => {
    for (const name of STRINGS) {
      parseQuakeText(name);
    }
  });
});
