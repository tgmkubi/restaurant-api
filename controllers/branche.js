const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const Branche = require('../models/Branche');
const { checkRestaurantExist } = require('../middlewares/database/databaseErrorHelpers');
const Restaurant = require('../models/Restaurant');

const createBranche = asyncErrorWrapper(async (req, res, next) => {
    const { name, address } = req.body;

    const branche = await Branche.create({
        name: name,
        address: {
            location: {
                type: address.location.type,
                coordinates: address.location.coordinates
            },
            city: address.city,
            district: address.district,
            street: address.street
        },
    });

    if (!branche) {
        return next(new CustomError("Please check your inputs", 400));
    }

    return res.status(200).json({
        success: true,
        data: branche
    })
});

const deleteBranche = asyncErrorWrapper(async (req, res, next) => {

    const { brancheId } = req.params;

    // Branche'ı sil
    const deletedBranche = await Branche.findByIdAndDelete(brancheId);

    if (!deletedBranche) {
        return next(new CustomError("Branche not found.", 404));
    }

    // Eğer Restaurant referansı varsa, Restaurant'ın branches dizisinden çıkar
    if (deletedBranche.restaurant) {
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            deletedBranche.restaurant,
            { $pull: { branches: brancheId } },
            { new: true }
        );

        if (!updatedRestaurant) {
            return next(new CustomError("Error updating the associated Restaurant.", 500));
        }
    }

    return res.status(200).json({
        success: true,
        data: "Branche deleted."
    });
});

const getAllBranchesOfRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant } = req;

    await restaurant.populate('branches');

    return res.status(200).json({
        success: true,
        data: {
            restaurant: restaurant.name,
            branches: restaurant.branches
        }
    });
});

const getSingleBrancheDetailOfRestaurant = asyncErrorWrapper(async (req, res, next) => {

    const { restaurant, branche } = req;

    if (branche.restaurant && (restaurant._id.toString() === branche.restaurant.toString())) {
        return res.status(200).json({
            success: true,
            data: branche
        });
    } else {
        return next(new CustomError("Branche is not exist in this Restaurant's Branches.", 400));
    }


});

module.exports = { createBranche, deleteBranche, getAllBranchesOfRestaurant, getSingleBrancheDetailOfRestaurant };
