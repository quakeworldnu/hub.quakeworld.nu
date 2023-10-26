import { memo } from "react";

export const ColoredFrags = memo((props) => {
  const { tag = "div", frags = "", colors = [0, 0] } = props;
  const TagName = `${tag}`;

  return (
    <TagName
      className={`w-full h-full font-bold text-center qw-bgcolor-${colors[0]}-${colors[1]}`}
    >
      <span className="sc-frags">{frags}</span>
    </TagName>
  );
});
