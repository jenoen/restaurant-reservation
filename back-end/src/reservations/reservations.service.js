const knex = require("../db/connection");

const tableName = "reservations";

// function list(query) {
//   const dateFormat =
//     /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/;
//   if (!query.match(dateFormat)) {
//     return knex("reservations")
//       .whereRaw(
//         "translate(mobile_number, '() -', '') like ?",
//         `%${query.replace(/\D/g, "")}%`
//       )
//       .orderBy("reservation_time", "asc");
//   }
//   return knex(tableName)
//     .select("*")
//     .where({ reservation_date: query })
//     .whereNot({ status: "finished" })
//     .orderBy("reservation_time", "asc");
// }

function list(date, mobile_number) {
  if (date) {
    return knex(tableName)
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc");
  }

  if (mobile_number) {
    return knex(tableName)
      .select("*")
      .where("mobile_number", "like", `${mobile_number}%`);
  }

  return knex(tableName).select("*");
}

function create(reservation) {
  return knex(tableName).insert(reservation).returning("*");
}

function find(reservationId) {
  return knex(tableName)
    .select("*")
    .where({ reservation_id: reservationId })
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
