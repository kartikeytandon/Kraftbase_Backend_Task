const Agent = require('../models/deliveryAgent')

exports.addAgent = async (req, res) => {
    try {
        const { name } = req.body

        await Agent.create({
            name
        })

        res.status(200).json({
            success: true,
            message: `Agent named ${name} created successfully`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { order_id } = req.params
        const { deliveryStatus } = req.body
        const agent = await Agent.findById(order_id)

        if(!agent) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        await Agent.findByIdAndUpdate(order_id, { deliveryStatus: deliveryStatus })

        res.status(200).json({
            success: true,
            message: `Order Status Updated successfully to ${deliveryStatus}`
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}