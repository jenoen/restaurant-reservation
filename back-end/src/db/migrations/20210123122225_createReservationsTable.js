// purpose: to define the table and the columns
// this function is called whenever we run a migration

exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary().notNullable(); // Sets `reservation_id` as the primary key
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("mobile_number").notNullable();
    table.date("reservation_date").notNullable();
    table.time("reservation_time").notNullable();
    table.integer("people").notNullable();
    // table.string("status").notNullable();
    table.timestamps(true, true); // Adds created_at and updated_at columns
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
