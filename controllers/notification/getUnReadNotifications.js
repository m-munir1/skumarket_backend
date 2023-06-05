const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const Notification = require("../../models/notification.model");

const getUnReadNotifications = catchAsyncErrors(async (req, res, next) => {
    const page = req.query?.page * 1 || 1;
    const limit = req.query?.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({
        user: req.user._id,
        read: false,
    })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Notification.countDocuments({
        user: req.user._id,
        read: false,
    });

    res.status(200).json({
        success: true,
        total,
        notifications,
    });
});

module.exports = getUnReadNotifications;
