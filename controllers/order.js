const asyncErrorWrapper = require('express-async-handler');
const Order = require('../models/Order');
const CustomError = require('../helpers/error/CustomError');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const createOrder = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant } = req;
    const { menuIds } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new CustomError("Internal Server Error.", 500));
    }

    // menuIds dizisini kullanarak items alanını oluştur
    const items = menuIds.map(menuId => ({ menu: menuId }));

    const order = await Order.create({
        user: user._id,
        restaurant: restaurant._id,
        items: items,
    });

    if (!order) {
        return next(new CustomError("Please check your inputs", 400));
    }

    // user.orders array update
    user.orders.push(order._id);
    await user.save();

    // restaurant.orders array update
    restaurant.orders.push(order._id);
    await restaurant.save();

    return res.status(200).json({
        success: true,
        data: order
    })
});

const deleteOrder = asyncErrorWrapper(async (req, res, next) => {

    const { order, user } = req;

    // Siparişi sil
    const deletedOrder = await Order.findByIdAndDelete(order._id);
    if (!deletedOrder) {
        return next(new CustomError("Internal server error. Order delete failed.", 500));
    }

    // Kullanıcının orders listesinden siparişi kaldır
    user.orders = user.orders.filter(orderId => orderId.toString() !== order._id.toString());
    await user.save();

    // Restoranın orders listesinden siparişi kaldır (Eğer orders listesi varsa)
    if (order.restaurant) {
        const restaurant = await Restaurant.findById(order.restaurant);

        if (restaurant) {
            restaurant.orders = restaurant.orders.filter(orderId => orderId.toString() !== order._id.toString());
            await restaurant.save();
        }
    }

    return res.status(200).json({
        success: true,
        data: "Order deleted successfully"
    })
});

module.exports = { createOrder, deleteOrder };