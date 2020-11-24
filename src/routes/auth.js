const express = require('express');
const router = express.Router();
const authContoller = require('../controllers/auth');
const { runValidation, validationList,validationLogin} = require('../services/authValidation');
const middleware = require('../middleware/loginMiddleware');

router.post('/login',validationLogin, runValidation, authContoller.login);
router.post('/register',validationList,runValidation, authContoller.register);
router.get('/user', middleware, authContoller.getUser);

module.exports = router;