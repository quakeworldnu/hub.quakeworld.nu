import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPointer, faKeyboard } from "@fortawesome/free-solid-svg-icons";

export const Shortcuts = () => {
  return (
    <div className="flex flex-row flex-wrap gap-x-16 gap-y-8">
      <KeyboardShortcuts />
      <MouseShortcuts />
    </div>
  );
};

interface ShortcutInfo {
  keys: string[];
  description: string;
}

const ShortcutList = ({ shortcuts }: { shortcuts: ShortcutInfo[] }) => {
  // chunk shortcuts into groups of 4
  const chunkSize = 4;
  const chunkedShortcuts = [];
  for (let i = 0; i < shortcuts.length; i += chunkSize) {
    chunkedShortcuts.push(shortcuts.slice(i, i + chunkSize));
  }

  return (
    <div className="flex flex-row flex-wrap gap-x-12 gap-y-2">
      {chunkedShortcuts.map((chunk, i) => (
        <div className="space-y-2" key={i}>
          {chunk.map((shortcut, j) => (
            <div key={j} className="flex flex-row items-center space-x-4">
              <div className="text-slate-400 text-sm w-32">
                {shortcut.description}
              </div>
              <div className="flex items-center space-x-2">
                <kbd>{shortcut.keys[0]}</kbd>
                {shortcut.keys[1] && (
                  <>
                    <span className="text-slate-400">+</span>
                    <kbd>{shortcut.keys[1]}</kbd>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const KeyboardShortcuts = () => {
  const shortcuts: ShortcutInfo[] = [
    {
      keys: ["~"],
      description: "Toggle console",
    },
    {
      keys: ["Tab"],
      description: "Toggle scoreboard",
    },
    {
      keys: ["Ctrl"],
      description: "Toggle play/pause",
    },
    {
      keys: ["Space"],
      description: "Track next player",
    },
    {
      keys: [">"],
      description: "Forward 1 second",
    },
    {
      keys: ["Shift", ">"],
      description: "Forward 10 seconds",
    },
    {
      keys: ["<"],
      description: "Rewind 1 second",
    },
    {
      keys: ["Shift", "<"],
      description: "Rewind 10 seconds",
    },
    // {
    //   keys: ["1"],
    //   description: "Default graphics",
    // },
    // {
    //   keys: ["2"],
    //   description: "Vanilla Quake graphics",
    // },
    // {
    //   keys: ["3"],
    //   description: "Fast graphics",
    // },
  ];

  return (
    <div>
      <div className="font-bold text-slate-300 mb-2">
        <FontAwesomeIcon icon={faKeyboard} fixedWidth className="mr-1" />{" "}
        Keyboard shortcuts
      </div>
      <ShortcutList shortcuts={shortcuts} />
    </div>
  );
};

const MouseShortcuts = () => {
  const shortcuts: ShortcutInfo[] = [
    {
      keys: ["Long Press"],
      description: "Toggle scoreboard",
    },
    {
      keys: ["Single Tap"],
      description: "Toggle play/pause",
    },
    {
      keys: ["Double Tap (center)"],
      description: "Toggle fullscreen",
    },
    {
      keys: ["Swipe Left/Right"],
      description: "Track next player",
    },
    {
      keys: ["Double Tap (right)"],
      description: "Forward 10 seconds",
    },
    {
      keys: ["Double Tap (left)"],
      description: "Rewind 10 seconds",
    },
  ];

  return (
    <div>
      <div className="font-bold text-slate-300 mb-2">
        <FontAwesomeIcon icon={faHandPointer} fixedWidth className="mr-1" />{" "}
        Pointer shortcuts
      </div>
      <ShortcutList shortcuts={shortcuts} />
    </div>
  );
};
