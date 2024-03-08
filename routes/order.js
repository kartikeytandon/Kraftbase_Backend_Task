const express = require("express")
const { addRestaurant, getAllRestaurant, getOnlineRestaurant, getOfflineRestaurant } = require("../controllers/order")

const router = express.Router()

router.route('/addRestaurant').post(addRestaurant)
router.route('/getAllRestaurant').get(getAllRestaurant)
router.route('/getOnlineRestaurant').get(getOnlineRestaurant)
router.route('/getOffineRestaurant').get(getOfflineRestaurant)

module.exports = router