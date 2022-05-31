import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import slice from "./slice";

import { regions } from "../../common/regions";

const FilterForm = (props) => {
  const { values, onValidate } = props;

  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#778899"
    >
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );

  return (
    <Formik
      enableReinitialize
      initialValues={values}
      validate={onValidate}
      validateOnChange
    >
      <React.Fragment>
        <div className="column is-narrow-tablet is-narrow-desktop">
          <div className="field has-addons">
            <div className="control">
              <div className="button is-static px-2">
                <SearchIcon />
              </div>
            </div>
            <div className="control is-expanded">
              <Field
                autoFocus
                type="search"
                className="input"
                name="query"
                id="app-filter-query"
              />
            </div>
          </div>
        </div>

        <div className="column is-narrow">
          <div className="select">
            <Field as="select" name="regionName" className="pr-4">
              <option value="">All Regions</option>
              {Object.keys(regions).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Field>
          </div>
        </div>

        <div className="column is-narrow">
          <label className="checkbox py-2">
            <Field type="checkbox" name="isFavorite" /> Favorite servers
          </label>

          <label className="checkbox ml-4 py-2">
            <Field type="checkbox" name="isStarted" /> Live games
          </label>
        </div>
      </React.Fragment>
    </Formik>
  );
};

const Filters = (props) => {
  const { formValues, handleFormChange } = props;

  const handleValidate = (values) => handleFormChange({ values });

  return <FilterForm values={formValues} onValidate={handleValidate} />;
};
const mapStateToProps = (state) => ({
  formValues: state.browser.ui.filters,
});
const mapDispatchToProps = {
  handleFormChange: slice.actions.updateFilters,
};
const FilterFormComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);

export default FilterFormComponent;
