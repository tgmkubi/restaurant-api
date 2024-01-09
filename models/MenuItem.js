const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuItemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    category: {
        type: String,
        enum: ["beverage", "meal"],
        required: [true, 'Category is required'],
    },
    size: {
        type: String,
        enum: ["small", "medium", "large"],
        required: [true, 'Size is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);