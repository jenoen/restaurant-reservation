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
  req.body.data.status = "booked";

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

/**
 * Responds/send with a particular reservation.
 */
async function find(req, res) {
  // const reservationId = req.params.reservation_id;
  // const reservation = await service.find(reservationId);
  // if (reservation) {
  //   return res.json({ data: reservation });
  //   // return next({
  //   //   status: 404,
  //   //   message: `THIS IS THE TEST! reservation_id ${req.params.reservation_id} not found`,
  //   // });
  // }
  // next({
  //   status: 404,
  //   message: `HEY reservation ${reservationId} does not exist`,
  // });

  res.status(200).json({ data: res.locals.reservation });
}

/**
 * Validates, finds, and stores a reservation based off of its ID.
 */
async function validateReservationId(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.find(Number(reservation_id));

  if (!reservation) {
    return next({
      status: 404,
      message: `reservation id ${reservation_id} does not exist`,
    });
  }

  res.locals.reservation = reservation;

  next();
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
async function validateData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "Body must include a data property!" });
  }

  next();
}

// validates the content body itself, to make sure all the req info is there/correct
function validateFirstName(req, res, next) {
  const firstName = req.body.data.first_name;
  if (firstName) {
    return next();
  }
  next({
    status: 400,
    message: "data must have first_name property",
  });
}

function validateLastName(req, res, next) {
  const lastName = req.body.data.last_name;
  if (lastName) {
    return next();
  }
  next({
    status: 400,
    message: "data must have last_name property",
  });
}

function validateMobileNumber(req, res, next) {
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
      message: `reservation_date must be for today or a future date (reminder: the restaurant is closed on Tuesdays.) ${reservationDate} is not a valid reservation date`,
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
      message: `reservation_time must be a future time between 10:30am and 9:30pm, ${reservationTime} is not a valid reservation time`,
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
    // next({
    //   status: 400,
    //   message: `${people} is not a valid entry for number of people`,
    // });
  }
  return next({
    status: 400,
    message: "data must have people property",
  });
}

function hasValidStatus(req, res, next) {
  const status = req.body.data.status;

  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `'status' field cannot be ${req.body.data.status}`,
    });
  }

  next();
  // if (status == "booked" || !status) {
  //   return next();
  // }
  // next({
  //   status: 400,
  //   message: "status cannot be seated or finished",
  // });
}

// check to make sure date is valid (that it's NOT on tuesday and is in future/same day)
function validateReservationDate(reservationDate) {
  const todayParsedString = parseNumerals(
    new Date().toISOString().split("T")[0]
  );
  const reservationDateParsedString = parseNumerals(reservationDate);
  const isNotTuesday =
    toDate(reservationDate).toDateString().substring(0, 3) !== "Tue";

  return (
    reservationDateParsedString.length === 8 &&
    Number(reservationDateParsedString) >= Number(todayParsedString) &&
    isNotTuesday
  );
}

function validateReservationTime(reservationTime, reservationDate) {
  const reservationTimeParsedString = parseNumerals(reservationTime);
  const hour = reservationTimeParsedString.substring(0, 2);
  const minute = reservationTimeParsedString.substring(2, 4);
  const fixedDate = reservationDate + "T" + hour + ":" + minute;
  const fixedReserveDate = new Date(fixedDate);
  const now = new Date();
  const openTime = new Date(fixedReserveDate);
  openTime.setHours(10);
  openTime.setMinutes(30);
  openTime.setSeconds(0);
  const closeTime = new Date(fixedReserveDate);
  closeTime.setHours(21);
  closeTime.setMinutes(30);
  closeTime.setSeconds(0);

  return (
    fixedReserveDate >= openTime &&
    fixedReserveDate <= closeTime &&
    fixedReserveDate >= now
  );
}

// validates that people is an acutal number
function validatePeople(people) {
  // return people && people > 0 && Number.isInteger(people);
  if (typeof people !== "number") {
    return next({ status: 400, message: "'people' field must be a number" });
  }

  if (people < 1) {
    return next({ status: 400, message: "'people' field must be at least 1" });
  }
  return true;
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

module.exports = {
  list: asyncErrorBoundary(list),
  find: [asyncErrorBoundary(validateReservationId), asyncErrorBoundary(find)],
  create: [
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateFirstName),
    asyncErrorBoundary(validateLastName),
    asyncErrorBoundary(validateMobileNumber),
    asyncErrorBoundary(hasReservationDate),
    asyncErrorBoundary(hasReservationTime),
    asyncErrorBoundary(hasPeople),
    asyncErrorBoundary(hasValidStatus),
    asyncErrorBoundary(create),
  ],
  edit: [
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateData),
    asyncErrorBoundary(validateFirstName),
    asyncErrorBoundary(validateLastName),
    asyncErrorBoundary(validateMobileNumber),
    asyncErrorBoundary(hasReservationDate),
    asyncErrorBoundary(hasReservationTime),
    asyncErrorBoundary(hasPeople),
    asyncErrorBoundary(hasValidStatus),
    asyncErrorBoundary(edit),
  ],
  update: [
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(updateStatus),
  ],
};
