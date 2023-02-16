import React from "react";

// pass in reservation as a prop!
export default function ReservationRow({ reservation }) {
  // aka return nothing if no reservation
  if (!reservation) return null;

  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>

      {/* list out the reservation details on the table display */}
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>{reservation.status}</td>

      {/* a "seat" button. */}
      <td>
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button type="button">Seat</button>
        </a>
      </td>
    </tr>
  );
}
