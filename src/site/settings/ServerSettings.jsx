import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik, useFormikContext } from "formik";
import EZDrawer from "react-modern-drawer";
import { setServerFilters, setShowSettings } from "@qwhub/settingsSlice";
import {
  equalsDefaultFilters,
  getDefaultServerFilters,
  modes,
  regions,
} from "@qwhub/serverFilters";

import classNames from "classnames";
import { selectServerFilters } from "@qwhub/selectors";

export const SettingsDrawer = () => {
  const showSettings = useSelector((state) => state.settings.ui.showSettings);
  const dispatch = useDispatch();

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
  const serverFilters =
    useSelector(selectServerFilters) || getDefaultServerFilters();
  const showSettings = useSelector((state) => state.settings.ui.showSettings);
  const dispatch = useDispatch();

  if (!showSettings) {
    return null;
  }

  function onSubmit(values) {
    dispatch(setServerFilters(values));
  }

  return (
    <Formik onSubmit={onSubmit} initialValues={serverFilters}>
      {() => <SettingsForm />}
    </Formik>
  );
};

const SettingsForm = () => {
  const dispatch = useDispatch();
  const { submitForm, setValues, values } = useFormikContext();

  function onClose() {
    dispatch(setShowSettings(false));
  }

  async function onReset() {
    await setValues(getDefaultServerFilters());
    await submitForm();
  }

  return (
    <Form onChange={submitForm}>
      <div>
        <div className="space-y-4" id="SettingsForm">
          <div className="flex justify-between items-center border-b border-b-slate-700 pb-2">
            <div className="font-bold">Server filters</div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-full"
            >
              <img
                src="https://hub.quakeworld.nu/assets/img/icons/close.svg"
                width={12}
                height={12}
              />
            </button>
          </div>

          <div className="text-sm">
            <Checkbox
              name={"only_bots"}
              label={"Show servers with only bots"}
              isChecked={values.only_bots ?? false}
            />
          </div>

          <div>
            <div className="font-bold text-sm mb-1">Game modes</div>
            <div className="text-sm space-y-0.5 max-w-xs columns-2">
              {modes.map((mode) => {
                return (
                  <Checkbox
                    key={mode}
                    name={"modes"}
                    label={mode}
                    value={mode}
                    isChecked={values.modes.includes(mode)}
                  />
                );
              })}
            </div>
          </div>

          <div>
            <div className="font-bold text-sm mb-1">Regions</div>
            <div className="text-sm space-y-0.5 max-w-xs columns-2">
              {regions.map((region) => {
                return (
                  <Checkbox
                    key={region}
                    name={"regions"}
                    label={region}
                    value={region}
                    isChecked={values.regions.includes(region)}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="bg-slate-700 hover:bg-slate-600 rounded px-2.5 py-1.5 text-sm"
            onClick={onReset}
          >
            Reset all
          </button>
        </div>
      </div>
    </Form>
  );
};

const Checkbox = ({ name, label, value, isChecked }) => {
  return (
    <div>
      <label className="inline-block cursor-pointer w-auto p-0.5 text-gray-300 hover:text-white select-none">
        <Field type="checkbox" name={name} value={value} checked={isChecked} />
        <span className="ml-1.5">{label}</span>
      </label>
    </div>
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
