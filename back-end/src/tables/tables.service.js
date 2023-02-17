const knex = require("../db/connection");

const tableName = "tables";

function list() {
  return knex(tableName).select("*");
}

function create(table) {
  return knex(tableName).insert(table).returning("*");
}

module.exports = {
  list,
  create,
};
