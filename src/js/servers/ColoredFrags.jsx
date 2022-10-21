import React from "react";
import { TextPulse } from "../TextAnimations.jsx";

export const ColoredFrags = React.memo((props) => {
  const { tag = "div", frags, colors } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      className={`font-bold py-[1px] text-center qw-bgcolor-${colors[0]}-${colors[1]}`}
    >
      <TextPulse key="frags" value={frags} />
    </TagName>
  );
});
