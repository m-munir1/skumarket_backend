const {
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    getNotifications,
    markAllAsRead,
    getUnReadNotifications,
} = require("../controllers/notification");

const protect = require("../middleware/protect");
const router = require("express").Router();

router.use(protect);

router
    .route("/")
    .put(markAllAsRead)
    .delete(deleteAllNotifications)
    .get(getNotifications);

router.route("/unread").get(getUnReadNotifications);

router.route("/:id").delete(deleteNotification).put(markAsRead);

// export router
module.exports = router;
