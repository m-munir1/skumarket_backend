const {
  createOrder,
  getOrders,
  updateOrder,
  getOrderById,
} = require("../controllers/order.controller");
const protect = require("../middleware/protect");

const router = require("express").Router();

router.route("/create").post(protect, createOrder);
router.route("/getAll").get(protect, getOrders);
router.route("/getOrder/:id").get(protect,getOrderById)
router.route("/update/:id").patch(protect, updateOrder);

// export router
module.exports = router;
