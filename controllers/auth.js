const User = require("../models/User");
const asyncErrorWrapper = require('express-async-handler');
const { sendJwtToClient } = require('../helpers/authorization/tokenHelpers');
const CustomError = require('../helpers/error/CustomError');
const { validateUserInput, comparePassword } = require('../helpers/input/inputHelpers'); // TODO
const sendEmail = require('../helpers/libraries/sendEmail');

const register = asyncErrorWrapper(async (req, res, next) => {
    const { username, email, password, age, gender, addresses, location, role } = req.body;

    const user = await User.create({
        username,
        email,
        password,
        age,
        gender,
        addresses,
        location,
        role
    });

    sendJwtToClient(user, res);
});

const login = asyncErrorWrapper(async (req, res, next) => {

    const { username, password } = req.body;

    if (!validateUserInput(username, password)) {
        return next(new CustomError("Please check your inputs", 400));
    };

    const user = await User.findOne({ username }).select("+password");

    const result = await comparePassword(password, user.password);
    if (!result) {
        return next(new CustomError("Please check your credentials", 400));
    }

    sendJwtToClient(user, res);
});

const getUser = (req, res, next) => {
    return res.status(200).json({
        success: true,
        data: {
            id: req.user.id,
            username: req.user.username
        }
    });
};

const logout = asyncErrorWrapper(async (req, res, next) => {
    const { JWT_COOKIE, NODE_ENV } = process.env;

    return res.status(200)
        // .cookie("access_token", null, {
        //     httpOnly: true,
        //     expires: new Date(Date.now()),
        //     secure: NODE_ENV === "development" ? false : true,
        // })
        .clearCookie('access_token')
        .json({
            success: true,
            message: "Logout Successfull"
        })
});

const imageUpload = asyncErrorWrapper(async (req, res, next) => {

    const user = await User.findByIdAndUpdate(req.user.id, {
        "profileImage": req.savedProfiledImage
    }, {
        new: true,
        runValidators: true
    });
    return res.status(200)
        .json({
            success: true,
            message: "Image Upload Successful"
        });
});

const forgotPassword = asyncErrorWrapper(async (req, res, next) => {
    const resetEmail = req.body.email;
    const user = await User.findOne({ email: resetEmail });
    if (!user) {
        return next(new CustomError("There is no user with that email", 400))
    };
    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    const { URL, PORT } = process.env;
    const resetPaswwordUrl = `${URL}${PORT}/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`;

    const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href = '${resetPaswwordUrl}' target = "_blank">link</a> will expire in 1 hour</p>
    `;
    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        })
        return res.status(200)
            .json({
                success: true,
                message: `Token sent to: ${user.email}. Check your inbox in order to reset your password.`
            });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new CustomError("Email could not be sent", 500));
    }
});

const resetPassword = asyncErrorWrapper(async (req, res, next) => {

    const { resetPasswordToken } = req.query;
    const { password } = req.body;

    if (!resetPasswordToken) {
        return next(new CustomError("Please provide a valid Reset Password Token", 400));
    };

    let user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new CustomError("Invalid Token or Session Expired", 400));
    };

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Reset Password Process Successful"
    })
});

const editUser = asyncErrorWrapper(async (req, res, next) => {
    const filter = { _id: req.user.id };
    const update = req.body;
    const user = await User.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: user
    });

});

module.exports = { register, login, getUser, logout, imageUpload, forgotPassword, resetPassword, editUser };