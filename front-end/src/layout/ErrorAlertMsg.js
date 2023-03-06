import React from "react";

function ErrorAlertMsg({ errorMsg }) {
  console.log("inside function: " + errorMsg);
  return <div className="alert alert-danger m-2">Error: {errorMsg}</div>;
}

export default ErrorAlertMsg;
