import { faBars, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { sizeSmall, toggleBtn, toggleBtnSelected } from "../../ui/theme.ts";
import { useGameSettings } from "./context.tsx";
import type { DisplayMode } from "./types.ts";

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
          className={classNames(`${toggleBtn} ${sizeSmall}`, {
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
