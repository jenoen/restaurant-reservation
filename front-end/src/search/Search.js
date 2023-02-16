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

    // we will be adding our api call here
  }
  return (
    <div>
      <form>
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
    </div>
  );
}
