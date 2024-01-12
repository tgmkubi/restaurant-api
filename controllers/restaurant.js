const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const Restaurant = require('../models/Restaurant');

const getSingleRestaurantDetail = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).json({
        success: true,
        data: req.restaurant
    })
});

// const getAllHighRatingRestaurants = asyncErrorWrapper(async (req, res, next) => {
//     const { page = 1, limit = 5 } = req.query;
//     const skip = (page - 1) * limit;

//     try {
//         const restaurants = await Restaurant.aggregate([
//             {
//                 $lookup: {
//                     from: 'reviews',
//                     localField: 'reviews',
//                     foreignField: '_id',
//                     as: 'reviews',
//                 },
//             },
//             {
//                 $addFields: {
//                     averageRating: { $avg: '$reviews.rating' },
//                 },
//             },
//             {
//                 $sort: { averageRating: -1 },
//             },
//             {
//                 $skip: skip,
//             },
//             {
//                 $limit: parseInt(limit),
//             },
//         ]);

//         const totalRestaurants = await Restaurant.countDocuments();

//         const totalPages = Math.ceil(totalRestaurants / limit);

//         const pagination = {
//             total: totalRestaurants,
//             page: parseInt(page),
//             limit: parseInt(limit),
//             previous: page > 1 ? { page: page - 1, limit: parseInt(limit) } : null,
//             next: page < totalPages ? { page: page + 1, limit: parseInt(limit) } : null,
//         };

//         return res.json({
//             success: true,
//             count: restaurants.length,
//             pagination: pagination,
//             data: restaurants,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             error: 'Server Error',
//         });
//     }
// });

const getAllHighRatingRestaurants = asyncErrorWrapper(async (req, res, next) => {
    // const { page = 1, limit = 5, type, search } = req.query;
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    try {
        const matchConditions = {
            averageRating: { $gte: parseInt(req.query.rate) || 4 },
        };

        if (req.query.types) {
            matchConditions.types = { $in: req.query.types.split(',') };
        }

        // if (search) {
        //     matchConditions.$or = [
        //         { types: { $in: ['Fast Food', 'Ev Yemekleri'] } },
        //         { description: { $regex: new RegExp(search, 'i') } },
        //     ];
        // }

        const highRatedRestaurants = await Restaurant.aggregate([
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'reviews',
                    foreignField: '_id',
                    as: 'reviews',
                },
            },
            {
                $addFields: {
                    averageRating: { $avg: '$reviews.rating' },
                },
            },
            {
                $match: matchConditions,
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: parseInt(limit),
            },
            {
                $project: {
                    name: 1,
                    types: 1,
                    description: 1,
                    averageRating: 1,
                },
            },
        ]);

        const totalHighRatedRestaurants = highRatedRestaurants.length;

        const totalPages = Math.ceil(totalHighRatedRestaurants / limit);

        const pagination = {
            total: totalHighRatedRestaurants,
            page: parseInt(page),
            limit: parseInt(limit),
            previous: page > 1 ? { page: page - 1, limit: parseInt(limit) } : null,
            next: page < totalPages ? { page: page + 1, limit: parseInt(limit) } : null,
        };

        return res.json({
            success: true,
            count: totalHighRatedRestaurants,
            pagination: pagination,
            data: highRatedRestaurants,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: 'Server Error',
        });
    }
});


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

const addBrancheToRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant, branche } = req;

    // update restaurant.branches array
    restaurant.branches = [
        ...restaurant.branches,
        branche._id
    ];

    const updatedRestaurant = await restaurant.save({ new: true, runValidators: true });
    if (!updatedRestaurant) {
        return next(new CustomError("Add Brache to Restaurant failed. Internal server error.", 500));
    }

    // update branche.restaurant
    branche.restaurant = restaurant._id;
    const updatedBranche = await branche.save({ new: true, runValidators: true });
    if (!updatedBranche) {
        return next(new CustomError("Branche update failed. Internal server error.", 500));
    }

    await updatedRestaurant.populate('branches');

    const responseData = {
        name: updatedRestaurant.name,
        branches: updatedRestaurant.branches
    };

    return res.status(200).json({
        success: true,
        data: responseData
    })
});

const addMenuItemsToRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant } = req;
    const { menuIds } = req.body;

    restaurant.menu = [
        ...restaurant.menu,
        ...menuIds
    ];

    const updatedRestaurant = await restaurant.save();

    res.status(200).json({
        success: true,
        data: {
            restaurant: {
                name: updatedRestaurant.name,
                menu: updatedRestaurant.menu
            }
        }
    })
});

module.exports = { getSingleRestaurantDetail, getAllHighRatingRestaurants, createRestaurant, getAllRestaurants, addBrancheToRestaurant, addMenuItemsToRestaurant };