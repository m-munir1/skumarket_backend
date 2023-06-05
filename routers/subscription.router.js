const router = require("express").Router();
const protect = require("../middleware/protect");

const {
  createSubscription,
  getSubscription,
  makePayment,
  cancelSubscription,
} = require("../controllers/subscription.controller");

router.route("/create").patch(protect, createSubscription);
router.route("/get-all").get(protect, getSubscription);
router.route("/make-payment").put(protect, makePayment);
router.route("/cancel").put(protect, cancelSubscription);

module.exports = router;
