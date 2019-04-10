const express = require('express');
// const User = require('../models/User');
const userController = require('../controllers/UserController');

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
