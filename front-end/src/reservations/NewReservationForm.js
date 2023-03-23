// new component for creating a new reservation
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert.js";
import { createReservation } from "../utils/api";
import ReserveForm from "./ReserveForm.js";

// name of new component NewReservation:
export default function NewReservation() {
  return (
    // form component
    <div>
      <h1>New Reservation</h1>
      <ReserveForm create={true} />
    </div>
  );
}
