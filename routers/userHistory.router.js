const { create, read } = require("../controllers/userHistory.controller");
const protect = require("../middleware/protect");

const router = require("express").Router();

router.route("/").get(protect, read).post(protect, create);

// export router
module.exports = router;
