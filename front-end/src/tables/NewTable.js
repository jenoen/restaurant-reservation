// new component for creating a new table
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable() {
  const history = useHistory();

  //to hold errors
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // initial (default) data
    table_name: "",
    capacity: "",
  });

  //  to handle the user input
  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const abortController = new AbortController();

      formData.capacity = Number(formData.capacity);
      // console.log("formData.capacity", formData.capacity);
      // console.log("formData.capacity TYPE", typeof formData.capacity);

      const response = await createTable(formData, abortController.signal);

      history.push(`/dashboard`);
      return response;
      // }
    } catch (error) {
      setError(error);
      console.error("newTable.js", error);
    }
  }

  return (
    <div className="container">
      <form className="d-grid gap-2 mb-2">
        <h1>New Table</h1>
        <ErrorAlert error={error} />
        <div className="form-group">
          <label htmlFor="table_name">Table Name:&nbsp;</label>
          <input
            name="table_name"
            id="table_name"
            type="text"
            min="2"
            placeholder="eg. Table 3"
            onChange={handleChange}
            value={formData.table_name}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacity">Capacity:&nbsp;</label>
          <input
            className="form-control"
            name="capacity"
            id="capacity"
            type="number"
            min="1"
            onChange={handleChange}
            value={formData.capacity}
            placeholder="eg. 1"
            required
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <button type="button" onClick={history.goBack}>
          Cancel
        </button>
      </form>
    </div>
  );
}
