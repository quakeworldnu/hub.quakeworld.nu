import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { FontAwesomeIcon } from "@/components/ui/icon";

type IconButtonProps = {
  onClick: () => void;
  icon: IconDefinition;
  size?: SizeProp;
  title?: string;
  isSelected?: boolean;
};

export const IconButton = ({
  onClick,
  icon,
  size = "1x",
  title = "",
  isSelected = false,
}: IconButtonProps) => {
  return (
    <button
      type="button"
      className={clsx(
        "flex h-10 w-10 items-center justify-center hover:text-white sm:hover:scale-125 transition-transform",
        isSelected ? "text-sky-400" : "text-gray-300",
      )}
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
  enabledIcon: IconDefinition;
  disabledTitle?: string;
  disabledIcon: IconDefinition;
  size?: SizeProp;
  isEnabled?: boolean;
  isSelected?: boolean;
};

export const IconToggleButton = ({
  onClick,
  enabledTitle,
  enabledIcon,
  disabledTitle,
  disabledIcon,
  size = "1x",
  isEnabled = true,
  isSelected = false,
}: IconToggleButtonProps) => {
  const icon = isEnabled ? enabledIcon : disabledIcon;
  const title = isEnabled ? enabledTitle : disabledTitle;
  return (
    <IconButton
      onClick={onClick}
      icon={icon}
      title={title}
      size={size}
      isSelected={isSelected}
    />
  );
};
