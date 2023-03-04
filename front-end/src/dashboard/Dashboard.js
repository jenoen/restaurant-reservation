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

  // // displays time in a nicer format
  // function simpleTimeFormat(time) {
  //   let hour = +time.substr(0, 2);
  //   let newHour = hour % 12 || 12;
  //   let meridiem = hour < 12 || hour === 24 ? "AM" : "PM";
  //   return `${newHour}${time.substr(2, 3)} ${meridiem}`;
  // }

  // // displays table status depending if there is a reservation ID
  // function tableStatus(reservation_id) {
  //   return reservation_id ? "Occupied" : "Free";
  // }

  // // function to finish table/clear the reservation ID associated
  // async function finish(table) {
  //   const abortController = new AbortController();
  //   try {
  //     if (
  //       window.confirm(
  //         `Is this table ready to seat new guests? This cannot be undone.`
  //       )
  //     ) {
  //       const response = await finishTable(table, abortController.signal);
  //       history.go(0); // reloads the current page
  //       return response;
  //     }
  //   } catch (error) {
  //     setError(error);
  //     console.error(error);
  //   }
  // }

  // function showFinishButton(table, reservationId) {
  //   if (reservationId) {
  //     return (
  //       <button
  //         className="btn btn-light btn-sm"
  //         data-table-id-finish={table.table_id}
  //         onClick={() => finish(table)}
  //       >
  //         Finish
  //       </button>
  //     );
  //   }
  //   return (
  //     <button
  //       className="btn btn-light btn-sm"
  //       data-table-id-finish={table.table_id}
  //       disabled
  //     >
  //       Empty
  //     </button>
  //   );
  // }

  // // shows the status of the reservation and allows to seat the reservation
  // function reservationStatus(reservation) {
  //   if (reservation.status === "booked") {
  //     return (
  //       <Link
  //         to={{
  //           pathname: `/reservations/${reservation.reservation_id}/seat`,
  //           state: {
  //             tables: tables,
  //           },
  //         }}
  //         type="button"
  //         className="btn btn-light btn-sm"
  //       >
  //         Seat
  //       </Link>
  //     );
  //   }
  //   return null;
  // }

  // // button to edit the reservation
  // function editReservation(reservation) {
  //   if (reservation.status === "booked") {
  //     return (
  //       <Link
  //         to={{
  //           pathname: `/reservations/${reservation.reservation_id}/edit`,
  //           state: {
  //             date: reservation.reservation_date,
  //           },
  //         }}
  //         type="button"
  //         className="btn btn-light btn-sm"
  //       >
  //         Edit
  //       </Link>
  //     );
  //   }
  //   return null;
  // }

  // // button to cancel/delete the reservation
  // function cancelButton(reservation) {
  //   if (reservation.status === "booked") {
  //     return (
  //       <td data-reservation-id-cancel={reservation.reservation_id}>
  //         <button
  //           className="btn btn-danger btn-sm"
  //           onClick={() => cancelReservation(reservation)}
  //         >
  //           Cancel
  //         </button>
  //       </td>
  //     );
  //   }
  //   return <td></td>;
  // }

  // // function that would actually delete the reservation
  // async function cancelReservation(reservation) {
  //   try {
  //     if (
  //       window.confirm(
  //         `Do you want to cancel this reservation? This cannot be undone.`
  //       )
  //     ) {
  //       const abortController = new AbortController();
  //       const response = await updateReservationStatus(
  //         reservation,
  //         "cancelled",
  //         abortController.signal
  //       );
  //       history.go(0);
  //       return response;
  //     }
  //   } catch (error) {
  //     setError(error);
  //     console.error(error);
  //   }
  // }

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
              className="btn "
              onClick={() => handlePrevious()}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn "
              onClick={() => handleCurrent()}
            >
              Today
            </button>
            <button type="button" className="btn " onClick={() => handleNext()}>
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
