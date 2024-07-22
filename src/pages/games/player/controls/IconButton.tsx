import type { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type IconButtonProps = {
  onClick: () => void;
  icon: IconProp;
  size?: SizeProp;
  title?: string;
};

export const IconButton = ({
  onClick,
  icon,
  size = "1x",
  title = "",
}: IconButtonProps) => {
  return (
    <button
      className={
        "flex h-10 w-10 items-center justify-center text-gray-300 hover:text-white sm:hover:scale-125 transition-transform"
      }
      onClick={onClick}
      title={title}
    >
      <FontAwesomeIcon fixedWidth size={size} icon={icon} />
    </button>
  );
};

type IconToggleButtonProps = {
  onClick: () => void;
  enabledTitle?: string;
  enabledIcon: IconProp;
  disabledTitle?: string;
  disabledIcon: IconProp;
  size?: SizeProp;
  isEnabled?: boolean;
};

export const IconToggleButton = ({
  onClick,
  enabledTitle,
  enabledIcon,
  disabledTitle,
  disabledIcon,
  size = "1x",
  isEnabled = true,
}: IconToggleButtonProps) => {
  const icon = isEnabled ? enabledIcon : disabledIcon;
  const title = isEnabled ? enabledTitle : disabledTitle;
  return <IconButton onClick={onClick} icon={icon} title={title} size={size} />;
};
