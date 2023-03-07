import React from "react";

export const ColoredFrags = React.memo((props) => {
  const { tag = "div", frags, colors } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      className={`font-bold text-center qw-bgcolor-${colors[0]}-${colors[1]}`}
    >
      {frags}
    </TagName>
  );
});
