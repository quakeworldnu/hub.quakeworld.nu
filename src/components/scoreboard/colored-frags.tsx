import { type ElementType, memo } from "react";

type ColoredFragsProps = {
  tag?: string;
  frags?: number | string;
  colors?: number[];
};

export const ColoredFrags = memo((props: ColoredFragsProps) => {
  const { tag = "div", frags = "", colors = [0, 0] } = props;
  const TagName = `${tag}` as ElementType;
  const colors_ = colors.map(fixColor);

  return (
    <TagName
      className={`w-full h-full font-bold text-center qw-bgcolor qw-bgcolor-top-${colors_[0]} qw-bgcolor-bottom-${colors_[1]}`}
    >
      <span className="sc-frags">{frags}</span>
    </TagName>
  );
});

export function fixColor(color: number): number {
  if (color < 0 || color > 16) {
    return 0;
  }
  return color;
}
