import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import { query } from "urlcat";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export function useClipEditor() {
  const [isEnabled, setIsEnabled] = useLocalStorage<boolean>(
    "showClipEditor",
    false,
  );
  const [from, setFrom] = useState<number>(0);
  const [to, setTo] = useState<number>(0);

  function toggleIsEnabled() {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
  }

  function enable() {
    setIsEnabled(true);
  }

  function disable() {
    setIsEnabled(false);
  }

  function setTimeFrom(from: number) {
    setFrom(Math.floor(from));
  }

  function setTimeTo(to: number) {
    setTo(Math.floor(to));
  }

  function getUrl() {
    const baseUrl =
      "https://qwsb-4b8ab--demoplayer-ue1ng6v5.web.app/demo_player/";
    const params = {
      demoId: 0,
      from,
      to,
    };
    return `${baseUrl}?${query(params)}`;
  }

  return {
    isEnabled,
    from,
    to,
    toggleIsEnabled,
    disable,
    getUrl,
    setTimeFrom,
    setTimeTo,
  };
}

export const ToggleClipEditorButton = () => {
  const { toggleIsEnabled } = useClipEditor();

  return (
    <button
      className="flex text-sm items-center md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800"
      onClick={toggleIsEnabled}
    >
      <FontAwesomeIcon icon={faScissors} fixedWidth className="mr-1.5" />
      Create clip
    </button>
  );
};
