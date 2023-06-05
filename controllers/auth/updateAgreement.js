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

// Update Agreement Accepting
const updateAgreement = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { type, seller_type } = req.body;

    user.agreement[type] = true;

    if (seller_type) {
        user.seller_type = seller_type;
    }

    user.save({ validateBeforeSave: true });

    res.status(200).json({
        success: true,
        message: "Agreement updated successfully",
    });
});

module.exports = updateAgreement;
