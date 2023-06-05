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

// Update Cover
const updateCover = catchAsyncErrors(async (req, res, next) => {
    const fileName = req.file.filename;
    const filePath = `./upload/cover/${fileName}`;
    const user = await User.findById(req.user._id);

    // Delete previous image from bucket
    const prevUrl = user.cover.split(`${bucketName}/`)[1];
    const deletePrevImg = async () => {
        await bucket.file(prevUrl).delete();
    };
    if (prevUrl) deletePrevImg().catch(console.error);

    // Uploads a local file to the bucket
    const { url } = await bucketUpload(filePath, `cover/${fileName}`);

    // Deleting local file
    await fs.unlinkSync(filePath);

    // Update ImagePath to the database
    user.cover = url;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Cover image updated successfully",
        data: url,
    });
});

module.exports = updateCover;
