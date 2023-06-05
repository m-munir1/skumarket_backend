const catchAsyncErrors = require("../lib/catchAsyncErrors");
const AppError = require("../util/appError");
const KeywordSearchAnalytics = require("../models/keywordSearchAnalytics.model");
const { default: mongoose } = require("mongoose");

exports.create = catchAsyncErrors(async (req, res, next) => {
  const word = req.body.keyword?.toLowerCase();
  const productId = req.body.productId;

  try {
    // check if the keyword exists
    let keyword = await KeywordSearchAnalytics.findOne({ keyword: word });

    if (keyword) {
      // Add a new Entry if not already exists
      const idx = keyword.products.findIndex(({ id }) => id == productId);

      if (idx == -1) {
        keyword.products.push({ id: productId });
      } else {
        keyword.products[idx].searchCount += 1;
      }

      await keyword.save();
    } else {
      // Create a new Object
      keyword = await KeywordSearchAnalytics.create({
        keyword: word,
        products: [{ id: productId }],
      });
    }

    return res.status(201).json({
      status: "success",
      keyword,
    });
  } catch (err) {
    return next(new AppError("Something went wrong", 400));
  }
});
