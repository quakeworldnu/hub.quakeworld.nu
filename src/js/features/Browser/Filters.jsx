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
        <div className="field">
          <Field
            type="search"
            className="input"
            name="keyword"
            placeholder="Find player"
          />
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
