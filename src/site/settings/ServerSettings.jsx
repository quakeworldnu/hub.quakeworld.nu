import { equalsDefaultFilters } from "@qwhub/serverFilters";
import { setShowSettings } from "@qwhub/settingsSlice";
import { Suspense, lazy, useEffect } from "react";
import EZDrawer from "react-modern-drawer";
import { useDispatch, useSelector } from "react-redux";

import { selectServerFilters } from "@qwhub/selectors";
import classNames from "classnames";

// settings form (formik) is only needed when the drawer is opened,
// keep it out of the initial bundle and preload it when the browser is idle
const loadServerSettingsForm = () => import("./ServerSettingsForm.jsx");
const ServerSettingsForm = lazy(() =>
  loadServerSettingsForm().then((m) => ({ default: m.ServerSettingsForm })),
);

function onIdle(callback) {
  if ("requestIdleCallback" in window) {
    const id = requestIdleCallback(callback);
    return () => cancelIdleCallback(id);
  }

  const id = setTimeout(callback, 1);
  return () => clearTimeout(id);
}

export const SettingsDrawer = () => {
  const showSettings = useSelector((state) => state.settings.ui.showSettings);
  const dispatch = useDispatch();

  useEffect(() => onIdle(loadServerSettingsForm), []);

  function onClose() {
    dispatch(setShowSettings(false));
  }

  return (
    <EZDrawer open={showSettings} onClose={onClose} direction="left" size={320}>
      <ServerSettings />
    </EZDrawer>
  );
};

export const ServerSettings = () => {
  const showSettings = useSelector((state) => state.settings.ui.showSettings);

  if (!showSettings) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ServerSettingsForm />
    </Suspense>
  );
};

export const SettingsToggleButton = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectServerFilters);
  const hasModifiedFilters = !equalsDefaultFilters(filters);

  function showSettings(e) {
    e.preventDefault();
    dispatch(setShowSettings(true));
  }

  return (
    <button
      onClick={showSettings}
      className={classNames(
        "flex items-center px-1.5 py-1 ml-auto rounded text-gray-300 text-xs border",
        {
          "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border-slate-700 hover:border-slate-500":
            !hasModifiedFilters,
          "bg-yellow-950 hover:bg-yellow-900 text-yellow-500 border-yellow-800 hover:border-yellow-700":
            hasModifiedFilters,
        },
      )}
      title="Server filters"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        className="w-5 inline"
      >
        <path
          d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
          fill="currentColor"
        />
      </svg>
      <span className="ml-1 hidden sm:inline">Filters</span>
    </button>
  );
};
