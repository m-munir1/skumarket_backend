const router = require("express").Router();
const {
    getConversation,
    getConversationById,
    sendMessage,
} = require("../controllers/message.controller");
const upload = require("../lib/multer");
const protect = require("../middleware/protect");

router.use(protect);

router
    .route("/")
    .get(getConversation)
    .post(upload.single("chat_file"), sendMessage);

router.route("/:id").get(getConversationById);

module.exports = router;
