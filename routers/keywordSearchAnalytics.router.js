const { create } = require("../controllers/keywordSearchAnalytics.controller");
const protect = require("../middleware/protect");

const router = require("express").Router();

router.route("/").post(create);

// export router
module.exports = router;
