const catchAsyncErrors = require("../lib/catchAsyncErrors");
const SellerBoardFlowSetup = require("../models/sellerBoardFlowSetup.model");
const User = require("../models/user.model");
const AppError = require("../util/appError");

// create a SellerBoardFlowSetup
const create = async (userId) => {
  try {
    const result = await SellerBoardFlowSetup.create({
      user: userId,
    });

    return result;
  } catch {
    return null;
  }
};

// fetch a SellerBoardFlowSetup
exports.read = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;

  try {
    let result = await SellerBoardFlowSetup.findOne({
      user: userId,
    });

    if (!result) {
      result = await create(userId);
    }

    res.status(201).json({ message: "success", data: result });
  } catch {
    return next(new AppError("Error fetching SellerBoard flow setup", 400));
  }
});
