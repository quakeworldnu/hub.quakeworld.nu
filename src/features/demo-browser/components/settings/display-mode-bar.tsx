import { faBars, faTableCells } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { FontAwesomeIcon } from "@/components/ui/icon";
import { sizeSmall, toggleBtn, toggleBtnSelected } from "@/components/ui/theme";
import { useGameSettings } from "@/features/demo-browser/providers/browser-settings";
import type { DisplayMode } from "@/types/games";

export const DisplayModeBar = () => {
  const { displayMode, setDisplayMode } = useGameSettings();

  const options = [
    { icon: faTableCells, label: "Grid", value: "Grid" },
    { icon: faBars, label: "List", value: "List" },
  ];

  function handleClick(value: string) {
    setDisplayMode(value as DisplayMode);
  }

  return (
    <div className="flex items-center space-x-px">
      {options.map((option) => (
        <div
          key={option.value}
          title={`Display as ${option.value}`}
          className={clsx(`${toggleBtn} ${sizeSmall}`, {
            [toggleBtnSelected]: displayMode === option.value,
          })}
          onClick={() => handleClick(option.value)}
        >
          <FontAwesomeIcon fixedWidth icon={option.icon} />
          <div>{option.label}</div>
        </div>
      ))}
    </div>
  );
};
