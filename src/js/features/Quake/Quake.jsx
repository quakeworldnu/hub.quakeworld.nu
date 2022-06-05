import React from "react";
import { quakeTextToHtml } from "../../util/text";
import { TextPulse } from "../Animations/Text.jsx";

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

export const ColoredFrags = React.memo((props) => {
  const { tag, frags, colors } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      className={`sc-frags server-frags qw-bgcolor-${colors[0]}-${colors[1]}`}
    >
      <TextPulse key="frags" value={frags} />
    </TagName>
  );
});
