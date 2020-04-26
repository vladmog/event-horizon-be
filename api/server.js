const express = require('express');
const apiRouter = require('../api-router.js');
const server = express();
const cors = require("cors");


server.use(cors({ origin: 'https://master.d2mghrfmlzseon.amplifyapp.com/' }));
server.use(express.json());
server.use('/api', apiRouter);

module.exports = server