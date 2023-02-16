import React from "react";

// pass in reservation as a prop!
export default function ReservationRow({ reservation }) {
  // aka return nothing if no reservation OR if reservation is finished ... we dont want it shown on dashboard
  if (!reservation || reservation.status === "finished") return null;

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
