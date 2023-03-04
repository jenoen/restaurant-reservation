const knex = require("../db/connection");

const tableName = "tables";

function list() {
  return knex(tableName).select("*").orderBy("table_name");
}

function create(table) {
  return knex(tableName).insert(table, "*");
  // .returning("*");
}

// finds specific reservation
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

// finds specific table
function find(tableId) {
  return knex(tableName).select("*").where({ table_id: tableId }).first();
}

// update the table with the new reservation id associated :: occupied table
function updateTable(table_id, reservation_id) {
  return knex(tableName)
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, status: "occupied" }, "*");
}

// update the reservation that it has been seated
function updateReservationStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id: reservation_id })
    .update({ status: status });
}


// resets res id associated to table and table status = free
function free(tableId) {
  return knex(tableName)
    .where({ table_id: tableId })
    .update({ reservation_id: null, status: "free" });
}

module.exports = {
  list,
  create,
  find,
  read,
  updateTable,
  updateReservationStatus,
  free,
};
