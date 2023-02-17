// i know we will be using useState in the future, so i'm importing it now

import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationRow from "../dashboard/ReservationRow";
export default function Search() {
  // this state stores the search input
  const [mobileNumber, setMobileNumber] = useState("");

  // this state will store the search results
  const [reservations, setReservations] = useState([]);

  // and, this state, well, stores an error if we get one
  const [error, setError] = useState(null);

  function handleChange({ target }) {
    setMobileNumber(target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();

    const abortController = new AbortController();

    setError(null);

    // our search query is mobile_number (the name of the column in the reservations table)
    // the search value is our mobileNumber state
    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  }

  const searchResultsBodyDisplay = () => {
    return reservations.length > 0 ? (
      reservations.map((reservation) => (
        <ReservationRow
          key={reservation.reservation_id}
          reservation={reservation}
        />
      ))
    ) : (
      <p>No reservations found</p>
    );
  };

  return (
    <div>
      <form>
        <ErrorAlert error={error} />
        <label htmlFor="mobile_number">Enter a customer's phone number:</label>
        <input
          name="mobile_number"
          id="mobile_number"
          type="tel"
          onChange={handleChange}
          value={mobileNumber}
          required
        />

        <button type="submit" onClick={handleSubmit}>
          Find
        </button>
      </form>
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th scope="col">Edit</th>
            <th scope="col">Cancel</th>
            <th scope="col">Seat</th>
          </tr>
        </thead>

        <tbody>{searchResultsBodyDisplay()}</tbody>
      </table>
    </div>
  );
}
