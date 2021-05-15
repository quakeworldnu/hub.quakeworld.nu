import React from "react";
import { Formik, Field } from "formik";
import { connect } from "react-redux";
import slice from "./slice";

const FilterForm = (props) => {
  const { values, onValidate } = props;

  const SearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#666666"
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
      <form>
        <div className="field has-addons">
          <p className="control">
            <a className="button is-static px-2">
              <SearchIcon />
            </a>
          </p>
          <div className="control is-expanded">
            <Field
              type="search"
              className="input"
              id="query"
              name="query"
              style={{ width: "160px" }}
            />
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
