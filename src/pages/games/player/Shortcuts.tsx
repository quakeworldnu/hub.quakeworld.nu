import { faHandPointer, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ShortCutPreset {
  keyboard: ShortCut[];
  pointer: ShortCut[];
}

interface ShortCut {
  keys: string[];
  description: string;
}

export function Shortcuts({ preset }: { preset: ShortCutPreset }) {
  return (
    <div className="flex flex-row flex-wrap gap-x-16 gap-y-8 my-4">
      <div className="hidden sm:block">
        <KeyboardShortcuts shortcuts={preset.keyboard} />
      </div>
      <PointerShortcuts shortcuts={preset.pointer} />
    </div>
  );
}

const ShortcutList = ({ shortcuts }: { shortcuts: ShortCut[] }) => {
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
              <div className="text-slate-400 text-sm w-40">
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

function KeyboardShortcuts({ shortcuts }: { shortcuts: ShortCut[] }) {
  return (
    <div>
      <div className="font-bold text-slate-300 mb-2">
        <FontAwesomeIcon icon={faKeyboard} fixedWidth className="mr-1" />{" "}
        Keyboard shortcuts
      </div>
      <ShortcutList shortcuts={shortcuts} />
    </div>
  );
}

function PointerShortcuts({ shortcuts }: { shortcuts: ShortCut[] }) {
  return (
    <div>
      <div className="font-bold text-slate-300 mb-2">
        <FontAwesomeIcon icon={faHandPointer} fixedWidth className="mr-1" />{" "}
        Pointer shortcuts
      </div>
      <ShortcutList shortcuts={shortcuts} />
    </div>
  );
}

const commonShortcuts: ShortCutPreset = {
  keyboard: [
    {
      keys: ["~"],
      description: "Toggle console",
    },
    {
      keys: ["Tab"],
      description: "Toggle scoreboard",
    },
    {
      keys: ["Space"],
      description: "Track next player",
    },
  ],
  pointer: [
    {
      keys: ["Long Press"],
      description: "Toggle scoreboard",
    },
    {
      keys: ["Double Tap (center)"],
      description: "Toggle fullscreen",
    },
    {
      keys: ["Swipe Left/Right"],
      description: "Track next/previous player",
    },
  ],
};

const qtvPlayerShortcuts: ShortCutPreset = {
  keyboard: [
    ...commonShortcuts.keyboard,
    {
      keys: ["CTRL"],
      description: "Toggle server selector",
    },
  ],
  pointer: commonShortcuts.pointer,
};

const demoPlayerShortcuts: ShortCutPreset = {
  keyboard: [
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
  ],
  pointer: [
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
      description: "Track next/previous player",
    },
    {
      keys: ["Double Tap (right)"],
      description: "Forward 10 seconds",
    },
    {
      keys: ["Double Tap (left)"],
      description: "Rewind 10 seconds",
    },
  ],
};

export const presets = {
  demoPlayer: demoPlayerShortcuts,
  qtvPlayer: qtvPlayerShortcuts,
};
