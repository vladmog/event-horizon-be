// const knex = require("knex")({ client: "sqlite" });

// module.exports = knex;

const knex = require("knex");
const knexConfig = require("../knexfile.js");
console.log("knexConfig.development", knexConfig.development);

module.exports = knex(knexConfig.development);
