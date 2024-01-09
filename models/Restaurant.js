const mongoose = require('mongoose');
const { Schema } = mongoose;

const RestaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    logo: {
        type: String,
        default: "restaurant_logo.jpg"
    },
    address: {
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
    },
    branches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branche'
    }],
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }],
    types: [{
        type: String,
        required: [true, 'Restaurant type is required'],
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);