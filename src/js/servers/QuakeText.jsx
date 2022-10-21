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

export const quakeTextToHtml = (text, color) => {
  let result = "";
  let lastColor = "";

  for (let i = 0; i < text.length; ++i) {
    let charColor = color[i];

    if (charColor !== lastColor) {
      if (i > 0) {
        result += "</span>";
      }

      result += `<span class="qw-color-${charColor}">`;
    }

    let charValue = text[i];

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
