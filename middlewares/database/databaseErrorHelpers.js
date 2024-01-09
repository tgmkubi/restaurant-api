const User = require('../../models/User');
const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../../helpers/error/CustomError');
const Restaurant = require('../../models/Restaurant');
const Menu = require('../../models/Menu');
const MenuItem = require('../../models/MenuItem');

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

    const restaurant = await Restaurant.findById({ _id: restaurant_id });

    if (!restaurant) {
        return next(new CustomError("There is no such restaurant with that id"));
    };

    req.restaurant = restaurant;
    next();

    return next();
});


const checkMenuExist = asyncErrorWrapper(async (req, res, next) => {

    const { menuId } = req.params;

    const menu = await Menu.findById(menuId);

    if (!menu) {
        return next(new CustomError("There is no such menu with that id"));
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

// const checkQuestionExist = asyncErrorWrapper(async (req, res, next) => {
//     const question_id = req.params.id || req.params.question_id;
//     const question = await Question.findById({ _id: question_id });

//     if (!question) {
//         return next(new CustomError("There is no such question with that id"));
//     }

//     req.question = question;
//     next();
// });

// const checkQuestionAndAnswerExist = asyncErrorWrapper(async (req, res, next) => {
//     const { question_id } = req.params;
//     const { answer_id } = req.params;
//     const answer = await Answer.findOne({
//         _id: answer_id,
//         question: question_id
//     });

//     if (!answer) {
//         return next(new CustomError("There is no answer with that id associated with question id", 400));
//     };

//     req.answer = answer;
//     next();
// });
module.exports = { checkUserExist, checkRestaurantExist, checkMenuExist, checkMenuItemExist };