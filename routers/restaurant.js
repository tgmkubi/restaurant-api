const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const restaurantQueryMiddleware = require('../middlewares/query/restaurantQueryMiddleware'); // TODO
const { checkRestaurantExist } = require('../middlewares/database/databaseErrorHelpers'); // TODO
const { createRestaurant, getAllRestaurants } = require('../controllers/restaurant'); // TODO
const { createBranche } = require('../controllers/branche');

// OK
router.get('/', getAccessToRoute, restaurantQueryMiddleware(Restaurant, {
    population: {
        path: "reviews",
        select: "comment rating",
    }
}), getAllRestaurants);

// Only Admin Users
router.use([getAccessToRoute, getAdminAccess]);
router.post('/createrestaurant', createRestaurant);
router.post('/createbranche', createBranche);



module.exports = router;