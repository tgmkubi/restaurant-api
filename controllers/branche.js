const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const Branche = require('../models/Branche');

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

module.exports = { createBranche };
