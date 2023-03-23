import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { searchPhoneNumber } from "../utils/api";
import ReservationRow from "../dashboard/ReservationRow";

export default function Search() {
  // this state stores the search input
  const [phoneNumber, setPhoneNumber] = useState("");

  // this state will store the search results
  const [reservations, setReservations] = useState([]);

  // and, this state, well, stores an error if we get one
  const [error, setError] = useState(null);

  // formats the phone to readable numbers
  function formatPhoneNumber(value) {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  // stores keystrokes of user from the form, to update the states
  function handleChange({ target }) {
    const formattedPhone = formatPhoneNumber(target.value);
    setPhoneNumber(formattedPhone);
  }

  // submitting form => will validate and make API call to search reservations
  async function handleSubmit(event) {
    event.preventDefault();

    const abortController = new AbortController();

    // setError(null);

    // our search query is mobile_number (the name of the column in the reservations table)
    // the search value is our mobileNumber state
    try {
      const response = await searchPhoneNumber(
        phoneNumber,
        abortController.signal
      );
      setReservations(response);
    } catch (error) {
      setError(error);
      console.error(error);
    }
    // listReservations({ mobile_number: mobileNumber }, abortController.signal)
    //   .then(setReservations)
    //   .catch(setError);

    // return () => abortController.abort();
  }

  // const displaySearchResults = () => {
  //   // returns that if reservations has length/aka is found .. then display the rows
  //   // IF NOT... display "no reservations found"
  //   return reservations.length > 0 ? (
  //     reservations.map((reservation) => (
  //       <ReservationRow
  //         key={reservation.reservation_id}
  //         reservation={reservation}
  //         setError={setError}
  //       />
  //     ))
  //   ) : (
  //     <tr>
  //       <th>No reservations foundddd hee</th>
  //     </tr>
  //   );
  // };

  const displaySearchResults = () => {
    // returns that if reservations has length/aka is found .. then display the rows
    // IF NOT... display "no reservations found"
    return reservations.map((reservation) => (
      <ReservationRow
        key={reservation.reservation_id}
        reservation={reservation}
        setError={setError}
      />
    ));
  };

  return (
    <div>
      <form>
        <h1>Search</h1>
        <ErrorAlert error={error} />
        <label htmlFor="mobile_number">Enter a customer's phone number:</label>
        <input
          name="mobile_number"
          id="mobile_number"
          type="tel"
          onChange={handleChange}
          value={phoneNumber}
          placeholder="eg. (323) 555-0123"
          required
        />

        <button type="submit" class="btn btn-gold" onClick={handleSubmit}>
          Find
        </button>
      </form>

      {reservations.length <= 0 ? (
        <h4>No reservations found</h4>
      ) : (
        <table className="table">
          <thead className="thead-light">
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

          <tbody>{displaySearchResults()}</tbody>
        </table>
      )}
    </div>
  );
}
