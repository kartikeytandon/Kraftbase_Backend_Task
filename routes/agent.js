const express = require("express")
const { addAgent, updateDeliveryStatus } = require("../controllers/agent")

const router = express.Router()

router.route('/addAgent').post(addAgent)
router.route('/updateDeliveryStatus/:order_id').patch(updateDeliveryStatus)

module.exports = router 