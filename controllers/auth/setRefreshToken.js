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

// set refresh token
const setRefreshToken = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // get refresh token
    const refreshToken = user.getRefreshToken();

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        refreshToken,
    });
});

module.exports = setRefreshToken;
