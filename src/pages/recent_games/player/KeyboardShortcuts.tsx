export const KeyboardShortcuts = () => {
  const shortcuts = [
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
      description: "Fast forward 1 second",
    },
    {
      keys: ["Shift", ">"],
      description: "Fast forward 10 seconds",
    },
    {
      keys: ["<"],
      description: "Rewind 1 second",
    },
    {
      keys: ["Shift", "<"],
      description: "Rewind 10 seconds",
    },
    {
      keys: ["1"],
      description: "Default graphics",
    },
    {
      keys: ["2"],
      description: "Vanilla Quake graphics",
    },
    {
      keys: ["3"],
      description: "Fast graphics",
    },
  ];

  // chunk shortcuts into groups of 4
  const chunkSize = 4;
  const chunkedShortcuts = [];
  for (let i = 0; i < shortcuts.length; i += chunkSize) {
    chunkedShortcuts.push(shortcuts.slice(i, i + chunkSize));
  }

  return (
    <div>
      <div className="font-bold text-slate-300 mb-2">Keyboard shortcuts</div>

      <div className="flex flex-row flex-wrap gap-x-10 gap-y-2">
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
    </div>
  );
};
