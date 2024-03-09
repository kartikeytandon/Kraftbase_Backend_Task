const mongoose = require('mongoose');
// const menuItemSchema = require('../models/menuItems')

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: String,
    location: String,
    // menu: [menuItemSchema],
    // menu: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'menuItems'
    // }],
    menu: [{
        itemName: {
            type: String,
            required: true
        },
        description: String,
        price: {
            type: Number,
            required: true
        }
    }],
    pricing: String,
    isOnline: {
        type: Boolean,
        default: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    menuItemIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menuItemSchema',
    }],
    rating: Number
})

module.exports = mongoose.model("Restaurant", restaurantSchema)