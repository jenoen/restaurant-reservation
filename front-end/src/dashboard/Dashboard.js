import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";

import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";

import ReservationRow from "./ReservationRow";
import TableRow from "./TableRow";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ today }) {
  const history = useHistory();
  const query = new URLSearchParams(useLocation().search);
  const date = query.get("date");
  const [selectedDate, setSelectedDate] = useState(date || today);
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);

  // loads Dashboard to list tables + reservations each time dashboard redirects
  useEffect(() => {
    const abortController = new AbortController();

    // defintion
    async function loadDashboard() {
      // lists the reservations depending on which date
      try {
        setError(null);
        const response = await listReservations(
          { selectedDate },
          abortController.signal
        );

        setReservations(response);
      } catch (error) {
        setError(error);
        console.error(error);
      }
      // lists the tables
      try {
        setError(null);
        const response = await listTables(abortController.signal);
        setTables(response);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    }

    // actually calls the func
    loadDashboard();
    return () => {
      abortController.abort();
    };
  }, [selectedDate]); // runs each time selectedDate changes

  // function to handle the changes to choose a date
  function handleChange({ target }) {
    let value = target.value;
    setSelectedDate(value);
  }

  function handlePrevious() {
    const asDate = new Date(selectedDate);
    console.log("asDate", asDate);
    const previousDate = new Date(asDate.setDate(asDate.getDate() - 1));
    console.log("previousDate", previousDate);
    const previousDateString = previousDate.toISOString().split("T")[0];
    console.log("previousDateString", previousDateString);
    setSelectedDate(previousDateString);
  }

  function handleNext() {
    const asDate = new Date(selectedDate);
    const nextDate = new Date(asDate.setDate(asDate.getDate() + 1));
    const nextDateString = nextDate.toISOString().split("T")[0];
    setSelectedDate(nextDateString);
  }

  function handleCurrent() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    setSelectedDate(currentDateString);
  }

  const displayReservationRows = () => {
    return reservations.map((reservation) => (
      <ReservationRow
        key={reservation.reservation_id}
        reservation={reservation}
        setError={setError}
      />
    ));
  };

  const displayTableRows = () => {
    return tables.map((table) => (
      <TableRow key={table.table_id} table={table} setError={setError} />
    ));
  };

  return (
    <main>
      <div className="container">
        <div className="d-grid gap-2 mb-2">
          <h1>Dashboard</h1>
          <ErrorAlert error={error} />

          <h4>Reservations</h4>

          {/* calendar menu to select date */}
          <div className="form-group">
            <label>Date:</label>
            <input
              id="date"
              name="date"
              className="form-control"
              type="date"
              value={selectedDate}
              onChange={handleChange}
              required
            />
          </div>

          {/* buttons to choose the dates */}
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => handlePrevious()}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => handleCurrent()}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-outline-dark"
              onClick={() => handleNext()}
            >
              Next
            </button>
          </div>

          {/* table for reservations */}
          <table className="table table-striped table-dark align-middle">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell" scope="col">
                  #
                </th>
                <th scope="col">Name</th>
                <th className="d-none d-md-table-cell" scope="col">
                  Phone
                </th>
                <th scope="col">Time</th>
                <th className="d-none d-md-table-cell" scope="col">
                  Party
                </th>
                <th className="d-none d-md-table-cell" scope="col">
                  Status
                </th>
                <th scope="col">Seat</th>
                <th className="d-none d-md-table-cell" scope="col">
                  Edit
                </th>
                <th scope="col">Cancel</th>
              </tr>
            </thead>
            <tbody>{displayReservationRows()}</tbody>
          </table>

          <br />
          <br />

          {/* table for Tables */}
          <h4 className="mb-0">Tables</h4>

          <table className="table table-striped table-dark align-middle">
            <thead>
              <tr>
                <th className="d-none d-md-table-cell" scope="col">
                  #
                </th>
                <th scope="col">Name</th>
                <th scope="col">Capacity</th>
                <th className="d-none d-md-table-cell" scope="col">
                  Occupied
                </th>
                <th scope="col">Finish</th>
              </tr>
            </thead>
            <tbody>{displayTableRows()}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
