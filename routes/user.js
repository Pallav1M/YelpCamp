const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync')
const User = require('../models/user');
const users = require('../controllers/users.js');

// RENDER USER REGISTER
router.route('/register')
    .get(users.renderRegister)
    // REGISTER NEW USER
    // go to localhost:3000/register to register a new user
    // Reuse the username to see the error message
    .post(catchAsync(users.registerNewUser));

router.route('/login')
    // RENDER LOGIN FORM
    .get(users.renderLogin)
    // LOGIN 
    // go to localhost:3000/login to login. Use the same username and password you used while registering. Else, it displays an error message
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// LOGOUT 
router.get('/logout', users.logout);

module.exports = router;

