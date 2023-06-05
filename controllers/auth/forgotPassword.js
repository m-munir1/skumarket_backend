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

// forgot password
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError("User not found with this email", 404));
    }

    // get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // create reset password url
    const resetUrl = `${process.env.CLIENT_URL}/password/reset/${resetToken}`;

    // forget password email template
    const html = resetPasswordEmailHTML(resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "SKU Market Password Recovery",
            html,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        console.log(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new AppError(error.message, 500));
    }
});

module.exports = forgotPassword;
