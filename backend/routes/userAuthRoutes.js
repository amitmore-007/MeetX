const express = require('express');
const { register, login } = require('../controllers/userAuthController');
const { validateRegister, validateLogin } = require('../validators/userAuthValidators');

const router = express.Router();

router.post('/register', validateRegister, register);

router.post('/login', validateLogin, login);

module.exports = router;
