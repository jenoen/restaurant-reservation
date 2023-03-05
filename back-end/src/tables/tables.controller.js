const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const response = await service.list();
  res.json({ data: response });
}

// creates a table
async function create(req, res, next) {
  // adds status that it's a "free" table
  req.body.data.status = "free";
  const data = req.body.data;

  // creates the table
  const response = await service.create(data);

  return res.status(201).json({
    data: response[0],
  });
}

// to update the tables whether/if it's not already seated
async function update(req, res, next) {
  // const table = res.locals.table;
  // const data = req.body.data;
  // Object.keys(data).forEach((key, i) => {
  //   table[key] = Object.values(data)[i];
  // });
  // const response = await service.updateTable(
  //   table.table_id,
  //   data.reservation_id
  // );
  // if (res.locals.reservation.status === "booked") {
  //   await service.updateReservationStatus(table.reservation_id, "seated");
  // }
  // if (res.locals.reservation.status === "seated") {
  //   next({
  //     status: 400,
  //     message: "status cannot be updated from seated",
  //   });
  // }
  // return res.json({
  //   data: response[0],
  // });

  await service.updateTable(
    res.locals.table.table_id,
    res.locals.reservation.reservation_id
  );
  await service.updateReservationStatus(
    res.locals.reservation.reservation_id,
    "seated"
  );

  res.status(200).json({ data: { status: "seated" } });
}

// finish a table
// AKA update the reservation status and update table status

async function free(req, res, next) {
  const tableId = req.params.table_id;

  // RESERVATION UPDATE : resets the res status to finish
  await service.updateReservationStatus(
    res.locals.table.reservation_id,
    "finished"
  );
  // THEN TABLE UPDATE : reset table's res id to null and table status is "free"
  const response = await service.free(tableId);
  console.log("req.params.table_id", req.params.table_id);
  console.log("response", response);

  // console.log("response[0]", response[0]);
  // console.log("data: response[0]", { data: response[0] });

  res.status(200).json({
    data: response,
  });
}

// VALIDATIONS!
// checks if it even has data inputed by user
function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "body must have data property",
  });
}

// checks if body has reservation id included
async function validateReservationId(req, res, next) {
  const { reservation_id } = req.body.data;

  // if there's no id in body...
  if (!reservation_id) {
    return next({
      status: 400,
      message: `reservation_id field must be included in the body`,
    });
  }

  // check if res id even exists
  const reservation = await service.read(Number(reservation_id));
  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id ${reservation_id} does not exist`,
    });
  }

  res.locals.reservation = reservation;

  next();
}

// check if body has table name
function hasTableName(req, res, next) {
  const tableName = req.body.data.table_name;

  // if does NOT have name OR is blank
  if (!req.body.data.table_name || req.body.data.table_name === "") {
    return next({ status: 400, message: "'table_name' field cannot be empty" });
  }

  if (req.body.data.table_name.length < 2) {
    return next({
      status: 400,
      message: "'table_name' field must be at least 2 characters",
    });
  }

  next();
}

// checks if body has a valid capacity/number of people at table
function hasCapacity(req, res, next) {
  const capacity = req.body.data.capacity;

  // if does NOT have capacity OR is blank
  if (!req.body.data.capacity || req.body.data.capacity === "") {
    return next({ status: 400, message: "'capacity' field cannot be empty" });
  }

  // if the capacity is NOT a number
  if (typeof req.body.data.capacity !== "number") {
    return next({ status: 400, message: "'capacity' field must be a number" });
  }

  // if the capacity is less than 1
  if (req.body.data.capacity < 1) {
    return next({
      status: 400,
      message: "'capacity' field must be at least 1",
    });
  }

  next();
}

/**
 * Validates, finds, and stores a table based off of its ID.
 */
async function validateTableId(req, res, next) {
  const { table_id } = req.params;
  const table = await service.find(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `table id ${table_id} does not exist`,
    });
  }

  res.locals.table = table;

  next();
}

/**
 * Validates a seat request to make sure it IS ALLOWED! in terms of
 * 1) table availability
 * 2) reservation already seated or not
 * 3) max capacity of table
 */
async function validateSeat(req, res, next) {
  if (res.locals.table.status === "occupied") {
    return next({
      status: 400,
      message: "the table you selected is currently occupied",
    });
  }

  if (res.locals.reservation.status === "seated") {
    return next({
      status: 400,
      message: "the reservation you selected is already seated",
    });
  }

  if (res.locals.table.capacity < res.locals.reservation.people) {
    return next({
      status: 400,
      message: `the table you selected does not have enough capacity to seat ${res.locals.reservation.people} people`,
    });
  }

  next();
}

/**
 * Makes sure table is occupied before finishing a table.
 */
async function validateReadyToFinish(req, res, next) {
  if (res.locals.table.status !== "occupied") {
    return next({ status: 400, message: "this table is not occupied" });
  }

  next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(hasTableName),
    asyncErrorBoundary(hasCapacity),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(hasData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateTableId),
    asyncErrorBoundary(validateSeat),
    asyncErrorBoundary(update),
  ],
  free: [
    asyncErrorBoundary(validateTableId),
    asyncErrorBoundary(validateReadyToFinish),
    asyncErrorBoundary(free),
  ],
};
