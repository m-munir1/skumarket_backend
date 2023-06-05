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

// Update User Payment Info
const updatePayment = catchAsyncErrors(async (req, res, next) => {
    const { sales, subscription, ads } = req.body;

    const result = await User.updateOne(
        { _id: req.user._id },
        {
            $set: {
                defaultCurrency: subscription?.currency,
                "payment.sales": sales,
                "payment.subscription": subscription,
                "payment.ads": ads,
            },
        },
        { runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: "User Payment Info updated",
    });
});

module.exports = updatePayment;
