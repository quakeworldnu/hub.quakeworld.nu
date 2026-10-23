import { memo } from "react";
import { QUAKE_CHARS, QUAKE_COLORS } from "@/lib/qworld/quake-text";

export const QuakeTextFromByteString = ({ name }: { name: string }) => {
  const bytes = Uint8Array.from(
    name.split("").map((_, index) => name.charCodeAt(index)),
  );
  return <QuakeTextFromBytes name={bytes} />;
};

export const QuakeTextFromBytes = memo(
  QuakeTextFromBytes_,
  (prevProps, nextProps) => isEqualUint8Array(prevProps.name, nextProps.name),
);

function QuakeTextFromBytes_({ name }: { name: Uint8Array }) {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: quakeBytesToHtml(name),
      }}
    />
  );
}

function isEqualUint8Array(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

// html escaped QUAKE_CHARS
const QUAKE_HTML_CHARS = QUAKE_CHARS.map((char) => HTML_ENTITIES[char] ?? char);

// same charset and colors as the server scoreboards (parseQuakeText)
export function quakeBytesToHtml(bytes: Uint8Array): string {
  let html = "";
  let color = "";

  for (let i = 0; i < bytes.length; ++i) {
    const byte = bytes[i];
    const char = QUAKE_HTML_CHARS[byte];

    if (char === "") {
      continue;
    }

    if (QUAKE_COLORS[byte] !== color) {
      if (color !== "") {
        html += "</span>";
      }
      color = QUAKE_COLORS[byte];
      html += `<span class="qw-color-${color}">`;
    }

    html += char;
  }

  return color !== "" ? `${html}</span>` : "";
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

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
    test("every quake char renders the same", async () => {
      const { quakeStringToHtml } = await import("./quake-text");

      for (let byte = 0; byte < 256; ++byte) {
        if ((byte & 0x7f) === "&".charCodeAt(0)) {
          continue; // not escaped by quakeTextToHtml
        }

        const text = `a${String.fromCharCode(byte)}b`;
        expect(quakeBytesToHtml(bytes(text)), `byte ${byte}`).toBe(
          quakeStringToHtml({ ascii: "", unicode: text }),
        );
      }
    });
  });
}
