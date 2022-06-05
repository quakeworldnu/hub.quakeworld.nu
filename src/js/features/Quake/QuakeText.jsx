import React from "react";
import { quakeTextToHtml } from "../../util/text";

export const QuakeText = React.memo((props) => {
  const { text, tag, color, className } = props;
  const TagName = `${tag}`;
  const textAsHtml = color ? quakeTextToHtml(text, color) : text;

  return (
    <TagName
      {...{ className }}
      dangerouslySetInnerHTML={{ __html: textAsHtml }}
    />
  );
});

