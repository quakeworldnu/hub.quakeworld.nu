import { getDefaultServerFilters, modes, regions } from "@qwhub/serverFilters";
import { setServerFilters, setShowSettings } from "@qwhub/settingsSlice";
import { Field, Form, Formik, useFormikContext } from "formik";
import { useDispatch, useSelector } from "react-redux";

import { selectServerFilters } from "@qwhub/selectors";

export const ServerSettingsForm = () => {
  const serverFilters =
    useSelector(selectServerFilters) || getDefaultServerFilters();
  const dispatch = useDispatch();

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
