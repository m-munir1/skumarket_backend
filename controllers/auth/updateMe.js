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

// update me details
const updateMe = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        country: req.body.country,
        city: req.body.city,
        zipCode: req.body.zipCode,
        state: req.body.state,
        about: req.body.about,
    };

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
        runValidators: true,
    });

    // find those users who's country is same as empty and update it with new country name "test"
    // await User.updateMany(
    //     { companyName: "" },
    //     { $set: { companyName: "test" } },
    //     { multi: true }
    // );

    res.status(200).json({
        success: true,
        user,
    });
});

module.exports = updateMe;
