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

//send email verification token
const sendEmailVerificationToken = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    // get verification token
    const token = await user.getEmailVerifyToken();

    await user.save({ validateBeforeSave: false });

    // create verification url
    const verifyUrl = `${process.env.CLIENT_URL}/auth/email/verify/${token}`;

    const html = verifyEmailHTML(verifyUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "SKU Market Email Verification",
            html,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.emailVerifyToken = undefined;
        user.emailVerifyTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError(error.message, 500));
    }
});

module.exports = sendEmailVerificationToken;
