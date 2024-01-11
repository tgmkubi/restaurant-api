const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: "Restaurant"
    },
    items: [{
        menu: {
            type: mongoose.Schema.ObjectId,
            ref: "Menu"
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    date: {
        type: Date,
        default: Date.now
    },
    review: {
        type: mongoose.Schema.ObjectId,
        ref: "Review"
    }
});

module.exports = mongoose.model('Order', OrderSchema);