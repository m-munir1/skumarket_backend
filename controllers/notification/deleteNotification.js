const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const Notification = require("../../models/notification.model");
const AppError = require("../../util/appError");

// delete a notification
const deleteNotification = catchAsyncErrors(async (req, res, next) => {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
        return next(new AppError("Notification not found", 404));
    }

    res.status(200).json({
        success: true,
    });
});

module.exports = deleteNotification;
