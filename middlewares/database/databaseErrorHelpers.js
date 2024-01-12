const User = require('../../models/User');
const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../../helpers/error/CustomError');
const Restaurant = require('../../models/Restaurant');
const Branche = require('../../models/Branche');
const Menu = require('../../models/Menu');
const MenuItem = require('../../models/MenuItem');
const Order = require('../../models/Order');

const checkUserExist = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
        return next(new CustomError("There is no user with that id", 400));
    };
    req.user = user;
    return next();
});

const checkRestaurantExist = asyncErrorWrapper(async (req, res, next) => {
    const restaurant_id = req.params.id || req.params.restaurant_id;

    const restaurant = await Restaurant.findById(restaurant_id);

    if (!restaurant) {
        return next(new CustomError("There is no such restaurant with that id"));
    };

    req.restaurant = restaurant;
    return next();
});

const checkBrancheExist = asyncErrorWrapper(async (req, res, next) => {
    const branche_id = req.params.brancheId;

    const branche = await Branche.findById(branche_id);

    if (!branche) {
        return next(new CustomError("There is no such branche with that id"));
    };

    req.branche = branche;
    return next();
});

const checkBrancheExistInRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant, branche } = req;

    if (branche.restaurant && (restaurant._id.toString() === branche.restaurant.toString())) {
        return next(new CustomError("Branche is already exist in this Restaurant's Branches.", 400));
    } else if (branche.restaurant !== undefined) {
        return next(new CustomError("Branche is already exist in another Restaurant's Branches.", 400));
    }

    return next();
});

const checkMenuExist = asyncErrorWrapper(async (req, res, next) => {

    const { menuId } = req.params;

    const menu = await Menu.findById(menuId);

    if (!menu) {
        return next(new CustomError("There is no such menu with that id", 400));
    }

    req.menu = menu;
    return next();
});

const checkMenuItemExist = asyncErrorWrapper(async (req, res, next) => {

    const { menuItemId } = req.params;

    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
        return next(new CustomError("There is no such menu with that id"));
    }

    req.menuItem = menuItem;
    return next();
});


const checkMenuItemsExist = asyncErrorWrapper(async (req, res, next) => {

    const { menuIds } = req.body;

    // Veritabanında bulunan menülerin sayısını al
    const existingMenusCount = await Menu.countDocuments({ _id: { $in: menuIds } });

    // Eğer veritabanında bulunan menülerin sayısı, istenen menü ID'lerinin sayısına eşit değilse, hata fırlat
    if (existingMenusCount !== menuIds.length) {
        return next(new CustomError("One or more menu items do not exist.", 400));
    }

    return next();
});

const checkMenuItemsExistInRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant } = req;
    const { menuIds } = req.body;

    // Restaurant içindeki menülerin ID'lerini al
    const existingMenuIds = restaurant.menu.map(menu => menu.toString());

    // İstekten gelen menuIds dizisi içindeki her bir ID'nin, Restaurant içinde olup olmadığını kontrol et
    const nonExistingMenuIds = menuIds.filter(menuId => !existingMenuIds.includes(menuId));

    // Eğer nonExistingMenuIds dizisi boş değilse, yani bir veya daha fazla ID Restaurat.menu'de varsa, hata fırlat
    if (nonExistingMenuIds.length !== menuIds.length) {
        return next(new CustomError("One or more menu items already exist in the restaurant.", 400));
    }

    // Her şey yolundaysa devam et
    return next();
});

const checkOrderExist = asyncErrorWrapper(async (req, res, next) => {

    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        return next(new CustomError("There is no such order with that id", 400));
    }

    req.order = order;
    return next();
});

const getPermissionToDeleteOrder = asyncErrorWrapper(async (req, res, next) => {

    const { order } = req;

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new CustomError("Internal Server Error.", 500));
    }

    if ((user.role === 'admin' || user.orders.includes(order._id.toString())) === false) {
        return next(new CustomError("You don't have permission to delete this order.", 403));
    }

    req.user = user;

    return next();
});

const checkOrderHasReview = asyncErrorWrapper(async (req, res, next) => {

    if (req.order.review) {
        return next(new CustomError("Review create failed. Order review is already exist. Try to update review.", 400));
    }

    return next();
});

const getOrderOwnerAccess = asyncErrorWrapper(async (req, res, next) => {

    const order = req.order;

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new CustomError("Internal Server Error.", 500));
    }

    if ((order.user.toString() !== user._id) && (user.role !== "admin")) {
        return next(new CustomError("You don't have permission to review this order.", 403));
    }

    req.user = user;
    return next();
});

module.exports = { checkUserExist, checkRestaurantExist, checkBrancheExist, checkBrancheExistInRestaurant, checkMenuExist, checkMenuItemExist, checkMenuItemsExist, checkMenuItemsExistInRestaurant, checkOrderExist, getPermissionToDeleteOrder, checkOrderHasReview, getOrderOwnerAccess };