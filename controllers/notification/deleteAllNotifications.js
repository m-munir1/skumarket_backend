const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const Notification = require("../../models/notification.model");

// delete all notifications
const deleteAllNotifications = catchAsyncErrors(async (req, res, next) => {
    await Notification.deleteMany({ user: req.user._id });

    res.status(200).json({
        success: true,
    });
});

module.exports = deleteAllNotifications;
