// new component for creating a new reservation
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert.js";
import {
  createReservation,
  editReservation,
  listReservations,
} from "../utils/api";

// name of new component NewReservation:
export default function NewReservation({ edit, reservations, loadDashboard }) {
  const history = useHistory();
  const { reservation_id } = useParams();

  // holds the new reservation form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });
  // another state to hold errors
  const [errors, setErrors] = useState([]);
  const [apiError, setApiError] = useState(null); // if error in API call
  const [reservationsError, setReservationsError] = useState(null); // if error in reservations

  /**
   * Make an API call to get all reservations if we are editing, filling in the form.
   */
  // to load the "reservation to edit"
  // if EDIT form is passed in as true
  useEffect(() => {
    if (edit) {
      // if either of these don't exist, we cannot continue.
      if (!reservations || !reservation_id) return null;

      // let's try to find the corresponding reservation:
      const foundReservation = reservations.find(
        (reservation) => reservation.reservation_id === Number(reservation_id)
      );

      // if it doesn't exist, or the reservation isnt booked, we cannot edit.
      if (!foundReservation || foundReservation.status !== "booked") {
        return <p>Only booked reservations can be edited.</p>;
      }

      const date = new Date(foundReservation.reservation_date);
      const dateString = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;

      // if foundReservation, set the form fields with the pre-existing data
      setFormData({
        first_name: foundReservation.first_name,
        last_name: foundReservation.last_name,
        mobile_number: foundReservation.mobile_number,
        // reservation_date: foundReservation.reservation_date,
        reservation_date: dateString,
        reservation_time: foundReservation.reservation_time,
        people: foundReservation.people,
        reservation_id: foundReservation.reservation_id,
      });
    }
  }, [edit, reservation_id]);

  // setting the form/card data (this records your keystroke but it doesn't save until SUBMIT)
  // aka everytime a user makes a change to an input, we want to record that as a state.
  const handleChange = ({ target }) => {
    if (target.name === "mobile_number") {
      const formatted = formatPhoneNumber(target.value);
      setFormData({
        ...formData,
        [target.name]: formatted,
      });
    } else if (target.name === "people") {
      let newValue = Number(target.value);
      if (newValue === "") {
        newValue = 5;
      }
      setFormData({
        ...formData,
        [target.name]: newValue,
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };

  // formats the phone number nicely
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

  //   this is a function that records the submission.
  function handleSubmit(event) {
    event.preventDefault(); // prevents from refreshing the entire page.
    const abortController = new AbortController();

    const foundErrors = [];
    console.log("edit", edit);
    console.log("reservations", reservations);
    console.log("formData", formData);

    // the push function will "push" the user to reservation date if validation passes
    if (validateFields(foundErrors) && validateDate(foundErrors)) {
      if (edit) {
        editReservation(reservation_id, formData, abortController.signal)
          .then(loadDashboard)
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(setApiError);
      } else {
        createReservation(formData, abortController.signal)
          .then(loadDashboard)
          .then(() =>
            history.push(`/dashboard?date=${formData.reservation_date}`)
          )
          .catch(setApiError);
      }
    }

    setErrors(foundErrors);
    return () => abortController.abort();
  }

  // validate that all fields are filled in
  function validateFields(foundErrors) {
    for (const field in formData) {
      if (formData[field] === "") {
        foundErrors.push({
          message: `${field.split("_").join(" ")} cannot be left blank.`,
        });
      }
    }

    if (formData.people <= 0) {
      foundErrors.push({ message: "Party must be a size of at least 1." });
    }

    if (foundErrors.length > 0) {
      return false;
    }
    return true;
  }

  // validate date function - make sure date is NOT reserved on Tuesdays
  function validateDate(foundErrors) {
    const reserveDate = new Date(
      `${formData.reservation_date}T${formData.reservation_time}:00.000`
    );

    // compare the reservation date to today's date.
    const todaysDate = new Date();

    // // array to hold multiple errors
    // const foundErrors = [];

    // if the Date class returns Tues/2 >> push error
    // (0 is sunday, 6 is saturday)
    if (reserveDate.getDay() === 2) {
      foundErrors.push({
        message:
          "Whoops sorry! Reservations cannot be made on a Tuesday - we are closed :)",
      });
    }

    // if reserveDate is BEFORE todays >> push error
    if (reserveDate < todaysDate) {
      foundErrors.push({
        message: "Whoops sorry! Reservations cannot be made in the past.",
      });
    }

    // in english: if it is before 10:30am...
    // in code: if the hour is not yet 10 or the hour is 10 but below 30 minutes...
    if (
      reserveDate.getHours() < 10 ||
      (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)
    ) {
      foundErrors.push({
        message:
          "Reservations must be made during our business hours! (We open at 10:30am)",
      });
    }

    // in english: if it is after 10:30pm...
    // if the hour is after 22 or the hour is 22 and after 30 minutes...
    else if (
      reserveDate.getHours() > 22 ||
      (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)
    ) {
      foundErrors.push({
        message:
          "Reservation cannot be made after closing hours! (We close at 10:30pm)",
      });
    }

    // in english: if it is after 9:30pm...
    // if the hour is after 21 or the hour is 21 and after 30 minutes...
    else if (
      reserveDate.getHours() > 21 ||
      (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)
    ) {
      foundErrors.push({
        message:
          "Reservation cannot be made: Reservation must be made at least an hour before closing (10:30pm).",
      });
    }

    // aka our dates not NOT valid
    if (foundErrors.length > 0) {
      return false;
    }
    // aka our dates are valid!
    return true;
  }

  // function to display the errors we have received - to be inserted with "form component"
  const displayErrors = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
  };

  return (
    <form>
      {displayErrors()}
      <ErrorAlert error={apiError} />
      <ErrorAlert error={reservationsError} />
      {/* First Name */}
      <label htmlFor="first_name">First Name: &nbsp;</label>
      <input
        name="first_name"
        id="first_name"
        type="text"
        onChange={handleChange} // we will add this in soon!
        value={formData.first_name} // this as well!
        required // this will make the field non-nullable
      />

      {/* Last Name */}
      <label htmlFor="last_name">Last Name: &nbsp;</label>
      <input
        name="last_name"
        id="last_name"
        type="text"
        onChange={handleChange} // we will add this in soon!
        value={formData.last_name} // this as well!
        required // this will make the field non-nullable
      />

      {/* Mobile Number */}
      <label htmlFor="mobile_number">Phone Number:&nbsp;</label>
      <input
        name="mobile_number"
        id="mobile_number"
        type="text"
        onChange={handleChange} // we will add this in soon!
        value={formData.mobile_number} // this as well!
        required // this will make the field non-nullable
      />

      {/* Date of reservation */}
      <label htmlFor="reservation_date">Reservation Date:&nbsp;</label>
      <input
        name="reservation_date"
        id="reservation_date"
        type="date"
        onChange={handleChange} // we will add this in soon!
        value={formData.reservation_date} // this as well!
        required // this will make the field non-nullable
      />

      {/* Time of reservation */}
      <label htmlFor="reservation_time">Reservation Time:&nbsp;</label>
      <input
        name="reservation_time"
        id="reservation_time"
        type="time"
        onChange={handleChange} // we will add this in soon!
        value={formData.reservation_time} // this as well!
        required // this will make the field non-nullable
      />

      {/* Number of ppl in party */}
      <label htmlFor="people">Party Size:&nbsp;</label>
      <input
        name="people"
        id="people"
        type="number"
        onChange={handleChange} // we will add this in soon!
        value={formData.people} // this as well!
        required // this will make the field non-nullable
      />

      {/* button for submit*/}
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      {/* button for cancel*/}
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
