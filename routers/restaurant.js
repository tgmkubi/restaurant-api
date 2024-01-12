const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { getAccessToRoute, getAdminAccess } = require('../middlewares/authorization/auth');
const restaurantQueryMiddleware = require('../middlewares/query/restaurantQueryMiddleware'); // TODO
const { checkRestaurantExist, checkBrancheExist, checkBrancheExistInRestaurant, checkMenuItemsExist, checkMenuItemsExistInRestaurant, checkOrderExist, getPermissionToDeleteOrder } = require('../middlewares/database/databaseErrorHelpers'); // TODO
const { getSingleRestaurantDetail, getAllHighRatingRestaurants, createRestaurant, getAllRestaurants, addBrancheToRestaurant, addMenuItemsToRestaurant } = require('../controllers/restaurant'); // TODO
const { createBranche, deleteBranche, getAllBranchesOfRestaurant, getSingleBrancheDetailOfRestaurant } = require('../controllers/branche');
const { createOrder, deleteOrder } = require('../controllers/order');

router.get('/high-ratings', getAllHighRatingRestaurants);
router.get('/', getAccessToRoute, restaurantQueryMiddleware(Restaurant, {
    population: {
        path: "reviews",
        select: "comment rating",
    }
}), getAllRestaurants);

router.get('/:id', checkRestaurantExist, getSingleRestaurantDetail);
router.get('/:id/branches', checkRestaurantExist, getAllBranchesOfRestaurant);
router.get('/:id/branches/:brancheId', [checkRestaurantExist, checkBrancheExist], getSingleBrancheDetailOfRestaurant)

// Only Users
router.post('/:restaurant_id/orders/createorder', [getAccessToRoute, checkRestaurantExist, checkMenuItemsExist], createOrder);
router.delete('/orders/:orderId', [getAccessToRoute, checkOrderExist, getPermissionToDeleteOrder], deleteOrder);

// Only Admin Users
router.use([getAccessToRoute, getAdminAccess]);
router.post('/createrestaurant', createRestaurant);
router.post('/createbranche', createBranche);
router.put('/:id/addbranchetorestaurant/:brancheId', [checkRestaurantExist, checkBrancheExist, checkBrancheExistInRestaurant], addBrancheToRestaurant);
router.delete('/:brancheId/deletebranche', checkBrancheExist, deleteBranche);
router.put('/:id/addmenustorestaurant', [checkRestaurantExist, checkMenuItemsExist, checkMenuItemsExistInRestaurant], addMenuItemsToRestaurant);


module.exports = router;