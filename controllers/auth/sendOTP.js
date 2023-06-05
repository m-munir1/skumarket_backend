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

// send OTP to user phone
const sendOTP = catchAsyncErrors(async (req, res, next) => {
    const { phone } = req.body;
    const user = await User.findById(req.user._id);

    // get OTP
    const otp = await user.getOTP();

    await user.save({ validateBeforeSave: false });

    try {
        // ------------------- Have to send sms --------------------
        // await sendSMS({
        //   to: phone,
        //   message: `Your OTP is ${otp}`,
        // });

        res.status(200).json({
            success: true,
            message: `OTP sent to: ${phone}`,
        });
    } catch (error) {
        user.otp = undefined;
        user.otpExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError(error.message, 500));
    }
});

module.exports = sendOTP;
