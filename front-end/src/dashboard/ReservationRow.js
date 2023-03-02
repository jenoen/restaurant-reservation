import React from "react";
import { Link, useHistory } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

// pass in reservation as a prop!
export default function ReservationRow({ reservation, tables, setError }) {
  const history = useHistory();

  // formats time nicely
  function simpleTimeFormat(time) {
    let hour = +time.substr(0, 2);
    let newHour = hour % 12 || 12;
    let meridiem = hour < 12 || hour === 24 ? "am" : "pm";
    return `${newHour}${time.substr(2, 3)} ${meridiem}`;
  }

  // shows the status of the reservation and allows to seat the reservation
  function reservationStatus(reservation) {
    let reservation_id = reservation.reservation_id;
    // if (reservation.status === "booked") {
    return (
      // <Link
      //   to={{
      //     pathname: `/reservations/${reservation.reservation_id}/seat`,
      //     state: {
      //       tables: tables,
      //     },
      //   }}
      //   type="button"
      //   className="btn btn-light btn-sm"
      // >
      //   Seat
      // </Link>
      <a href={`/reservations/${reservation_id}/seat`}>
        <button className="btn btn-primary" type="button">
          Seat
        </button>
      </a>
    );
    // }
    // return null;
  }

  // button to edit the reservation
  function editReservation(reservation) {
    if (reservation.status === "booked") {
      return (
        <Link
          to={{
            pathname: `/reservations/${reservation.reservation_id}/edit`,
            state: {
              date: reservation.reservation_date,
            },
          }}
          type="button"
          className="btn btn-light btn-sm"
        >
          Edit
        </Link>
      );
    }
    return null;
  }

  // button to cancel/delete the reservation
  function cancelButton(reservation) {
    if (reservation.status === "booked") {
      return (
        <td data-reservation-id-cancel={reservation.reservation_id}>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => cancelReservation(reservation)}
          >
            Cancel
          </button>
        </td>
      );
    }
    return <td></td>;
  }

  // function that would actually delete the reservation
  async function cancelReservation(reservation) {
    try {
      if (
        window.confirm(
          `Do you want to cancel this reservation? This cannot be undone.`
        )
      ) {
        const abortController = new AbortController();
        const response = await updateReservationStatus(
          reservation,
          "cancelled",
          abortController.signal
        );
        history.go(0);
        return response;
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  }

  // // aka return nothing if no reservation OR if reservation is finished ... we dont want it shown on dashboard
  // if (!reservation || reservation.status === "finished") return null;

  // /**
  //  * This function is called if the user wants to cancel a reservation.
  //  */
  // function handleCancel() {
  //   if (
  //     window.confirm(
  //       "Do you want to cancel this reservation? This cannot be undone."
  //     )
  //   ) {
  //     // api call will go here eventually
  //     const abortController = new AbortController();

  //     updateReservationStatus(
  //       reservation.reservation_id,
  //       "cancelled",
  //       abortController.status
  //     ).then(loadDashboard);

  //     return () => abortController.abort();
  //     // window.location.reload();
  //   }
  // }

  return (
    <tr
      className="text-truncate"
      style={{ height: "48px" }}
      key={reservation.reservation_id}
    >
      <th className="d-none d-md-table-cell" scope="row">
        {reservation.reservation_id}
      </th>
      <td>
        {reservation.first_name} {reservation.last_name}
      </td>
      <td className="d-none d-md-table-cell">{reservation.mobile_number}</td>
      <td>{simpleTimeFormat(reservation.reservation_time)}</td>
      <td className="d-none d-md-table-cell">{reservation.people}</td>
      <td
        className="d-none d-md-table-cell"
        data-reservation-id-status={`${reservation.reservation_id}`}
      >
        {reservation.status}
      </td>
      <td>{reservationStatus(reservation)}</td>
      <td className="d-none d-md-table-cell">{editReservation(reservation)}</td>
      {cancelButton(reservation)}
    </tr>
  );
}
