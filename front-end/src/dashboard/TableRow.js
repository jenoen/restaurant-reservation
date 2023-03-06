import React from "react";
import { useHistory } from "react-router-dom";
import { finishTable, listReservations, listTables } from "../utils/api";

export default function TableRow({ table, setError }) {
  const history = useHistory();

  // displays table status depending if there is a reservation ID
  function tableStatus(reservation_id) {
    return reservation_id ? "Occupied" : "Free";
  }

  // button to clear/finish the table
  function showFinishButton(table, reservationId) {
    if (reservationId) {
      return (
        <button
          className="btn btn-light btn-sm"
          data-table-id-finish={table.table_id}
          onClick={() => finish(table)}
        >
          Finish
        </button>
      );
    }
    return (
      <button
        className="btn btn-light btn-sm"
        data-table-id-finish={table.table_id}
        disabled
      >
        Empty
      </button>
    );
  }

  // function to finish table/clear the reservation ID associated
  async function finish(table) {
    const abortController = new AbortController();
    try {
      if (
        window.confirm(
          `Is this table ready to seat new guests? This cannot be undone.`
        )
      ) {
        const response = await finishTable(table, abortController.signal);
        console.log("hey tableRow.js", response);

        // const reservationResponse = await listReservations(
        //   new Date(),
        //   abortController.signal
        // );
        // console.log("resResponse tableRow.js");

        // const tableResponse = await listTables(abortController.signal);
        // console.log("tableResponse tableRow.js");

        history.push(`/`);
        return response;
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  }

  // // aka if no table, return nothings
  // if (!table) return null;

  // // window.confirm will show a dialogue
  // // Called when the user wants to finish a table that is currently seated.
  // // the dashboard should reload if OK is pressed
  // function handleFinish() {
  //   if (
  //     window.confirm(
  //       "Is this table ready to seat new guests? This cannot be undone."
  //     )
  //   ) {
  //     // delete request here, we will add this later
  //     const abortController = new AbortController();
  //     finishTable(table.table_id, abortController.signal).then(loadDashboard);

  //     history.push("/dashboard"); // kept this here
  //     return () => abortController.abort();
  //   }
  // }

  return (
    <tr
      className="text-truncate"
      style={{ height: "48px" }}
      key={table.table_id}
    >
      <th className="d-none d-md-table-cell" scope="row">
        {table.table_id}
      </th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td
        className="d-none d-md-table-cell"
        data-table-id-status={table.table_id}
      >
        {tableStatus(table.reservation_id)}
        {/* {table.status} */}
      </td>
      <td>{showFinishButton(table, table.reservation_id)}</td>
    </tr>
  );
}
