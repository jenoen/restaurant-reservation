/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

// const {
//   DATABASE_URL = "postgresql://postgres@localhost/postgres",
//   DATABASE_URL_DEVELOPMENT = "postgresql://postgres@localhost/postgres",
//   DATABASE_URL_TEST = "postgresql://postgres@localhost/postgres",
//   DATABASE_URL_PREVIEW = "postgresql://postgres@localhost/postgres",
//   DEBUG,
// } = process.env;

const {
  DATABASE_URL = "postgres://cotkzwzs:Wh_tv1FVyy-w63K8rJdJo_p5-Pi-KUW1@kashin.db.elephantsql.com/cotkzwzs",
  DATABASE_URL_DEVELOPMENT = "postgres://kbopxmcv:Bz9zC2rz6_a17dL83DVzbbb4K1rhBz3Z@kashin.db.elephantsql.com/kbopxmcv",
  DATABASE_URL_TEST = "postgres://nphtwxfp:KjiQvb7jCsADOkihLpveMuk1rdeITX7J@kashin.db.elephantsql.com/nphtwxfp",
  DATABASE_URL_PREVIEW = "postgres://aivsyovh:7JJAIFNvcuhjjf1dzKaVE7YvSltE6kx4@kashin.db.elephantsql.com/aivsyovh",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
