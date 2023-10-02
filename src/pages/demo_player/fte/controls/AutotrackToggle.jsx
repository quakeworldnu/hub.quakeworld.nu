import {
  useFteController,
  useFteUpdateOnEvent,
} from "@qwhub/pages/demo_player/fte/hooks";

export const AutotrackToggle = () => {
  const fte = useFteController();
  useFteUpdateOnEvent("autotrack");
  useFteUpdateOnEvent("track");

  if (!fte) {
    return null;
  }

  return (
    <label
      className="select-none mr-4 cursor-pointer flex items-center"
      onClick={() => fte.toggleAutotrack()}
    >
      Autotrack [{fte.autotrack() ? "ON" : "OFF"}]
    </label>
  );
};
