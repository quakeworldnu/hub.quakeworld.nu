import classNames from "classnames";

export const ModeRibbon = ({ mode }: { mode: string }) => {
  return (
    <div className="w-24 h-24 overflow-hidden">
      <div
        className={classNames(
          "flex -translate-x-[45%] -translate-y-[195%] -rotate-45 origin-bottom-right h-8 w-48 bg-gradient-to-bl justify-center items-center z-10 text-white app-text-shadow font-bold text-sm",
          {
            "from-red-500 to-red-900": mode === "4on4",
            "from-blue-500 to-blue-900": mode === "2on2",
            "from-green-500 to-green-900": mode === "1on1",
          },
        )}
      >
        {mode}
      </div>
    </div>
  );
};
