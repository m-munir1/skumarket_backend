const {
    getAlerts,
    Alert,
    deleteAlert,
    createManyAlerts,
    getSingleAlert,
} = require("../controllers/alert.controller");
const router = require("express").Router();
const protect = require("../middleware/protect");

router.use(protect);

router.route("/").post(Alert).get(getAlerts);
router.route("/bulk").post(createManyAlerts);
router.route("/:id").delete(deleteAlert);
router.route("/get/:id").get(getSingleAlert);

module.exports = router;
