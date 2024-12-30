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
        __html: quakeNameToColoredHtml(name),
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

function quakeNameToColoredHtml(
  input: Uint8Array,
  maxLength = 999,
  keepNewLines = false,
) {
  let str = "";
  let type = "normal";

  const changeType = (newType: string) => {
    if (type !== newType) {
      if (type !== "normal") {
        str += "</span>";
      }
      if (newType !== "normal") {
        str += `<span class="qw-color-${newType.toLowerCase()}">`;
      }
      type = newType;
    }
  };

  for (let i = 0; i < input.length; ++i) {
    if (maxLength >= 0 && i >= maxLength) {
      break;
    }

    let ch = input[i];
    if (ch >= 128) {
      ch = ch - 128;
    }

    if (keepNewLines && (ch === 10 || ch === 13)) {
      str += String.fromCharCode(ch);
    } else if (ch < 16 || (ch >= 29 && ch <= 31)) {
      changeType("normal");
      str += "_";
    } else if (ch === 16) {
      changeType("g");
      str += "[";
    } else if (ch === 17) {
      changeType("g");
      str += "]";
    } else if (ch >= 18 && ch <= 27) {
      const num = ch - 18 + 48;
      changeType("g");
      str += String.fromCharCode(num);
    } else if (ch === 28) {
      changeType("normal");
      str += "&#8226;";
    } else {
      if (input[i] >= 128 + 32) {
        changeType("b");
      } else {
        changeType("normal");
      }

      if (ch === "<".charCodeAt(0)) {
        str += "&lt;";
      } else if (ch === ">".charCodeAt(0)) {
        str += "&gt;";
      } else if (ch === '"'.charCodeAt(0)) {
        str += "&quot;";
      } else {
        str += String.fromCharCode(ch);
      }
    }
  }
  changeType("normal");

  return str;
}
