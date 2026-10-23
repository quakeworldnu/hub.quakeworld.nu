import { describe, expect, test } from "vitest";
import { quakeBytesToHtml } from "../src/pages/games/fte/player/QuakeText";
import { quakeStringToHtml } from "../src/QuakeText";

const bytes = (...values: (number | string)[]) =>
  Uint8Array.from(
    values.flatMap((v) =>
      typeof v === "string" ? [...v].map((c) => c.charCodeAt(0)) : [v],
    ),
  );

const high = (text: string) => [...text].map((c) => c.charCodeAt(0) + 128);

describe("quakeBytesToHtml", () => {
  test("empty", () => {
    expect(quakeBytesToHtml(bytes())).toBe("");
  });

  test("plain text", () => {
    expect(quakeBytesToHtml(bytes("ToT_Oddjob"))).toBe(
      '<span class="qw-color-w">ToT_Oddjob</span>',
    );
  });

  test("high bit text is brown", () => {
    expect(quakeBytesToHtml(bytes(...high("red"), "x"))).toBe(
      '<span class="qw-color-b">red</span><span class="qw-color-w">x</span>',
    );
  });

  test("dots", () => {
    expect(quakeBytesToHtml(bytes(5, "a", 14 + 128))).toBe(
      '<span class="qw-color-w">•a</span><span class="qw-color-g">•</span>',
    );
  });

  test("gold brackets and numbers", () => {
    expect(quakeBytesToHtml(bytes(16, 18, 27, 17))).toBe(
      '<span class="qw-color-g">[</span><span class="qw-color-b">09</span><span class="qw-color-g">]</span>',
    );
  });

  test("unprintable chars are dropped", () => {
    expect(quakeBytesToHtml(bytes(1, "a", 29, 30, 31, 127, 127 + 128))).toBe(
      '<span class="qw-color-w">a</span>',
    );
  });

  test("html is escaped", () => {
    expect(quakeBytesToHtml(bytes('<b>&"'))).toBe(
      '<span class="qw-color-w">&lt;b&gt;&amp;&quot;</span>',
    );
  });
});

describe("demo player overlay matches server scoreboards", () => {
  test("every quake char renders the same", () => {
    for (let byte = 0; byte < 256; ++byte) {
      if ((byte & 0x7f) === "&".charCodeAt(0)) {
        continue; // not escaped by quakeTextToHtml
      }

      const text = `a${String.fromCharCode(byte)}b`;
      expect(quakeBytesToHtml(bytes(text)), `byte ${byte}`).toBe(
        quakeStringToHtml({ unicode: text }),
      );
    }
  });
});
