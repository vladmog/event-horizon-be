const express = require('express');
const apiRouter = require('../api-router.js');
const server = express();
const cors = require("cors");

let whitelist = [
    "http://localhost:3000", 
    "https://master.d2mghrfmlzseon.amplifyapp.com"
]

server.use(cors({ origin: whitelist }));
server.use(express.json());
server.use('/api', apiRouter);

module.exports = server