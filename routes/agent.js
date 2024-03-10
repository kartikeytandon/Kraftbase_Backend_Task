const express = require("express")
const { addAgent, updateDeliveryStatus, giveDeliveryRating } = require("../controllers/agent")
const { isAuthenticated } = require("../middlewares/auth")

const router = express.Router()

router.route('/addAgent').post(addAgent)
router.route('/updateDeliveryStatus/:order_id').patch(updateDeliveryStatus)
router.route('/giveDeliveryRating/:agent_id').patch(isAuthenticated, giveDeliveryRating)

module.exports = router 