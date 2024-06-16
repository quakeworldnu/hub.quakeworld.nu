import { memo } from "react";

export const ColoredFrags = memo((props) => {
  const { tag = "div", frags = "", colors = [0, 0] } = props;
  const TagName = `${tag}`;
  const colors_ = colors.map(fixColor);

  return (
    <TagName
      className={`w-full h-full font-bold text-center qw-bgcolor-${colors_[0]}-${colors_[1]}`}
    >
      <span className="sc-frags">{frags}</span>
    </TagName>
  );
});

export function fixColor(color) {
  if (color < 0 || color > 13) {
    return 0;
  }
  return color;
}
