// const knex = require("knex");
// const knexConfig = require("../knexfile.js");
// console.log("knexConfig.development", knexConfig.development);

// module.exports = knex(knexConfig.development);

require("dotenv").config();

const knex = require("knex");
const environment = process.env.DB_CONNECT || "development";
console.log("environment: ", environment);
const config = require("../knexfile");

module.exports = knex(config[environment]);
