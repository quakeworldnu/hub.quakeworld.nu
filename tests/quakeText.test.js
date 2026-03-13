import { describe, expect, test } from "vitest";
import { quakeNameFromUnicodeToHtml } from "../src/QuakeText";

describe("quakeNameFromUnicodeToHtml", () => {
  test("plain ascii name renders without color spans", () => {
    expect(quakeNameFromUnicodeToHtml("Player")).toBe("Player");
  });

  test("empty string returns empty string", () => {
    expect(quakeNameFromUnicodeToHtml("")).toBe("");
  });

  test("null/undefined returns empty string", () => {
    expect(quakeNameFromUnicodeToHtml(null)).toBe("");
    expect(quakeNameFromUnicodeToHtml(undefined)).toBe("");
  });

  test("characters >= 160 are wrapped in qw-color-b span", () => {
    // char code 193 = 65 (A) + 128, so colored 'A'
    const coloredA = String.fromCharCode(193);
    expect(quakeNameFromUnicodeToHtml(coloredA)).toBe(
      '<span class="qw-color-b">A</span>',
    );
  });

  test("mixed plain and colored chars produce correct html", () => {
    // 'H' (72) normal, then colored 'i' (105 + 128 = 233)
    const name = "H" + String.fromCharCode(233);
    expect(quakeNameFromUnicodeToHtml(name)).toBe(
      'H<span class="qw-color-b">i</span>',
    );
  });

  test("maxLength limits output characters", () => {
    // 4-char colored team name truncated to 2
    const name = String.fromCharCode(193, 194, 195, 196); // colored A,B,C,D
    const result = quakeNameFromUnicodeToHtml(name, 2);
    expect(result).toBe('<span class="qw-color-b">AB</span>');
  });

  test("special chars are html-escaped", () => {
    expect(quakeNameFromUnicodeToHtml("<b>")).toBe("&lt;b&gt;");
    expect(quakeNameFromUnicodeToHtml('"quoted"')).toBe("&quot;quoted&quot;");
  });

  test("control chars below 16 render as underscore", () => {
    // char code 1 (control char)
    expect(quakeNameFromUnicodeToHtml(String.fromCharCode(1))).toBe("_");
  });

  test("special bracket chars (16/17) render in qw-color-g", () => {
    const brackets = String.fromCharCode(16, 17);
    expect(quakeNameFromUnicodeToHtml(brackets)).toBe(
      '<span class="qw-color-g">[]</span>',
    );
  });
});
