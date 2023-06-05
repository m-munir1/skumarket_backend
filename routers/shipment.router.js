const {
  getShipment,
  handlePreparingShipment,
  handlePickedShipment,
  handlePackedShipment,
  handleShippedShipment,
  handleDeliveredShipmentRTV,
  handleRTVAcceptance,
  handleRTVAwaiting,
} = require("../controllers/shipment.controller");
const protect = require("../middleware/protect");

const router = require("express").Router();

router.route("/").get(protect, getShipment);
router.route("/preparing").patch(protect, handlePreparingShipment);
router.route("/picked").patch(protect, handlePickedShipment);
router.route("/packed").patch(protect, handlePackedShipment);
router.route("/shipped/:id").patch(protect, handleShippedShipment);
router.route("/deliveredRTV").patch(protect, handleDeliveredShipmentRTV);
router.route("/rtvAcceptance/:id").patch(protect, handleRTVAcceptance);
router.route("/rtvAwaiting").patch(protect, handleRTVAwaiting);

// export router
module.exports = router;
