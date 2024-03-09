const mongoose = require('mongoose');
// const menuItemSchema = require('../models/menuItems')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    orderedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'menuItemSchema',
    }],
    totalPrice: {
        type: Number,
        // required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'delivered'],
        default: 'pending'
    },
    deliveryAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryAgent'
    }
})

module.exports = mongoose.model("Order", orderSchema)