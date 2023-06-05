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

// verify email
const verifyEmail = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;

    const emailVerifyToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findById(req.user._id);

    if (user.isEmailVerified) {
        return next(new AppError("Email is already verified", 400));
    }

    if (user.emailVerifyTokenExpire < Date.now()) {
        return next(new AppError("Verification token has been expired", 400));
    }

    if (user.emailVerifyToken !== emailVerifyToken) {
        return next(new AppError("Verification token is invalid", 400));
    }

    user.isEmailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Email verified successfully",
    });
});

module.exports = verifyEmail;
