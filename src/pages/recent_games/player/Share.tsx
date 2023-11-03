import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import copyTextToClipboard from "copy-text-to-clipboard";
import { useRef } from "react";

export const ShareDemoButton = () => {
  const ref = useRef<HTMLDivElement>(null);

  function handleClick() {
    copyTextToClipboard(document.location.href);
  }

  return (
    <div ref={ref}>
      <button
        className="flex text-sm items-center md:mt-0 py-2.5 px-4 rounded bg-gradient-to-b from-emerald-700 to-emerald-900 hover:from-emerald-600 hover:to-emerald-800"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faShare} fixedWidth className="mr-1.5" />
        Share
      </button>
    </div>
  );
};
