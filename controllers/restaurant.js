const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const Restaurant = require('../models/Restaurant');

const createRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { name, description, logo, address, types } = req.body;

    const restaurant = await Restaurant.create({
        name: name,
        description: description,
        logo: logo,
        address: {
            location: {
                type: address.location.type,
                coordinates: address.location.coordinates
            },
            city: address.city,
            district: address.district,
            street: address.street
        },
        types: types
    });

    if (!restaurant) {
        return next(new CustomError("Please check your inputs", 400));
    }

    return res.status(200).json({
        success: true,
        data: restaurant
    })
});

const getAllRestaurants = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).json(res.queryResults);
});

module.exports = { createRestaurant, getAllRestaurants };