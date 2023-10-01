import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const IconToggleButton = ({
  onClick,
  isEnabled,
  enabledIcon,
  disabledIcon,
  title = "",
}) => {
  return (
    <button className={"w-12 py-2"} onClick={onClick} title={title}>
      <FontAwesomeIcon icon={isEnabled ? enabledIcon : disabledIcon} />
    </button>
  );
};
