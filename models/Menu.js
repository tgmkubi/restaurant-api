const mongoose = require('mongoose');
const { Schema } = mongoose;

const MenuSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
    },
    items: [{
        type: mongoose.Schema.ObjectId,
        ref: "MenuItem"
    }],
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    price: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('Menu', MenuSchema);