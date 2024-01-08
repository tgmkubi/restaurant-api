const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        minlength: [6, "Please provide a valid password with min length 6"],
        required: [true, 'Password is required'],
        select: false
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 18
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, 'Gender is required'],
    },
    profileImage: {
        type: String,
        default: "default.jpg"
    },
    addresses: [{
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        district: {
            type: String,
            required: [true, 'District is required'],
        },
        street: {
            type: String,
            required: [true, 'Street is required'],
        },
    }],
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    blocked: {
        type: Boolean,
        default: false
    },
});

// Methods
UserSchema.methods.generateJwtFromUser = function () {

    //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    const payload = {
        id: this._id,
        name: this.name,
    }
    const options = {
        expiresIn: JWT_EXPIRE
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, options);

    return token;
};

UserSchema.methods.getResetPasswordToken = function () {
    const randomHexString = crypto.randomBytes(15).toString("hex");
    // console.log(randomHexString);

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex");
    // console.log(resetPasswordToken);

    this.resetPasswordToken = resetPasswordToken;
    const { RESET_PASSWORD_EXPIRE } = process.env;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
};

// Password Hash
UserSchema.pre('save', function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            // Store hash in your password DB.
            this.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('User', UserSchema);