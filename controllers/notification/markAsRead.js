const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const Notification = require("../../models/notification.model");
const AppError = require("../../util/appError");

// find notification by id and update it to read
const markAsRead = catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { read: true }
    );

    if (!notification) {
        return next(new AppError("Notification not found", 404));
    }

    res.status(200).json({
        success: true,
    });
});

module.exports = markAsRead;
