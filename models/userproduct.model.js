const mongoose = require("mongoose");

const userProduct = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },

  product: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        requried: [true, "Product is required"],
      },
      SkuNumber: {
        type: String,
        required: [true, "Sku is required"],
      },
      sku_marketplace: {
        type: String,
      },
      partnerSku: {
        type: String,
        required: [true, "Partner SKU is required"],
      },
      estimatedOrderQty: {
        type: Number,
        required: [true, "Estimated Order Qty is required"],
      },
      estimatedUnitCost: {
        type: Number,
        required: [true, "Estimated Unit Cost is required"],
      },
      status: {
        type: Boolean,
        default: 1,
      },
    },
  ],
});

const UserProduct = mongoose.model("UserProduct", userProduct);

module.exports = UserProduct;
