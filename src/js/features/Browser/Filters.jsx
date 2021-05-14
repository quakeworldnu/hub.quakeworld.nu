import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import slice from "./slice";

const FilterForm = (props) => {
  const { values, onValidate } = props;

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validate={onValidate}
      validateOnChange
    >
      <form>
        <div className="columns">
          <div className="field column is-narrow">
            <label className="label" htmlFor="region">
              Region
            </label>
            <div className="control">
              <div className="select">
                <select name="" id="region">
                  <option value="">(any region)</option>
                  <option value="eu">Europe</option>
                  <option value="ru">Russia</option>
                  <option value="na">North America</option>
                  <option value="sa">South America</option>
                  <option value="af">Africa</option>
                  <option value="as">Asia</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field column is-narrow">
            <label className="label" htmlFor="keyword">
              Player
            </label>
            <Field
              type="search"
              className="input"
              id="keyword"
              name="keyword"
            />
          </div>
          <div className="field column is-narrow">
            <label className="label" htmlFor="keyword">
              Misc
            </label>
            <div>[ ] Hide servers with no players</div>
          </div>
        </div>
      </form>
    </Formik>
  );
};

const Filters = (props) => {
  const { formValues, handleFormChange } = props;

  const handleValidate = (values) => handleFormChange({ values });

  return <FilterForm values={formValues} onValidate={handleValidate} />;
};

const mapStateToProps = (state) => ({
  formValues: state.servers.ui.filters,
});
const mapDispatchToProps = {
  handleFormChange: slice.actions.updateFilters,
};

const FilterFormComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);

export default FilterFormComponent;
