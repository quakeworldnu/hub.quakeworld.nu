import { useFteController, useFteUpdateOnEvent } from "../hooks";

export const AutotrackToggle = () => {
  const fte = useFteController();
  useFteUpdateOnEvent("cl_autotrack");

  if (!fte) {
    return null;
  }

  return (
    <label
      className="select-none mr-4 cursor-pointer flex items-center"
      onClick={() => fte.toggleAutotrack()}
    >
      Autotrack [{fte.isUsingAutotrack() ? "ON" : "OFF"}][{fte.getTrackUserid()}
      ]
    </label>
  );
};
