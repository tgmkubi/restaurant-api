const express = require('express');
const router = express.Router();

const user = require('./user'); // OK
const auth = require('./auth'); // OK
const restaurant = require('./restaurant'); // TODO
const menu = require('./menu');
const review = require('./review');

router.use('/users', user);
router.use('/auth', auth);
router.use('/restaurants', restaurant);
router.use('/menu', menu);

router.use('/reviews', review);

module.exports = router;