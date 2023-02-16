import React from "react";
import { useHistory } from "react-router-dom";

export default function TableRow({ table }) {
  const history = useHistory();

  // aka if no table, return nothings
  if (!table) return null;

  // window.confirm will show a dialogue that will give an "OK" button or a "Cancel" button.
  // it will return true if the OK button is pressed, and false for cancel
  // the dashboard should reload if OK is pressed, i use history here for that reason
  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      // delete request here, we will add this later
      history.push("/dashboard");
    }
  }

  return (
    <tr>
      <th scope="row">{table.table_id}</th>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      <td data-table-id-status={table.table_id}>{table.status}</td>

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
