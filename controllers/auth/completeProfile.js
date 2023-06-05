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

// Make Profile Complete
const completeProfile = catchAsyncErrors(async (req, res, next) => {
    const result = await User.updateOne(
        { _id: req.user._id },
        { isProfileComplete: true },
        { runValidators: true }
    );
    res.status(200).json({
        success: true,
        message: "Registration Process completed",
    });
});

module.exports = completeProfile;
