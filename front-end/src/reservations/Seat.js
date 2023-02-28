import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  updateReservationStatus,
  findReservation,
  updateTable,
  listTables,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Seat() {
  const history = useHistory();

  // here are the states we need to keep track of
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [table, setTable] = useState();
  const [error, setError] = useState([]);

  // to load all the seats once the page loads
  useEffect(() => {
    const abortController = new AbortController();
    async function loadSeat() {
      try {
        setError(null);
        const response = await listTables(abortController.signal);
        setTables(response);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    }
    loadSeat();
    return () => {
      abortController.abort();
    };
  }, []); // does this only once

  // once "tables" are loaded -> remap to show options
  const tableOptions = tables.map((table) => {
    // If table does NOT have reservation ID associated - show availbility
    if (!table.reservation_id) {
      return (
        <option key={table.table_id} value={table.table_name}>
          {table.table_name} - {table.capacity}
        </option>
      );
    }

    // if YES has ID associated -> disable option & say 'occupied'
    else {
      return (
        <option key={table.table_id} value={table.table_name} disabled>
          {table.table_name} - {table.capacity} - Occupied
        </option>
      );
    }
  });

  // records changes in keystroke and sets the values for chosen table
  function handleChange({ target }) {
    const value = target.value;
    if (value !== "select a table") {
      // aka match the target.value to the actual table in list and setTable data
      const result = tables.find((table) => table.table_name === value);
      setTable(result);
    }
  }

  async function handleSubmit({ target }) {
    target.preventDefault();
    if (table) {
      try {
        const abortController = new AbortController();
        const response = await updateTable(
          { ...table, reservation_id: reservation_id },
          abortController.signal
        );
        history.push(`/`);
        const reservation = await findReservation(
          reservation_id,
          abortController.signal
        );
        await updateReservationStatus(
          reservation,
          "seated",
          abortController.signal
        );

        return response;
      } catch (error) {
        setError(error);
        console.error(error);
      }
    }
  }

  // // submit handler
  // function handleSubmit(event) {
  //   event.preventDefault();

  //   // uses validation function if the seat is correct
  //   if (validateSeat()) {
  //     history.push(`/dashboard`);
  //   }
  // }

  // // checks if table assigned is valid
  // function validateSeat() {
  //   const foundErrors = [];

  //   // we will need to use the find method here to get the actual table/reservation objects from their ids
  //   const foundTable = tables.find((table) => table.table_id === tableId);
  //   const foundReservation = reservations.find(
  //     (reservation) => reservation.reservation_id === reservation_id
  //   );

  //   if (!foundTable) {
  //     foundErrors.push("The table you selected does not exist.");
  //   } else if (!foundReservation) {
  //     foundErrors.push("This reservation does not exist.");
  //   } else {
  //     if (foundTable.status === "occupied") {
  //       foundErrors.push("The table you selected is currently occupied.");
  //     }

  //     if (foundTable.capacity < foundReservation.people) {
  //       foundErrors.push(
  //         `The table you selected cannot seat ${foundReservation.people} people.`
  //       );
  //     }
  //   }

  //   setErrors(foundErrors);

  //   // this conditional will either return true or false based off of whether foundErrors is equal to 0
  //   // return foundErrors.length === 0;

  //   if (foundErrors.length > 0) {
  //     return false;
  //   }
  //   return true;
  // }

  if (tables) {
    return (
      <div className="container d-grid gap-2">
        <h4>Seating for Reservation</h4>
        {/* to show errors */}
        <ErrorAlert error={error} />
        <form>
          <label htmlFor="table_id">Choose table:</label>
          <select
            name="table_id"
            id="table_id"
            value={table ? table.table_name : "tables"}
            onChange={handleChange}
          >
            <option value="select a table">Select a Table</option>
            {tableOptions}
          </select>

          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
          <button type="button" onClick={history.goBack}>
            Cancel
          </button>
        </form>
      </div>
    );
  } else {
    return null;
  }
}
