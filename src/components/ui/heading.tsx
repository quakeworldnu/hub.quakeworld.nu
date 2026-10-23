import { SvgIcon } from "./svg-icon";

export function Heading({
  text = "",
  icon = "",
  iconSize = 24,
  color = "text-gray-400",
}: {
  text?: string;
  icon?: string;
  iconSize?: number;
  color?: string;
}) {
  return (
    <div className={`flex items-center font-bold mb-1 ${color}`}>
      {text && <SvgIcon filename={icon} size={iconSize} />} {text}
    </div>
  );
}
