const mongoose = require('mongoose');

const deliveryAgentSchema = new mongoose.Schema({
    name: String,
    isAvailable: {
        type: Boolean,
        default: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    rating: {
        type: Number,
        default: 0
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'in_progress', 'delivered'],
        default: 'pending'
    }
});

module.exports = mongoose.model('DeliveryAgent', deliveryAgentSchema)