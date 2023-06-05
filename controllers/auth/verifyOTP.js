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

// verify OTP
const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user.isWhatsappVerified) {
        return next(new AppError("Already verified", 400));
    }

    if (!user.otp) {
        return next(new AppError("Verification failed.", 400));
    }

    const isVerified = await user.verifyOTP(req.body.otp);
    if (!isVerified) {
        return next(new AppError("Invalid OTP", 400));
    }

    if (user.otpExpire < Date.now()) {
        return next(new AppError("OTP has been expired", 400));
    }

    user.otp = undefined;
    user.otpExpire = undefined;
    user.isWhatsappVerified = true;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "OTP verified successfully",
    });
});

module.exports = verifyOTP;
