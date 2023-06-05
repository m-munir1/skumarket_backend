const mongoose = require("mongoose");

const userHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    recentlyVisitedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    searchedKeywords: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserHistory = mongoose.model("UserHistory", userHistorySchema);

module.exports = UserHistory;
