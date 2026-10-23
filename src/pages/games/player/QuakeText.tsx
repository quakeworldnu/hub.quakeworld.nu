import { QUAKE_CHARS, QUAKE_COLORS } from "@qwhub/services/qworld/quakeText.ts";
import { memo } from "react";

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
