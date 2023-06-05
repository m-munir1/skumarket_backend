const router = require("express").Router();
const protect = require("../middleware/protect");
const {
  getBillingInfo,
  updateBillingInfo,
  addAddress,
  updateDefaultAddress,
} = require("../controllers/billingInfo.controller");

router.route("/get").get(protect, getBillingInfo);
router.route("/update").patch(protect, updateBillingInfo);
router.route("/add").patch(protect, addAddress);
router.route("/update-default-address").patch(protect, updateDefaultAddress);

module.exports = router;
