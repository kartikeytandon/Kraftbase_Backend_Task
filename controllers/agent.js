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
        // using agent Id here
        const { order_id } = req.params
        const { deliveryStatus } = req.body
        const agent = await Agent.findById(order_id)

        if(!agent) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
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

exports.giveDeliveryRating = async (req, res) => {
    try {
        const { agent_id } = req.params
        const { rating } = req.body

        const agent = await Agent.findById(agent_id)
        if(!agent) {
            return res.status(404).json({
                success: false,
                message: 'Agent not found'
            })
        }

        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rating. Rating must be between 1 and 5.'
            })
        }

        let prevRating = agent.rating
        if(prevRating === 0) {
            await Agent.findByIdAndUpdate(agent_id, { rating: rating })
        } else {
            let newRating = (prevRating + rating)/2
            await Agent.findByIdAndUpdate(agent_id, { rating: newRating })
        }
        
        res.status(200).json({
            success: true,
            message: `Rating given to your delivery agent`
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}