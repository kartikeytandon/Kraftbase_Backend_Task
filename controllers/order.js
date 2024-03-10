const Restaurant = require('../models/restaurant')
const Order = require('../models/order')
const menuItemSchema = require('../models/menuItems')
const Agents = require('../models/deliveryAgent')

exports.addRestaurant = async (req, res) => {
    try {
        const { name, location, menu, pricing } = req.body

        const restaurant = await Restaurant.create({
            name,
            location,
            menu,
            pricing
        })

        const menuItems = menu.map(item => ({
            itemName: item.itemName,
            description: item.description,
            price: item.price
        }));

        // const ids = await menuItemSchema.insertMany(menuItems)
        // await Restaurant.findByIdAndUpdate(restaurant._id, { $push: { menuItemIds: ids._id } })

        const insertedMenuItems = await menuItemSchema.insertMany(menuItems)
        const menuItemIds = insertedMenuItems.map(item => item._id)
        await Restaurant.findByIdAndUpdate(restaurant._id, { $push: { menuItemIds: { $each: menuItemIds } } })

        res.status(200).json({
            success: true,
            message: `Restaurant named ${name} created successfully`
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({})

        res.status(200).json({
            success: true,
            restaurants
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getOnlineRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isOnline: true });

        res.status(200).json({
            success: true,
            restaurants
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getOfflineRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ isOnline: true });

        res.status(200).json({
            success: true,
            restaurants
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.createOrder = async (req, res) => {
    try {
        const { restaurantId } = req.params
        const { orderedItems }  = req.body
        const restaurant = await Restaurant.findOne({ _id: restaurantId, isOnline: true })

        if(!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        // console.log(orderedItems) 

        const order = await Order.create({
            user: req.user._id,
            restaurant: restaurantId,
            orderedItems: orderedItems,
        })

        // console.log(order)
        // console.log(orderedItems)

        await Restaurant.findByIdAndUpdate(restaurantId, { $push: { orders: order._id } })

        let totalPrice = 0
        for(const itemId of orderedItems) {
            const menuItem = await menuItemSchema.findById(itemId)
            totalPrice += menuItem.price
        }

        await Order.findByIdAndUpdate(order._id, { totalPrice: totalPrice })

        res.status(200).json({
            success: true,
            message: "Order placed successfully, waiting for Restaurent to accept it!"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { restaurant_id, order_id } = req.params
        const { status } = req.body

        const restaurant = await Restaurant.findOne({ _id: restaurant_id, isOnline: true })
        if(!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }
        const order = await Order.findOne({ _id: order_id })
        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        await Order.findByIdAndUpdate(order_id, { status: status })

        if(status === "accepted") {
            const agents = await Agents.find({ isAvailable: true })
            // console.log(agents)

            if(agents.length > 0) {
                const randomIndex = Math.floor(Math.random() * agents.length)
                const assignedAgent = agents[randomIndex]
                // console.log(assignedAgent)
                await Order.findByIdAndUpdate(order_id, {deliveryAgent: assignedAgent._id})
                await Agents.findByIdAndUpdate(assignedAgent._id, {isAvailable: false})
                await Agents.findByIdAndUpdate(assignedAgent._id, {orders: order})
    
                res.status(200).json({
                    success: true,
                    message: `Order status updated to ${status} and your order will be delivered by ${assignedAgent.name}`
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: `Order status updated to ${status} but no delivery agent available right now!`
                })
            }
        }
        // console.log(order.status)
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateRestaurantStatus = async (req, res) => {
    try {
        const { restaurant_id } = req.params
        const restaurant = await Restaurant.findOne({ _id: restaurant_id })
        if(!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        await Restaurant.findByIdAndUpdate(restaurant_id, { isOnline: !restaurant.isOnline })

        res.status(200).json({
            success: true,
            message: `Restaurant Status Updated`
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.giveOrderRating = async (req, res) => {
    try {
        const { order_id } = req.params
        const { rating } = req.body

        const order = await Order.findById(order_id)
        if(!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rating. Rating must be between 1 and 5.'
            })
        }

        await Order.findByIdAndUpdate(order_id, { rating: rating })
        
        res.status(200).json({
            success: true,
            message: `Rating given to your order`
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.giveRestaurantRating = async (req, res) => {
    try {
        const { restaurant_id } = req.params
        const { rating } = req.body

        const restaurant = await Restaurant.findById(restaurant_id)
        if(!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            })
        }

        if(!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rating. Rating must be between 1 and 5.'
            })
        }

        let prevRating = restaurant.rating
        if(prevRating === 0) {
            await Restaurant.findByIdAndUpdate(restaurant_id, { rating: rating })
        } else {
            let newRating = (prevRating + rating)/2
            await Restaurant.findByIdAndUpdate(restaurant_id, { rating: newRating })
        }
        
        res.status(200).json({
            success: true,
            message: `Rating given to the Restaurant`
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}