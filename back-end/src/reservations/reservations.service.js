const knex = require("../db/connection");

const tableName = "reservations";

function list(query) {
  const dateFormat =
    /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
  if (!query.match(dateFormat)) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${query.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_time", "asc");
  }
  return knex(tableName)
    .select("*")
    .where({ reservation_date: query })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time", "asc");
}

function create(reservation) {
  return knex(tableName).insert(reservation).returning("*");
}

function find(reservation_id) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id: reservation_id })
    .first();
}

function updateStatus(reservationId, status) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id: reservationId })
    .update({ status: status }, "*");
}

function edit(data) {
  return knex(tableName).where({ reservation_id: data.reservation_id }).update(
    {
      first_name: data.first_name,
      last_name: data.last_name,
      mobile_number: data.mobile_number,
      reservation_date: data.reservation_date,
      reservation_time: data.reservation_time,
      people: data.people,
    },
    "*"
  );
}

module.exports = {
  create,
  list,
  find,
  edit,
  updateStatus,
};
