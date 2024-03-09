const express = require("express")
const { addRestaurant, getAllRestaurant, getOnlineRestaurant, getOfflineRestaurant, createOrder, updateOrderStatus, updateRestaurantStatus } = require("../controllers/order")
const { isAuthenticated } = require("../middlewares/auth")

const router = express.Router()

router.route('/addRestaurant').post(addRestaurant)
router.route('/getAllRestaurant').get(getAllRestaurant)
router.route('/getOnlineRestaurant').get(getOnlineRestaurant)
router.route('/getOffineRestaurant').get(getOfflineRestaurant)
router.route('/createOrder/:restaurantId').post(isAuthenticated, createOrder)
router.route('/updateOrderStatus/:restaurant_id/:order_id').patch(updateOrderStatus)
router.route('/updateRestaurantStatus/:restaurant_id').patch(updateRestaurantStatus)

module.exports = router