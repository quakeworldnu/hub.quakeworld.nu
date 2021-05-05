import React from "react";
import { connect } from "react-redux";
import formSlice from "./slice";
import { Field, Formik } from "formik";

const SalaryAfterTaxForm = (props) => {
  const { counties, form, onValidate } = props;

  console.log("SalaryAfterTaxForm::render");

  return (
    <Formik
      enableReinitialize
      initialValues={form.values}
      validate={onValidate}
      validateOnChange
    >
      <form className="app-grid-column">
        <div className="app-grid-row app-grid-content-row">
          <div className="app-row-content">
            <Field type="number" name="incomeTotal" className="form-control" />
          </div>
        </div>

        <div className="app-grid-row app-grid-content-row">
          <div className="app-row-content">
            <Field as="select" name="county_id" className="form-control">
              {counties &&
                Object.values(counties).map((county, index) => (
                  <option key={index} value={county.id}>
                    {county.name} &nbsp; ({county.tax_total}%)
                  </option>
                ))}
            </Field>
          </div>
        </div>

        <div className="app-grid-row app-grid-content-row">
          <div className="app-row-content">
            <label>
              <Field type="checkbox" name="religious" /> medlem i trosamfund
            </label>
          </div>
        </div>

        <div className="app-grid-row app-grid-content-row">
          <div className="app-row-content">{form.result} kr</div>
        </div>

        <div className="app-grid-row app-grid-content-row">
          <div className="app-row-content">
            <pre>{JSON.stringify(form, null, 2)}</pre>
          </div>
        </div>

        <div className="app-grid-row app-grid-content-row">
          <div className="app-row-content">asd</div>
        </div>
      </form>
    </Formik>
  );
};

const SalaryAfterTax = (props) => {
  const { form, handleFormChange } = props;

  const handleValidate = (values) => handleFormChange({ id: form.id, values });

  return (
    <SalaryAfterTaxForm form={form} counties={[]} onValidate={handleValidate} />
  );
};

const mapStateToProps = (state, ownProps) => ({
  form: state.forms[ownProps.id],
});
const mapDispatchToProps = {
  handleFormChange: formSlice.actions.update,
};

export default connect(mapStateToProps, mapDispatchToProps)(SalaryAfterTax);
