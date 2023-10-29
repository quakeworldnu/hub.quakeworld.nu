import { useLocalStorage } from "usehooks-ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import { query } from "urlcat";

type ClipEditor = {
  isEnabled: boolean;
  demoId: number;
  from: number;
  to: number;
};

export function useClipEditor() {
  const [props, setProps] = useLocalStorage<ClipEditor>("isClipping", {
    isEnabled: false,
    demoId: 0,
    from: 0,
    to: 0,
  });

  function toggleIsEnabled() {
    setProps({ ...props, isEnabled: !props.isEnabled });
  }

  function disable() {
    setProps({ ...props, isEnabled: false });
  }

  function setTimeFrom(from: number) {
    setProps({ ...props, from });
  }

  function setTimeTo(to: number) {
    setProps({ ...props, to });
  }

  function getUrl() {
    const baseUrl =
      "https://qwsb-4b8ab--demoplayer-ue1ng6v5.web.app/demo_player/";
    const params = {
      demoId: props.demoId,
      from: props.from,
      to: props.to,
    };
    return `${baseUrl}?${query(params)}`;
  }

  return {
    ...props,
    toggleIsEnabled,
    disable,
    getUrl,
    setTimeFrom,
    setTimeTo,
  };
}

export const ClipButton = () => {
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
