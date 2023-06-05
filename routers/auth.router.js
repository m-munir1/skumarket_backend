const router = require("express").Router();
const protect = require("../middleware/protect");
const upload = require("../lib/multer");

const {
    sendOTP,
    updateMe,
    verifyOTP,
    loginUser,
    uploadDocs,
    logoutUser,
    deleteDocs,
    verifyEmail,
    updateCover,
    registerUser,
    updateAvatar,
    activateUser,
    updatePayment,
    resetPassword,
    getUserProfile,
    updatePassword,
    forgotPassword,
    updateDocsInfo,
    updateAgreement,
    completeProfile,
    setRefreshToken,
    getUserShareProfile,
    sendEmailVerificationToken,
} = require("../controllers/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logoutUser);
router.route("/password/update").put(protect, updatePassword);
router.route("/refresh_token").get(protect, setRefreshToken);
router.route("/email/verify/:token").get(protect, verifyEmail);
router
    .route("/send/email/verify/token")
    .get(protect, sendEmailVerificationToken);
router.route("/send/otp").post(protect, sendOTP);
router.route("/verify/otp").post(protect, verifyOTP);

router.route("/updateMe").put(protect, updateMe);
router.route("/avatar").patch(protect, upload.single("avatar"), updateAvatar);
router.route("/user").get(protect, getUserProfile);
router.route("/usershare").post(getUserShareProfile);
router.route("/agreement").patch(protect, updateAgreement);
router.route("/cover").patch(protect, upload.single("cover"), updateCover);
router.route("/docs/:field").patch(protect, upload.single("docs"), uploadDocs);
router.route("/update-docs-info").patch(protect, updateDocsInfo);
router.route("/complete-profile").patch(protect, completeProfile);
router.route("/docs-delete").patch(protect, deleteDocs);
router.route("/activate-user").patch(protect, activateUser);
router.route("/update-payment").patch(protect, updatePayment);

// ------------ Update All User -------------
// router.route("/update-all").patch(updateAll);

module.exports = router;
