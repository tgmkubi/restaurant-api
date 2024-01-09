const express = require('express');
const router = express.Router();

const user = require('./user'); // OK
const auth = require('./auth'); // OK
const restaurant = require('./restaurant'); // TODO
const menu = require('./menu');

router.use('/users', user);
router.use('/auth', auth);
router.use('/restaurants', restaurant);
router.use('/menu', menu);

module.exports = router;