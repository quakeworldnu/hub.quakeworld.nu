import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type Props = {
  onClick: () => void;
  isEnabled: boolean;
  enabledIcon: IconProp;
  disabledIcon: IconProp;
  title?: string;
};

export const IconToggleButton = ({
  onClick,
  isEnabled,
  enabledIcon,
  disabledIcon,
  title = "",
}: Props) => {
  return (
    <button
      className={
        "flex h-10 w-12 items-center justify-center text-gray-300 hover:text-white hover:scale-125 transition-transform"
      }
      onClick={onClick}
      title={title}
    >
      <FontAwesomeIcon icon={isEnabled ? enabledIcon : disabledIcon} />
    </button>
  );
};
