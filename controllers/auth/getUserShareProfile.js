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

// User share profile publicaly
const getUserShareProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ _id: req.body.userid });

    if (!user) return next(new AppError("Sorry user not found", 400));
    return res.status(200).json({
        success: true,
        user: {
            _id: user._id,
            name: user.name,
            companyName: user.companyName,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            state: user.state,
            phone: user.phone,
            location: user?.location,
            address: user.address,
            country: user.country,
            zipCode: user.zipCode,
            city: user.city,
            about: user.about,
            avatar: user?.avatar,
            cover: user?.cover,
            isEmailVerified: user?.isEmailVerified,
            isWhatsappVerified: user?.isWhatsappVerified,
            agreement: user?.agreement,
            seller_type: user?.seller_type,
            docs: user?.docs,
            delivery_method: user?.delivery_method,
            defaultCurrency: user?.defaultCurrency,
            payment: user?.payment,
            isProfileComplete: user?.isProfileComplete,
        },
    });
});

module.exports = getUserShareProfile;
