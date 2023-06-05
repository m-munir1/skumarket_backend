const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const Notification = require("../../models/notification.model");

// make all unread notifications as read
const markAllAsRead = catchAsyncErrors(async (req, res, next) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );

    res.status(200).json({
        success: true,
    });
});

module.exports = markAllAsRead;
