const { read } = require("../controllers/sellerBoardFlowSetup.controller");
const protect = require("../middleware/protect");

const router = require("express").Router();

router.route("/").get(protect, read);

// export router
module.exports = router;
