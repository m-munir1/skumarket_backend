const mongoose = require("mongoose");

const keywordSearchAnalyticsSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: [true, "Searched Keyword is required"],
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "product is required"],
        },
        searchCount: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const KeywordSearchAnalytics = mongoose.model(
  "KeywordSearchAnalytics",
  keywordSearchAnalyticsSchema
);

module.exports = KeywordSearchAnalytics;
