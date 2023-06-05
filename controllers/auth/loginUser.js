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

// login user
const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password is entered by user
    if (!email || !password) {
        return next(new AppError("Please enter email and password", 400));
    }

    // finding user in database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new AppError("Invalid Email or Password", 401));
    }

    // check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new AppError("Invalid Email or Password", 401));
    }

    // check if the user is active or not
    if (user.status !== "active" && user.isProfileComplete) {
        return next(new AppError("This account isn't active yet", 401));
    }

    // create token
    const token = user.getJwtToken();

    res.status(200).json({
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
            token,
        },
    });
});

module.exports = loginUser;
