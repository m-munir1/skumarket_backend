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

// create new user
const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, companyName, email, password } = req.body;

    const user = await User.create({
        name,
        companyName,
        email,
        password,
    });

    // create access token
    const token = user.getJwtToken();

    // get verification token
    const verificationToken = await user.getEmailVerifyToken();

    await BillingInfo.create({ userId: user._id, addresses: [] });
    await Subscription.create({ userId: user._id });
    await user.save({ validateBeforeSave: false });

    // create verification url
    const verifyUrl = `${process.env.CLIENT_URL}/auth/email/verify/${verificationToken}`;
    const html = verifyEmailHTML(verifyUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "SKU Market Email Verification",
            html,
        });
    } catch (error) {
        user.emailVerifyToken = undefined;
        user.emailVerifyTokenExpire = undefined;
        await user.save({ validateBeforeSave: false });
    }

    res.status(201).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            companyName: user.companyName,
            email: user.email,
            role: user.role,
            docs: user.docs,
            token: token,
            createdAt: user.createdAt,
        },
    });
});

module.exports = registerUser;
