// new component for creating a new reservation
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert.js";

// name of new component NewReservation:
export default function NewReservation() {
  const history = useHistory();

  // holds the new reservation form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  // another state to hold errors
  const [errors, setErrors] = useState([]);

  // setting the form/card data (this records your keystroke but it doesn't save until SUBMIT)
  // aka everytime a user makes a change to an input, we want to record that as a state.
  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  //   this is a function that records the submission.
  function handleSubmit(event) {
    event.preventDefault(); // prevents from refreshing the entire page.

    const foundErrors = [];

    // the push function will "push" the user to reservation date if validation passes
    if (validateFields(foundErrors) && validateDate(foundErrors)) {
      history.push(`/dashboard?date=${formData.reservation_date}`);
    }

    setErrors(foundErrors);
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
      <label htmlFor="first_name">Last Name: &nbsp;</label>
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
        type="tel"
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
