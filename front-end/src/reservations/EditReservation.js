import React, { useState, useEffect } from "react";

import ReserveForm from "./ReserveForm";

function EditReservation() {
  return (
    // Form Component
    <ReserveForm create={false} />
  );
}

export default EditReservation;
