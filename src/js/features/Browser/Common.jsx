import React from "react";
import { quakeTextToHtml } from "../../common/text";

export const QuakeText = (props) => {
  const { text, tag, className } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      {...{ className }}
      dangerouslySetInnerHTML={{ __html: quakeTextToHtml(text) }}
    />
  );
};

export const ColoredFrags = (props) => {
  const { tag, frags, colors } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      className={`sc-frags server-frags qw-bgcolor-${colors[0]}-${colors[1]}`}
    >
      {frags}
    </TagName>
  );
};
