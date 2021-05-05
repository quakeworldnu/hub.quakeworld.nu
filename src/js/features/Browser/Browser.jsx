import React from "react";
import { connect } from "react-redux";

const Browser = (props) => {
  return (
    <div>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

const mapStateToProps = (state) => state;

const BrowserComponent = connect(mapStateToProps)(Browser);

export default BrowserComponent;
