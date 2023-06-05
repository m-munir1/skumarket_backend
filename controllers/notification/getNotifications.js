const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const Notification = require("../../models/notification.model");

// get all notifications
const getNotifications = catchAsyncErrors(async (req, res, next) => {
    const page = Number(req.query?.page * 1) || 1;
    const limit = Number(req.query?.limit * 1) || 10;
    const range_start = Number(req.query?.range_start) || 1671519571904;
    const range_end = Number(req.query?.range_end) || Date.now();
    const search = req.query?.search || "";
    const skip = (page - 1) * limit;

    const query = {
        user: req.user._id,
        $or: [{ message: { $regex: search, $options: "-i" } }],
        createdAt: { $gte: range_start, $lte: range_end },
    };

    const notifications = await Notification.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);

    res.status(200).json({
        success: true,
        total,
        notifications,
    });
});

module.exports = getNotifications;
