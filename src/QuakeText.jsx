import React from "react";

export const QuakeText = React.memo((props) => {
  const { text, tag = "div", className } = props;
  const TagName = `${tag}`;

  return (
    <TagName {...{ className }} dangerouslySetInnerHTML={{ __html: text }} />
  );
});

export const coloredQuakeName = (name, color) =>
  color ? quakeTextToHtml(name, color) : name;

export const quakeNameFromUnicodeToHtml = (name, maxLength = 999) => {
  if (!name) return "";

  let str = "";
  let type = "normal";

  const changeType = (newType) => {
    if (type !== newType) {
      if (type !== "normal") {
        str += "</span>";
      }
      if (newType !== "normal") {
        str += `<span class="qw-color-${newType}">`;
      }
      type = newType;
    }
  };

  const len = Math.min(name.length, maxLength);

  for (let i = 0; i < len; ++i) {
    const originalByte = name.charCodeAt(i);
    let ch = originalByte;
    if (ch >= 128) {
      ch = ch - 128;
    }

    if (ch < 16 || (ch >= 29 && ch <= 31)) {
      changeType("normal");
      str += "_";
    } else if (ch === 16) {
      changeType("g");
      str += "[";
    } else if (ch === 17) {
      changeType("g");
      str += "]";
    } else if (ch >= 18 && ch <= 27) {
      changeType("g");
      str += String.fromCharCode(ch - 18 + 48);
    } else if (ch === 28) {
      changeType("normal");
      str += "&#8226;";
    } else {
      if (originalByte >= 160) {
        changeType("b");
      } else {
        changeType("normal");
      }

      if (ch === 60) {
        str += "&lt;";
      } else if (ch === 62) {
        str += "&gt;";
      } else if (ch === 34) {
        str += "&quot;";
      } else {
        str += String.fromCharCode(ch);
      }
    }
  }
  changeType("normal");

  return str;
};

export const quakeTextToHtml = (text, color) => {
  let result = "";
  let lastColor = "";

  for (let i = 0; i < text.length; ++i) {
    const charColor = color[i];

    if (charColor !== lastColor) {
      if (i > 0) {
        result += "</span>";
      }

      result += `<span class="qw-color-${charColor}">`;
    }

    const charValue = text[i];

    if (charValue === "<") {
      result += "&lt;";
    } else if (charValue === ">") {
      result += "&gt;";
    } else if (charValue === '"') {
      result += "&quot;";
    } else {
      result += charValue;
    }

    lastColor = charColor;
  }

  result += "</span>";

  return result;
};
