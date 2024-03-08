const User = require('../models/user')
const Restaurant = require('../models/restaurant')
// const menuItemSchema = require('../models/menuItems')

exports.addRestaurant = async (req, res) => {
    try {
        const { name, location, menu, pricing } = req.body

        await Restaurant.create({
            name,
            location,
            menu,
            pricing
        })

        res.status(200).json({
            success: true,
            message: 'Restaurants created successfully'
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
    try {0
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