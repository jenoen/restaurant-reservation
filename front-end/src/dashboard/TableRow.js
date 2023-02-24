import React from "react";
import { useHistory } from "react-router-dom";
import { finishTable } from "../utils/api";

export default function TableRow({ table, loadDashboard }) {
  const history = useHistory();

  // aka if no table, return nothings
  if (!table) return null;

  // window.confirm will show a dialogue
  // Called when the user wants to finish a table that is currently seated.
  // the dashboard should reload if OK is pressed
  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      // delete request here, we will add this later
      const abortController = new AbortController();
      finishTable(table.table_id, abortController.signal).then(loadDashboard);

      history.push("/dashboard"); // kept this here
      return () => abortController.abort();
    }
  }

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{table.status}</td>
      {/* added this */}

      <td>{table.reservation_id ? table.reservation_id : "--"}</td>
      {/* i used an && here. the button will only show up if the table's status is occupied. */}
      {table.status === "occupied" && (
        <td data-table-id-finish={table.table_id}>
          <button onClick={handleFinish} type="button">
            Finish
          </button>
        </td>
      )}
    </tr>
  );
}
