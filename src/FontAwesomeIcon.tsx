import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

// Drop-in replacement for @fortawesome/react-fontawesome (supports the props used in this project).
// Renders the same markup without bundling the fontawesome-svg-core runtime.
// Styles: @fortawesome/fontawesome-svg-core/styles.css (imported in styles/index.css)
type FontAwesomeIconProps = {
  icon: IconDefinition;
  className?: string;
  fixedWidth?: boolean;
  size?: SizeProp;
};

export const FontAwesomeIcon = ({
  icon,
  className = "",
  fixedWidth = false,
  size,
}: FontAwesomeIconProps) => {
  const [width, height, , , path] = icon.icon;
  const classes = ["svg-inline--fa", `fa-${icon.iconName}`];

  if (fixedWidth) {
    classes.push("fa-fw");
  }

  if (size) {
    classes.push(`fa-${size}`);
  }

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix={icon.prefix}
      data-icon={icon.iconName}
      className={[...classes, ...className.split(" ")].join(" ")}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* free-solid icons have a single path (only duotone icons have several) */}
      <path fill="currentColor" d={path as string} />
    </svg>
  );
};
