import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

// pass in reservation as a prop!
export default function ReservationRow({ reservation, loadDashboard }) {
  // aka return nothing if no reservation OR if reservation is finished ... we dont want it shown on dashboard
  if (!reservation || reservation.status === "finished") return null;

  /**
   * This function is called if the user wants to cancel a reservation.
   */
  function handleCancel() {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      // api call will go here eventually
      const abortController = new AbortController();

      updateReservationStatus(
        reservation.reservation_id,
        "cancelled",
        abortController.status
      ).then(loadDashboard);

      return () => abortController.abort();
      // window.location.reload();
    }
  }

  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>

      {/* list out the reservation details on the table display */}
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>

      {/* button to edit */}
      <td>
        <a href={`/reservations/${reservation.reservation_id}/edit`}>
          <button type="button">Edit</button>
        </a>
      </td>
      {/* button to cancel */}
      <td>
        {/* the cancel button requires a data-reservation-id-cancel attribute for the tests */}
        <button
          type="button"
          onClick={handleCancel}
          data-reservation-id-cancel={reservation.reservation_id}
        >
          Cancel
        </button>
      </td>

      {/* a "seat" button thats displayed when reservation is booked. */}
      {reservation.status === "booked" && (
        <td>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button type="button">Seat</button>
          </a>
        </td>
      )}
    </tr>
  );
}
