const jwt = require('jsonwebtoken');
const CustomError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const User = require("../../models/User");
const { isTokenIncluded, getAccessTokenFromHeader } = require('../../helpers/authorization/tokenHelpers');

// const getAccessToRoute = async (req, res, next) => {
//     const { JWT_SECRET_KEY } = process.env;
//     if (!isTokenIncluded(req)) {
//         return next(new CustomError('You are not authorized to access this route', 401));
//     }
//     const access_token = getAccessTokenFromHeader(req);

//     jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return next(new CustomError('You are not authorized to access this route', 401));
//         };

//         req.user = {
//             id: decoded.id,
//             username: decoded.username,
//         }

//         // console.log(decoded);

//         next();
//     });
// };

const getAccessToRoute = async (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;

    if (!isTokenIncluded(req)) {
        return next(new CustomError('You are not authorized to access this route', 401));
    }

    const access_token = getAccessTokenFromHeader(req);

    jwt.verify(access_token, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return next(new CustomError('You are not authorized to access this route', 401));
        }

        const user = await User.findById(decoded.id);

        req.user = {
            id: decoded.id,
            username: decoded.username,
            location: user.location
        };

        next();
    });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (user.role !== "admin") {
        return next(new CustomError('Only admins can access this route', 403));
    }
    next();
});

// const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
//     const userId = req.user.id;
//     const questionId = req.params.id;

//     const question = await Question.findById(questionId);

//     if (question.user != userId) {
//         return next(new CustomError("Only owner can handle this operation", 403));
//     }
//     next();
// });

// const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
//     const userId = req.user.id;
//     const answer = req.answer;

//     if (answer.user != userId) {
//         return next(new CustomError("Only owner can handle this operation", 403));
//     }
//     next();
// });
module.exports = { getAccessToRoute, getAdminAccess};