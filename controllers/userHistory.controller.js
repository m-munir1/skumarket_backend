const catchAsyncErrors = require("../lib/catchAsyncErrors");
const AppError = require("../util/appError");
const UserHistory = require("../models/userHistory.model");
const { default: mongoose } = require("mongoose");

exports.create = catchAsyncErrors(async (req, res, next) => {
  const user = req?.user?._id;

  const keyword = req.body.keyword?.toLowerCase();
  const productId = req.body.productId;

  try {
    // check if the user history exists
    let userHistory = await UserHistory.findOne({ user });

    if (userHistory) {
      if (
        productId &&
        !userHistory.recentlyVisitedProducts.includes(productId)
      ) {
        userHistory.recentlyVisitedProducts.push(productId);
      }

      if (keyword && !userHistory.searchedKeywords.includes(keyword)) {
        userHistory.searchedKeywords.push(keyword);
      }

      await userHistory.save();
    } else {
      const data = {
        user,
        recentlyVisitedProducts: productId ? [productId] : [],
        searchedKeywords: keyword ? [keyword] : [],
      };

      userHistory = await UserHistory.create(data);
    }

    return res.status(201).json({
      status: "success",
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 400));
  }
});

exports.read = catchAsyncErrors(async (req, res, next) => {
  const user = req?.user?._id;

  const limit = Number(req?.query?.limit) || 20;
  const field = req?.query?.field;

  try {
    // check if the user history exists
    const userHistory = await UserHistory.aggregate([
      {
        $match: { user: mongoose.Types.ObjectId(user) },
      },
      {
        $project: {
          _id: 0,
          [field]: {
            $reverseArray: `$${field}`, // reverse the array
          },
        },
      },
      {
        $project: {
          [field]: {
            $slice: [`$${field}`, limit], // get the first `limit` number of elements
          },
        },
      },
    ]);

    return res.status(200).json({
      status: "success",
      data: userHistory[0],
    });
  } catch (err) {
    console.log(err);
    return next(new AppError("Something went wrong", 400));
  }
});
