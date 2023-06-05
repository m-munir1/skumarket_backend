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

// update / change password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    // check if previous old password
    if (!req.body.oldPassword) {
        return next(new AppError("Please enter old password", 400));
    }

    // check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new AppError("Old password is incorrect", 400));
    }

    user.password = req.body.password;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
    });
});

module.exports = updatePassword;
