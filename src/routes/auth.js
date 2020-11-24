const express = require('express');

const router = express.Router();

const authContoller = require('../controllers/auth');

router.post('/register', authContoller.register);

module.exports = router;