const {
  newOrder,
  initializePayment,
  getPayment,
  paymentCallback,
  cancelPayment,
  removeOrderFromPayment,
} = require("../controllers/payments.controller");

const protect = require("../middleware/protect");
const router = require("express").Router();

//router.use(protect);

router.route("/").get(protect, getPayment);
router.route("/initialize").post(protect, initializePayment);
router.route("/response").patch(protect, paymentCallback);
router.route("/cancel/:id").patch(protect, cancelPayment);
router.route("/remove").patch(protect, removeOrderFromPayment);

// export router
module.exports = router;
