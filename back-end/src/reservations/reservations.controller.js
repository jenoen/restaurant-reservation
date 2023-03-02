/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// // TO LIST ALL THE RESERVATIONS (could be searched by specified variables)
// // could be edit in this section to similar to dj
async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;

  const reservations = await service.list(date, mobile_number);
  const response = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );

  res.json({ data: response });
}

// async function list(req, res, next) {
//   const query = req.query.date || req.query.mobile_number;
//   const data = await service.list(query);
//   res.json({ data });
// }

// creates the reservation!!
async function create(req, res) {
  const response = await service.create(req.body.data);

  // when knex creates things, it'll return something in the form of an array. we only want the first object, so i access the 0th index here
  res.status(201).json({ data: response[0] });
}

/**
 * Edit the data of a reservation.
 */
async function edit(req, res) {
  const response = await service.edit(req.body.data);

  res.status(200).json({ data: response[0] });
}

// finds specific reservation
async function find(req, res, next) {
  const reservationId = req.params.reservation_id;
  const reservation = await service.find(reservationId);
  // console.log("reservations");
  if (reservation[0]) {
    return res.json({ data: reservation[0] });
  }
  next({
    status: 404,
    message: `reservation ${reservationId} does not exist`,
  });
}

// updates the status
async function updateStatus(req, res, next) {
  const reservationId = req.params.reservation_id;
  const status = req.body.data.status;
  const updatedReservation = await service.updateStatus(reservationId, status);
  res.json({
    data: updatedReservation[0],
  });
}

/**
 * validates the data object that the user inputs even exists.
 */
async function hasData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Body must include a data property!" });
  }

  next();
}

// validates the content body itself, to make sure all the req info is there/correct
function hasFirstName(req, res, next) {
  const firstName = req.body.data.first_name;
  if (firstName) {
    return next();
  }
  next({
    status: 400,
    message: "data must have first_name property",
  });
}

function hasLastName(req, res, next) {
  const lastName = req.body.data.last_name;
  if (lastName) {
    return next();
  }
  next({
    status: 400,
    message: "data must have last_name property",
  });
}

function hasMobileNumber(req, res, next) {
  const mobileNumber = req.body.data.mobile_number;
  if (mobileNumber) {
    return next();
  }
  return next({
    status: 400,
    message: "data must have mobile_number property",
  });
}

function hasReservationDate(req, res, next) {
  const reservationDate = req.body.data.reservation_date;
  if (reservationDate) {
    if (validateReservationDate(reservationDate)) {
      return next();
    }
    next({
      status: 400,
      message: `reservation_date must be today or a future date and the restaurant is closed on Tuesday, ${reservationDate} is not a valid reservation date`,
    });
  }
  return next({
    status: 400,
    message: "data must have reservation_date property",
  });
}

function hasReservationTime(req, res, next) {
  const reservationTime = req.body.data.reservation_time;
  const reservationDate = req.body.data.reservation_date;
  if (reservationTime) {
    if (validateReservationTime(reservationTime, reservationDate)) {
      return next();
    }
    next({
      status: 400,
      message: `reservation_time must be a future time after 10:30am and prior to 9:30pm, ${reservationTime} is not a valid reservation time`,
    });
  }
  return next({
    status: 400,
    message: "data must have reservation_time property",
  });
}

function hasPeople(req, res, next) {
  const people = req.body.data.people;
  if (people) {
    if (validatePeople(people)) {
      return next();
    }
    next({
      status: 400,
      message: `${people} is not a valid entry for number of people`,
    });
  }
  return next({
    status: 400,
    message: "data must have people property",
  });
}

function hasValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (status == "booked" || !status) {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be seated or finished",
  });
}

