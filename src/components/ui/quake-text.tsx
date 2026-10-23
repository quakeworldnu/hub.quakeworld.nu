import React, { type ElementType } from "react";
import { parseQuakeText } from "@/lib/qworld/quake-text";
import type { QuakeString } from "@/lib/qworld/types";

type QuakeTextProps = {
  text: string; // html
  tag?: string;
  className?: string;
};

export const QuakeText = React.memo((props: QuakeTextProps) => {
  const { text, tag = "div", className } = props;
  const TagName = `${tag}` as ElementType;

  return (
    <TagName {...{ className }} dangerouslySetInnerHTML={{ __html: text }} />
  );
});

export const coloredQuakeName = (name: string, color: string): string =>
  color ? quakeTextToHtml(name, color) : name;

// api.quake.world QuakeString => html
export const quakeStringToHtml = (quakeString: QuakeString): string => {
  const { text, colors } = parseQuakeText(quakeString.unicode);
  return quakeTextToHtml(text, colors);
};

export const quakeTextToHtml = (text: string, color: string): string => {
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
