const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    restaurant: {
        type: mongoose.Schema.ObjectId,
        ref: "Restaurant"
    },
    order: {
        type: mongoose.Schema.ObjectId,
        unique: true,
        ref: "Order"
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
    },
    rating: {
        type: String,
        required: [true, 'Rating is required'],
    },
});

module.exports = mongoose.model('Review', ReviewSchema);