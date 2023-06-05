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

// Update User Docs Information
const updateDocsInfo = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id;
    const { commercial, vat, national, bank, courier, delivery_method } =
        req.body;
    const result = await User.updateOne(
        { _id: userId },
        {
            $set: {
                "docs.commercial.value": commercial,
                "docs.vat.value": vat,
                "docs.national.value": national,
                "docs.bank.value": bank,
                "docs.courier.value": courier,
                "docs.other.value": "",
                delivery_method: delivery_method,
            },
        },
        { runValidators: false }
    );
    console.log(result);

    res.status(200).json({
        success: true,
        message: "Business Info added successfully",
        data: result,
    });
});

module.exports = updateDocsInfo;
