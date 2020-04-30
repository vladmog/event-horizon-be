const knex = require("knex")({ client: "sqlite" });

module.exports = knex;

// const knex = require('knex')
// const knexConfig = require('../knexfile.js')

// module.exports = knex(knexConfig.development);
