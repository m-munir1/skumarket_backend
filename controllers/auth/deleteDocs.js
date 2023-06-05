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

// Delete submitted Docs
const deleteDocs = catchAsyncErrors(async (req, res, next) => {
    const fieldName = req.body.fieldName;
    const user = await User.findById(req.user._id);

    // Delete previous doc from bucket
    const prevUrl = user.docs[fieldName]?.url?.split(`${bucketName}/`)[1];
    const deletePrevDoc = async () => {
        await bucket.file(prevUrl).delete();
    };
    if (prevUrl) deletePrevDoc().catch(console.error);

    // Update to the database
    user.docs[fieldName].url = "";
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Deleted successfully",
    });
});

module.exports = deleteDocs;