async function hasReservationId(req, res, next) {
  const reservation = await service.find(req.params.reservation_id);
  if (reservation.length > 0) {
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${req.params.reservation_id} not found`,
  });
}

// // makes sure phone number is written / filled out correctly
// function validateMobileNumber(mobileNumber) {
//   const numericMobileNumber = parseNumerals(mobileNumber);
//   console.log("oopsies");
//   return (
//     numericMobileNumber.length === 10 &&
//     numericMobileNumber.match(/^[0-9]+$/) != null
//   );
// }

// check to make sure date is correct
function validateReservationDate(reservationDate) {
  const todayParsedString = parseNumerals(
    new Date().toISOString().split("T")[0]
  );
  const reservationDateParsedString = parseNumerals(reservationDate);
  const isNotTuesday =
    toDate(reservationDate).toDateString().substring(0, 3) !== "Tue";

  // if (
  //   reservationDateParsedString.length === 8 &&
  //   Number(reservationDateParsedString) >= Number(todayParsedString) &&
  //   isNotTuesday
  // ) {
  //   return next({
  //     status: 400,
  //     message: "'reservation_date' field: restauraunt is closed on tuesday",
  //   });
  // }
  return (
    reservationDateParsedString.length === 8 &&
    Number(reservationDateParsedString) >= Number(todayParsedString) &&
    isNotTuesday
  );
}

function validateReservationTime(reservationTime, reservationDate) {
  const reservationTimeParsedString = parseNumerals(reservationTime);
  reservationDate = new Date(reservationDate);
  reservationDate.setHours(reservationTimeParsedString.substring(0, 2));
  reservationDate.setMinutes(reservationTimeParsedString.substring(2, 4));
  const now = new Date();
  const openTime = new Date(reservationDate);
  openTime.setHours(10);
  openTime.setMinutes(30);
  openTime.setSeconds(0);
  const closeTime = new Date(reservationDate);
  closeTime.setHours(21);
  closeTime.setMinutes(30);
  closeTime.setSeconds(0);
  return (
    reservationDate >= openTime &&
    reservationDate <= closeTime &&
    reservationDate >= now
  );
}

// validates that people is an acutal number
function validatePeople(people) {
  return people && people > 0 && Number.isInteger(people);
}

//reformat numbers to only integers for checks
function parseNumerals(string) {
  return string.replace(/\D/g, "");
}

function toDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return new Date(year, month - 1, day);
  // return new Date(year, month, day);
}

async function validateStatus(req, res, next) {
  const reservation = await service.find(req.params.reservation_id);
  if (req.body.data.status !== "unknown") {
    if (
      reservation[0].status === "booked" ||
      reservation[0].status === "seated"
    ) {
      return next();
    }
    next({
      status: 400,
      message: `status ${reservation[0].status} cannot be updated`,
    });
  }
  next({
    status: 400,
    message: `status cannot be ${req.body.data.status}`,
  });
}

// function validateDate(req, res, next) {
//   const reserveDate = new Date(
//     `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`
//   );
//   const todaysDate = new Date();

//   // checks if the date is on a Tuesday...
//   if (reserveDate.getDay() === 2) {
//     return next({
//       status: 400,
//       message: "'reservation_date' field: restauraunt is closed on tuesday",
//     });
//   }

//   // checks if intended reservation is in the past
//   if (reserveDate < todaysDate) {
//     return next({
//       status: 400,
//       message:
//         "'reservation_date' and 'reservation_time' field must be in the future",
//     });
//   }

//   // checks if intended reservation is before 10:30am
//   if (
//     reserveDate.getHours() < 10 ||
//     (reserveDate.getHours() === 10 && reserveDate.getMinutes() < 30)
//   ) {
//     return next({
//       status: 400,
//       message: "'reservation_time' field: restaurant is not open until 10:30AM",
//     });
//   }

//   // checks if intended reservation is after 10:30pm
//   if (
//     reserveDate.getHours() > 22 ||
//     (reserveDate.getHours() === 22 && reserveDate.getMinutes() >= 30)
//   ) {
//     return next({
//       status: 400,
//       message: "'reservation_time' field: restaurant is closed after 10:30PM",
//     });
//   }

//   // checks if intended reservation is at least before 9:30p
//   if (
//     reserveDate.getHours() > 21 ||
//     (reserveDate.getHours() === 21 && reserveDate.getMinutes() > 30)
//   ) {
//     return next({
//       status: 400,
//       message:
//         "'reservation_time' field: reservation must be made at least an hour before closing (10:30PM)",
//     });
//   }

//   next();
// }

// // validates the reservation ID if given that it exists in the database
// async function reservationIdExists(req, res, next) {
//   const { reservation_id } = req.params;
//   const reservation = await service.read(Number(reservation_id));

//   if (!reservation) {
//     return next({
//       status: 404,
//       message: `reservation id ${reservation_id} does not exist`,
//     });
//   }

//   res.locals.reservation = reservation;

//   next();
// }

// // actually obtains the specified reservation
// async function read(req, res) {
//   res.status(200).json({ data: res.locals.reservation });
// }

// // validates the body given in order to update/edit a reservation status that it's correct
// async function validateUpdateBody(req, res, next) {
//   if (!req.body.data.status) {
//     return next({ status: 400, message: "body must include a status field" });
//   }

//   // status MUST be one of the 4 options
//   if (
//     req.body.data.status !== "booked" &&
//     req.body.data.status !== "seated" &&
//     req.body.data.status !== "finished" &&
//     req.body.data.status !== "cancelled"
//   ) {
//     return next({
//       status: 400,
//       message: `'status' field cannot be ${req.body.data.status}`,
//     });
//   }

//   if (res.locals.reservation.status === "finished") {
//     return next({
//       status: 400,
//       message: `a finished reservation cannot be updated`,
//     });
//   }

//   next();
// }

// /**
//  * actually updates a reservation's status.
//  */
// async function update(req, res) {
//   await service.update(
//     res.locals.reservation.reservation_id,
//     req.body.data.status
//   );

//   res.status(200).json({ data: { status: req.body.data.status } });
// }

module.exports = {
  list: asyncErrorBoundary(list),
  find: asyncErrorBoundary(find),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasPeople,
    hasValidStatus,
    asyncErrorBoundary(create),
  ],
  edit: [
    asyncErrorBoundary(hasReservationId),
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    hasReservationTime,
    hasPeople,
    hasValidStatus,
    asyncErrorBoundary(edit),
  ],
  update: [
    asyncErrorBoundary(hasReservationId),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(updateStatus),
  ],
};
