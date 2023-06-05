const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const AppError = require("../../util/appError");
const { sendEmail } = require("../../lib/nodemailer");
const BillingInfo = require("../../models/billingInfo.model");
const Subscription = require("../../models/subscription.model");
const catchAsyncErrors = require("../../lib/catchAsyncErrors");
const verifyEmailHTML = require("../../util/template/verifyEmailHTML");
const activationEmailHTML = require("../../util/template/activationEmailHTML");
const { bucket, bucketName, bucketUpload } = require("../../lib/googleBucket");
const resetPasswordEmailHTML = require("../../util/template/resetPasswordEmailHTML");

// Make active an user
const activateUser = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.body;
    const adminId = req.user._id;

    const admin = await User.findById(adminId);

    if (admin.role !== "admin") {
        return next(
            new AppError("You are not authorized to make user active", 401)
        );
    }

    const user = await User.findById(userId);

    user.status = "active";
    await user.save();

    const html = activationEmailHTML();

    try {
        await sendEmail({
            email: user.email,
            subject: "SKU Markets account is activated",
            html,
        });
    } catch (error) {
        console.log(error);
    }

    res.status(200).json({
        success: true,
        message: "User activated successfully",
    });
});

module.exports = activateUser;
