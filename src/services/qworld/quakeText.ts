// quake text: each unicode codepoint is the original quake charset byte

// biome-ignore format: charset table
const topRows = [
  "•", "", "", "", "", "•", "", "", "", "", "", "", "", "", "•", "•",
  "[", "]", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "•", "", "", "",
];

const goldBytes = [
  16,
  16 + 128,
  17,
  17 + 128,
  5 + 128,
  14 + 128,
  15 + 128,
  28 + 128,
];

const toPlainChar = (byte: number): string => {
  const plainByte = byte & 0x7f;

  if (plainByte === 127) {
    return "";
  }

  return plainByte < topRows.length
    ? topRows[plainByte]
    : String.fromCharCode(plainByte);
};

const toColorCode = (byte: number): string => {
  if (byte >= 160) {
    return "b";
  }

  if (goldBytes.includes(byte)) {
    return "g";
  }

  const plainByte = byte & 0x7f;
  return plainByte >= 18 && plainByte <= 27 ? "b" : "w";
};

// lookup tables, indexed by quake charset byte
export const QUAKE_CHARS: readonly string[] = Array.from(
  { length: 256 },
  (_, byte) => toPlainChar(byte),
);

export const QUAKE_COLORS: readonly string[] = Array.from(
  { length: 256 },
  (_, byte) => toColorCode(byte),
);

// returns plain text and color codes, one color code per plain char
export const parseQuakeText = (
  unicode = "",
): { text: string; colors: string } => {
  let text = "";
  let colors = "";

  for (const char of unicode) {
    const byte = (char.codePointAt(0) ?? 0) & 0xff;
    const plainChar = QUAKE_CHARS[byte];

    if (plainChar !== "") {
      text += plainChar;
      colors += QUAKE_COLORS[byte];
    }
  }

  return { text, colors };
};

export const toPlainText = (quakeString?: { unicode: string }): string =>
  parseQuakeText(quakeString?.unicode).text;
