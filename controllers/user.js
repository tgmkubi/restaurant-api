const asyncErrorWrapper = require('express-async-handler');

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    const user = req.user;

    return res.status(200).json({
        success: true,
        data: user
    })
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {

    return res.status(200).json(res.queryResults);
});

module.exports = { getSingleUser, getAllUsers };