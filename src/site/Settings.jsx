import { useDispatch, useSelector } from "react-redux";
import { Field, Form, Formik, useFormikContext } from "formik";
import classNames from "classnames";
import {
  gameModes,
  getDefaultServerFilters,
  setServerFilters,
  setShowSettings,
  toggleShowSettings,
} from "@qwhub/settingsSlice";
import React from "react";

export const Settings = () => {
  const serverFilters = useSelector((state) => state.settings.serverFilters);
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
      <div
        className={classNames(
          "my-4 p-3 pb-6 bg-slate-800 border border-slate-600 rounded-lg",
        )}
      >
        <div className="space-y-4" id="SettingsForm">
          <div className="flex justify-between items-center border-b border-b-slate-600 pb-2">
            <div className="font-bold">Server filters</div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-full"
            >
              <img
                src="https://hub.quakeworld.nu/assets/img/icons/close.svg"
                width={16}
                height={16}
                className={"block"}
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

          <div className="text-sm space-y-0.5 max-w-xs columns-2">
            {gameModes.map((mode) => {
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

          <div className="text-sm pt-3">
            <button
              type="button"
              className="bg-white/10 rounded p-2"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export const Checkbox = ({ name, label, value, isChecked }) => {
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

  function onToggleSettings(e) {
    e.preventDefault();
    dispatch(toggleShowSettings());
  }

  return (
    <button
      onClick={onToggleSettings}
      className="inline-block px-2 py-1.5 ml-auto bg-slate-800 hover:bg-slate-700 rounded text-gray-300 text-xs"
      title="Settings"
    >
      <img
        /*src="https://hub.quakeworld.nu/assets/img/icons/settings.svg"*/
        src="/assets/img/icons/settings.svg"
        width={16}
        height={16}
      />
    </button>
  );
};
