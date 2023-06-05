const router = require("express").Router();
const { getSellerProduct } = require("../controllers/userProduct.controller");

const protect = require("../middleware/protect");

router.route("/:userid").get(getSellerProduct);
//router.use(protect);

module.exports = router;
