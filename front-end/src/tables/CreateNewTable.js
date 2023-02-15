// new component for creating a new table
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable() {
  const history = useHistory();

  //to hold errors
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    // initial (default) data
    table_name: "",
    capacity: 1,
  });

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (validateFields()) {
      history.push(`/dashboard`);
    }
  }

  function validateFields() {
    let foundError = [];

    if (formData.table_name === "" || formData.capacity === "") {
      foundError.push({ message: "Please fill out all fields." });
    } else if (formData.table_name.length < 2) {
      foundError.push({ message: "Table name must be at least 2 characters." });
    } else if (formData.capacity < 1) {
      foundError.push({
        message: "Table capacity must seat at least one person.",
      });
    }

    setErrors(foundError);

    if (foundError.length > 0) {
      return false;
    }
    return true;
  }

  // function to display the errors we have received - to be inserted with "form component"
  const displayErrors = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  return (
    <form>
      {displayErrors()}

      <label htmlFor="table_name">Table Name:&nbsp;</label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        minlength="2"
        onChange={handleChange}
        value={formData.table_name}
        required
      />

      <label htmlFor="capacity">Capacity:&nbsp;</label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
