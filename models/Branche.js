const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrancheSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true
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
    restaurant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }]
});

module.exports = mongoose.model('Branche', BrancheSchema);