const express = require('express');
const router = express.Router();

const UsersRouter = require('./router/users-router.js');
router.use('/users', UsersRouter)

module.exports = router;